"use client";

import { useForm, Controller } from "react-hook-form";
import { Input } from "@/src/components/FormElements/Input";
import { BaseButton } from "@/src/components/UI/Buttons";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import {
  BsPerson,
  BsCheckCircleFill,
  BsSun,
  BsMoonStars,
} from "react-icons/bs";
import type { JSX } from "react";
import { IUserData } from "@/src/models/auth";
import { useTheme } from "@/src/context/ThemeContext";
import { useGetProfileQuery } from "@/src/hooks/useAuthQuery";

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
  const { theme, setTheme } = useTheme();

  const { data, isLoading, isError, error } = useGetProfileQuery();
  console.log({ data, isLoading, isError, error });

  const userObj = user as IUserData;

  const { control, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: userObj?.firstName ?? "",
      lastName: userObj?.lastName ?? "",
      email: userObj?.email ?? "",
      phone: userObj?.phoneNumber ?? "",
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
            Choose your preferred display mode for the application.
          </p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`cursor-pointer relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 w-36 transition-all hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
                theme === "light"
                  ? "border-theme-primary bg-theme-primary/5 dark:bg-slate-700/30"
                  : "border-gray-200 dark:border-slate-700"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-500 shadow-sm">
                <BsSun className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Light Mode
              </span>
              {theme === "light" && (
                <BsCheckCircleFill className="absolute top-2 right-2 h-4 w-4 text-theme-primary" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`cursor-pointer relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 w-36 transition-all hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
                theme === "dark"
                  ? "border-theme-primary bg-theme-primary/5 dark:bg-slate-700/30"
                  : "border-gray-200 dark:border-slate-700"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/30 text-indigo-500 shadow-sm">
                <BsMoonStars className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>
              {theme === "dark" && (
                <BsCheckCircleFill className="absolute top-2 right-2 h-4 w-4 text-theme-primary" />
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
