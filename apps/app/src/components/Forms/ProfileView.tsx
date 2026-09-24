"use client";

import { useEffect, useState, type JSX } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { FiMail, FiPhone } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { IUserData } from "@/src/models/auth";
import { useUpdateProfileMutation } from "@/src/hooks/useAuthQuery";
import { Input } from "@/src/components/FormElements/Input";
import { BaseButton } from "@/src/components/UI/Buttons";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export function ProfileView(): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const userObj = user as IUserData | null;

  const updateProfileMutation = useUpdateProfileMutation();

  const { control, handleSubmit, reset } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: userObj?.firstName ?? "",
      lastName: userObj?.lastName ?? "",
      phone: userObj?.phoneNumber ?? "",
      address: userObj?.address ?? "",
      city: userObj?.city ?? "",
      country: userObj?.country ?? "",
    },
  });

  // Keep form in sync when user data loads or changes
  useEffect(() => {
    if (userObj) {
      reset({
        firstName: userObj.firstName ?? "",
        lastName: userObj.lastName ?? "",
        phone: userObj.phoneNumber ?? "",
        address: userObj.address ?? "",
        city: userObj.city ?? "",
        country: userObj.country ?? "",
      });
    }
  }, [userObj, reset]);

  // Watch values for live preview in the summary card while editing
  const watchedFirstName = useWatch({ control, name: "firstName" });
  const watchedLastName = useWatch({ control, name: "lastName" });
  const watchedPhone = useWatch({ control, name: "phone" });

  // Determine current display values
  const currentFirstName = isEditing
    ? watchedFirstName
    : (userObj?.firstName ?? "");
  const currentLastName = isEditing
    ? watchedLastName
    : (userObj?.lastName ?? "");

  const fullName =
    [currentFirstName.trim(), currentLastName.trim()]
      .filter(Boolean)
      .join(" ") || "John Doe";

  const getInitials = () => {
    const f = currentFirstName.trim();
    const l = currentLastName.trim();
    if (f && l) {
      return `${f[0]}${l[0]}`.toUpperCase();
    }
    if (f) return f.slice(0, 2).toUpperCase();
    return "AB";
  };

  const initials = getInitials();
  const email = userObj?.email || "johndoe@kindly.co";
  const phone = isEditing ? watchedPhone : userObj?.phoneNumber || "";

  const roleDisplay = userObj?.role
    ? userObj.role.charAt(0).toUpperCase() + userObj.role.slice(1).toLowerCase()
    : "Owner";

  const isLoading = updateProfileMutation.isPending;

  function handleCancel() {
    if (userObj) {
      reset({
        firstName: userObj.firstName ?? "",
        lastName: userObj.lastName ?? "",
        phone: userObj.phoneNumber ?? "",
        address: userObj.address ?? "",
        city: userObj.city ?? "",
        country: userObj.country ?? "",
      });
    }
    setIsEditing(false);
  }

  function onSubmit(data: ProfileFormValues) {
    updateProfileMutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        country: data.country || null,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 dark:border-slate-700/60 dark:bg-slate-800">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
            Your Profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            How your name and photo appear to teammates and clients
          </p>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <BaseButton
              type="button"
              color="outline"
              onClick={handleCancel}
              disabled={isLoading}
              text="Cancel"
            />
            <BaseButton
              type="submit"
              form="inline-profile-form"
              color="primary"
              loading={isLoading}
              text="Save Changes"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <LuPencil className="size-3.5 text-gray-500 dark:text-slate-400" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* User Summary Banner */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border border-gray-200/60 bg-gray-50/80 p-5 sm:p-6 dark:border-slate-700/50 dark:bg-slate-900/60">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 text-lg font-bold tracking-wide text-indigo-700 select-none ring-4 ring-indigo-50/60 dark:bg-indigo-950/70 dark:border-indigo-800/50 dark:text-indigo-300 dark:ring-indigo-900/30">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
            {fullName}
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <FiMail className="size-3.5 text-gray-400 dark:text-slate-400 shrink-0" />
              <span>{email}</span>
            </div>
            {phone && (
              <div className="flex items-center gap-1.5">
                <FiPhone className="size-3.5 text-gray-400 dark:text-slate-400 shrink-0" />
                <span>{phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details List / Inline Form */}
      <form
        id="inline-profile-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 divide-y divide-gray-100 dark:divide-slate-700/50"
      >
        {/* Full name */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Full name
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "First name is required" }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      id="firstName"
                      placeholder="First name"
                      error={fieldState.error?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "Last name is required" }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      id="lastName"
                      placeholder="Last name"
                      error={fieldState.error?.message}
                      required
                    />
                  )}
                />
              </div>
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {fullName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <div className="sm:w-48 shrink-0 sm:pt-0.5">
            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Email
            </span>
          </div>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <div>
                <Input
                  id="email"
                  value={email}
                  disabled
                  placeholder="address@example.com"
                />
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                  {email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Phone
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    placeholder="+234 801 234 5678"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {phone || ""}
              </p>
            )}
          </div>
        </div>

        {/* Role */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <div className="sm:w-48 shrink-0 sm:pt-0.5">
            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Role
            </span>
          </div>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <div>
                <div className="flex h-10 items-center rounded-xl border border-gray-200 bg-gray-100/70 px-4 py-2 text-sm font-medium text-gray-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  {roleDisplay}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                  {roleDisplay}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Address Details in Edit Mode */}
        {isEditing && (
          <>
            <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
              <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
                Street address
              </span>
              <div className="w-full sm:max-w-xl">
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="address"
                      placeholder="123 Kindly Street"
                    />
                  )}
                />
              </div>
            </div>

            <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
              <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
                City & Country
              </span>
              <div className="w-full sm:max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id="city" placeholder="City" />
                  )}
                />
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id="country" placeholder="Country" />
                  )}
                />
              </div>
            </div>
          </>
        )}
      </form>

      {/* Bottom Action Buttons in Edit Mode */}
      {isEditing && (
        <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-700/50">
          <BaseButton
            type="button"
            color="outline"
            onClick={handleCancel}
            disabled={isLoading}
            text="Cancel"
          />
          <BaseButton
            type="submit"
            form="inline-profile-form"
            color="primary"
            loading={isLoading}
            text="Save Changes"
          />
        </div>
      )}
    </div>
  );
}
