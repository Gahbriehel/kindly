"use client";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { Input } from "../../../components/FormElements/Input";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "../../../components/UI/AuthLayout";
import { useLoginMutation } from "@/src/hooks/useAuthQuery";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { yupResolver } from "@hookform/resolvers/yup";
import { ILoginPayload } from "../../../models/auth";
import { ConfirmActionModal } from "../../../components/Modals/ConfirmActionModal";
import { AxiosError } from "axios";

interface Inputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const loginMutation = useLoginMutation();
  const { user } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password",
  );
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const isOrganization = type === "organization";

  // Session conflict modal states
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<ILoginPayload | null>(
    null,
  );

  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Enter Email"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Enter Password"),
    rememberMe: yup.boolean(),
  });

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const userObj = user as any;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: userObj?.email ?? userObj?.username ?? "",
      password: "",
      rememberMe: false,
    },
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: Inputs) {
    try {
      const payload: ILoginPayload = {
        email: data.email,
        password: data.password,
        forceLogout: false,
        isOrganization,
      };

      loginMutation.mutate(payload, {
        onError: (error: AxiosError<{ message: string }>) => {
          const message = error.response?.data?.message;
          if (
            message === "You already have an active session on another device."
          ) {
            setPendingPayload(payload);
            setShowSessionModal(true);
          }
        },
      });
    } catch (error) {
      throw error;
    }
  }

  const handleForceLogoutConfirm = () => {
    if (pendingPayload) {
      loginMutation.mutate(
        {
          ...pendingPayload,
          forceLogout: true,
        },
        {
          onSettled: () => {
            setShowSessionModal(false);
          },
        },
      );
    }
  };

  const title = isOrganization ? "Organization Sign In" : "Welcome back";
  const subtext = isOrganization
    ? "Sign in to manage your templates, clients, and staff"
    : "Sign in to manage your clients and events";

  return (
    <AuthLayout
      title={title}
      subtext={subtext}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loginMutation.isPending}
      backButton
      footer={
        !isOrganization ? (
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-theme-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        ) : null
      }
    >
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Email Address"
            placeholder="Enter mail address"
            type="email"
            error={fieldState.error?.message}
            required
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Password"
            type={showPassword}
            error={errors.password?.message}
            hidePassword={() => {
              setShowPassword("password");
            }}
            showPassword={() => {
              setShowPassword("text");
            }}
            password
            required
          />
        )}
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => {
              const { value, onChange, ...rest } = field;
              return (
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-theme-primary focus:ring-theme-primary"
                  {...rest}
                />
              );
            }}
          />
          Remember me
        </label>

        <Link
          href="/forgot-password"
          className="text-gray-500 dark:text-slate-400 hover:text-theme-primary font-medium hover:underline text-xs sm:text-sm transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      {/* Active Session Confirmation Modal */}
      <ConfirmActionModal
        display={showSessionModal}
        actionName="Log Out Other Device"
        title="Active Session Found"
        message="You already have an active session on another device. Would you like to log out of all other devices and sign in here?"
        fn={handleForceLogoutConfirm}
        loading={loginMutation.isPending}
        close={() => setShowSessionModal(false)}
      />
    </AuthLayout>
  );
}
