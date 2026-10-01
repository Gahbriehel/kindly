"use client";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { Input } from "../../../components/FormElements/Input";
import { Select, ISelect } from "../../../components/FormElements/Select";
import { useMemo, useState } from "react";
import { AuthLayout } from "../../../components/UI/AuthLayout";
import { yupResolver } from "@hookform/resolvers/yup";
import { ISignUpPayload } from "../../../models/auth";
import { useSignupMutation } from "../../../hooks/useAuthQuery";
import { useCountriesQuery } from "../../../hooks/useLocationQuery";
import { RiArrowRightLine } from "react-icons/ri";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;

  // Step 2: Your business
  businessName: string;
  address: string;
  country: ISelect;
  industry: ISelect;
  estimatedClientCount: ISelect;
}

const FALLBACK_COUNTRIES = [
  { name: "Nigeria", phoneCode: "234" },
  { name: "United States", phoneCode: "1" },
  { name: "United Kingdom", phoneCode: "44" },
  { name: "Canada", phoneCode: "1" },
  { name: "South Africa", phoneCode: "27" },
  { name: "Kenya", phoneCode: "254" },
  { name: "Ghana", phoneCode: "233" },
  { name: "Australia", phoneCode: "61" },
  { name: "Germany", phoneCode: "49" },
  { name: "France", phoneCode: "33" },
  { name: "United Arab Emirates", phoneCode: "971" },
  { name: "India", phoneCode: "91" },
];

const INDUSTRY_OPTIONS = [
  "Professional services",
  "Photography / Videography",
  "Events & Wedding Planning",
  "Beauty & Wellness",
  "Creative & Design",
  "Consulting / Coaching",
  "Real Estate",
  "Financial & Accounting",
  "Legal Services",
  "Health & Fitness",
  "Other",
];

const CLIENT_COUNT_OPTIONS = [
  { label: "1 - 5 clients", value: "5" },
  { label: "6 - 15 clients", value: "15" },
  { label: "16 - 50 clients", value: "50" },
  { label: "51 - 100 clients", value: "100" },
  { label: "100+ clients", value: "200" },
];

export default function RegisterPage() {
  const signupMutation = useSignupMutation();
  const countriesQuery = useCountriesQuery();

  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password",
  );

  const countryOptions: ISelect[] = useMemo(() => {
    const list = countriesQuery.data?.data?.countries?.length
      ? countriesQuery.data.data.countries
      : FALLBACK_COUNTRIES;

    return list.map((c) => ({
      value: { _id: c.name, ...c },
      label: c.name,
    }));
  }, [countriesQuery.data]);

  const industryOptions: ISelect[] = useMemo(
    () =>
      INDUSTRY_OPTIONS.map((ind) => ({
        value: { _id: ind },
        label: ind,
      })),
    [],
  );

  const clientCountOptions: ISelect[] = useMemo(
    () =>
      CLIENT_COUNT_OPTIONS.map((opt) => ({
        value: { _id: opt.value },
        label: opt.label,
      })),
    [],
  );

  const schema = yup.object({
    // Step 1 validation
    firstName: yup.string().required("Enter First name"),
    lastName: yup.string().required("Enter Last name"),
    email: yup.string().email("Invalid email").required("Enter Email"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Enter Password"),
    agreeToTerms: yup
      .boolean()
      .oneOf([true], "You must agree to the terms and privacy policy")
      .required("You must agree to the terms and privacy policy"),

    // Step 2 validation
    businessName: yup.string().required("Enter Business name"),
    address: yup.string().required("Enter Address"),
    country: yup
      .object({
        label: yup.string().required("Select Country"),
      })
      .required("Select Country"),
    industry: yup
      .object({
        label: yup.string().required("Select Industry"),
      })
      .required("Select Industry"),
    estimatedClientCount: yup
      .object({
        label: yup.string().required("Select client count"),
      })
      .required("Select client count"),
  });

  const {
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      agreeToTerms: false,
      businessName: "",
      address: "",
      country: {
        value: { _id: "", phoneCode: "" },
        label: "",
      },
      industry: {
        value: { _id: "Professional services" },
        label: "Professional services",
      },
      estimatedClientCount: {
        value: { _id: "5" },
        label: "1 - 5 clients",
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: "onTouched",
  });

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      const isStep1Valid = await trigger([
        "firstName",
        "lastName",
        "email",
        "password",
        "agreeToTerms",
      ]);

      if (isStep1Valid) {
        setStep(2);
      }
    } else {
      const isStep2Valid = await trigger([
        "businessName",
        "address",
        "country",
        "industry",
        "estimatedClientCount",
      ]);

      if (isStep2Valid) {
        const data = getValues();
        const clientCount =
          parseInt(data.estimatedClientCount?.value?._id || "5", 10) || 5;

        const payload: ISignUpPayload = {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim(),
          password: data.password,
          confirmPassword: data.password,
          businessName: data.businessName.trim(),
          address: data.address.trim(),
          country: data.country?.value?._id || data.country?.label || "Nigeria",
          industry:
            data.industry?.value?._id ||
            data.industry?.label ||
            "Professional services",
          estimatedClientCount: clientCount,
        };

        signupMutation.mutate(payload);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const stepperHeader = (
    <div className="flex items-center justify-center gap-3 sm:gap-4 my-2 select-none">
      {/* Step 1 */}
      <button
        type="button"
        onClick={() => step === 2 && setStep(1)}
        className={cn(
          "flex items-center gap-2 text-xs sm:text-sm font-medium transition-opacity",
          step === 1
            ? "opacity-100"
            : "opacity-80 hover:opacity-100 cursor-pointer",
        )}
      >
        <span
          className={cn(
            "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
            step === 1
              ? "bg-white text-[#2B3B95] shadow-sm"
              : "bg-white text-[#2B3B95]",
          )}
        >
          1
        </span>
        <span
          className={cn(
            "transition-colors",
            step === 1
              ? "text-white font-semibold"
              : "text-white/80 font-medium",
          )}
        >
          Your account
        </span>
      </button>

      {/* Divider */}
      <div className="w-3 sm:w-6 h-[1.5px] bg-white/40" />

      {/* Step 2 */}
      <div
        className={cn(
          "flex items-center gap-2 text-xs sm:text-sm font-medium transition-opacity",
          step === 2 ? "opacity-100" : "opacity-60",
        )}
      >
        <span
          className={cn(
            "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
            step === 2
              ? "bg-white text-[#2B3B95] shadow-sm"
              : "bg-white/20 text-white border border-white/30",
          )}
        >
          2
        </span>
        <span
          className={cn(
            "transition-colors",
            step === 2
              ? "text-white font-semibold"
              : "text-white/70 font-medium",
          )}
        >
          Your business
        </span>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title="Create your account"
      subtext="Start managing your clients and events"
      headerContent={stepperHeader}
      onFormSubmit={handleNextStep}
      loading={signupMutation.isPending}
      backButton
      backHref="/"
      onBack={step === 2 ? handleBack : undefined}
      submitButtonText={step === 1 ? "Continue" : "Finish setup"}
      submitButtonIcon={<RiArrowRightLine className="h-5 w-5" />}
      footer={
        <p className="text-gray-500 dark:text-slate-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-theme-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Controller
                name="firstName"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label="First Name"
                    placeholder="John"
                    type="text"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label="Last Name"
                    placeholder="Doe"
                    type="text"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Email"
                  placeholder="johndoe@gmail.com"
                  type="email"
                  error={fieldState.error?.message}
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
                  placeholder="At least 8 characters"
                  type={showPassword}
                  error={errors.password?.message}
                  hidePassword={() => {
                    setShowPassword("password");
                  }}
                  showPassword={() => {
                    setShowPassword("text");
                  }}
                  password
                />
              )}
            />

            <div className="pt-1">
              <Controller
                name="agreeToTerms"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-theme-primary focus:ring-theme-primary"
                      />
                      <span>
                        I agree to the{" "}
                        <Link
                          href="/terms-of-service"
                          className="font-bold text-gray-800 dark:text-slate-200 hover:underline"
                        >
                          terms
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="#"
                          className="font-bold text-gray-800 dark:text-slate-200 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {fieldState.error?.message && (
                      <p className="text-xs text-red-500 font-medium">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <Controller
              name="businessName"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Business name"
                  placeholder="Kindly Studio"
                  type="text"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Address"
                  placeholder="No 1, adegbola street"
                  type="text"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  label="Country"
                  placeholder="Select country"
                  options={countryOptions}
                  loading={countriesQuery.isLoading}
                  validationError={fieldState.error?.message}
                />
              )}
            />

            {/* Reminder Callout Banner */}
            <div className="rounded-xl bg-[#EEF0FD] dark:bg-slate-800/90 px-4 py-3 text-xs sm:text-sm text-[#3D4785] dark:text-indigo-200 font-medium">
              Reminders are sent in your time zone, so milestones never arrive
              late.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Controller
                name="industry"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    label="Industry"
                    placeholder="Select industry"
                    options={industryOptions}
                    validationError={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="estimatedClientCount"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    label="How many clients?"
                    placeholder="Select clients"
                    options={clientCountOptions}
                    validationError={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
