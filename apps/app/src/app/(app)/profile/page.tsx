"use client";

import { useForm, Controller } from "react-hook-form";
import { Input } from "@/src/components/FormElements/Input";
import { BaseButton } from "@/src/components/UI/Buttons";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { BsPerson, BsCheckCircleFill } from "react-icons/bs";
import type { JSX } from "react";
import { IUserData } from "@/src/models/auth";
import { useThemeColor } from "@/src/context/ThemeColorContext";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  city: string;
  country: string;
}

export default function ProfilePage(): JSX.Element {
  const { user } = useAppSelector((state) => state.auth);
  const { themeColor, setThemeColor } = useThemeColor();

  const userObj = user as IUserData;

  const { control, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: userObj?.firstName ?? "",
      lastName: userObj?.lastName ?? "",
      email: userObj?.username ?? userObj?.email ?? "",
      phone: userObj?.phone ?? "",
      companyName: userObj?.companyName ?? "",
      address: userObj?.address ?? "",
      city: userObj?.city ?? "",
      country: userObj?.country ?? "",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    console.log("Profile form submitted:", data);
  }

  return (
    <div className="h-full">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-primary/15 text-theme-primary">
          <BsPerson className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">
            Profile
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Manage your personal information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── Personal Information ─────────────────────────────────── */}
        <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
            Personal Information
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="firstName"
                  label="First Name"
                  type="text"
                  placeholder="John"
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
                  id="lastName"
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="address@example.com"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        </section>

        {/* ── Business Information ─────────────────────────────────── */}
        <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
            Business Information
          </h2>
          <p className="mb-5 text-xs text-gray-400 dark:text-slate-500">
            These details are optional — fill them in whenever you&apos;re
            ready.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Controller
                name="companyName"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="companyName"
                    label="Company / Brand Name"
                    type="text"
                    placeholder="Kindly company"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <Controller
                name="address"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="address"
                    label="Street Address"
                    type="text"
                    placeholder="123 Kindly Street, Lagos"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <Controller
              name="city"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="city"
                  label="City"
                  type="text"
                  placeholder="Lagos"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="country"
                  label="Country"
                  type="text"
                  placeholder="Nigeria"
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        </section>

        {/* ── Theme Preferences ────────────────────────────────────── */}
        <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
            Theme Preferences
          </h2>
          <p className="mb-5 text-xs text-gray-400 dark:text-slate-500">
            Choose your preferred accent color for the application.
          </p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setThemeColor("pink")}
              className={`cursor-pointer relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                themeColor === "pink"
                  ? "border-[#FF9B7A] bg-orange-50/50 dark:bg-orange-900/10"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-[#FF9B7A] shadow-sm" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pink Accent
              </span>
              {themeColor === "pink" && (
                <BsCheckCircleFill className="absolute top-2 right-2 h-4 w-4 text-[#FF9B7A]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setThemeColor("sky")}
              className={`cursor-pointer relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                themeColor === "sky"
                  ? "border-sky-500 bg-sky-50/50 dark:bg-sky-900/10"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-sky-500 shadow-sm" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sky Accent
              </span>
              {themeColor === "sky" && (
                <BsCheckCircleFill className="absolute top-2 right-2 h-4 w-4 text-sky-500" />
              )}
            </button>
          </div>
        </section>

        <div className="flex justify-end mb-6 p-6">
          <BaseButton type="submit" color="primary" text="Save Changes" />
        </div>
      </form>
    </div>
  );
}
