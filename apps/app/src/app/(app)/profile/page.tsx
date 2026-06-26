"use client";

import { useForm, Controller } from "react-hook-form";
import { Input } from "@/src/components/FormElements/Input";
import { ErrorMessage } from "@/src/components/FormElements/ErrorMessage";
import { BaseButton } from "@/src/components/UI/Buttons";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { BsPerson } from "react-icons/bs";
import { useEffect, type JSX } from "react";
import { IUserData } from "@/src/models/auth";
import {
  useUpdateIndividualProfileMutation,
  useUpdateCompanyProfileMutation,
} from "@/src/hooks/useAuthQuery";
import { clsx } from "clsx";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  city: string;
  country: string;
  website: string;
  description: string;
}

export default function ProfilePage(): JSX.Element {
  const { user, accountType } = useAppSelector((state) => state.auth);

  const userObj = user as IUserData;
  const isOrganization =
    accountType === "ORGANIZATION" || userObj?.accountType === "ORGANIZATION";

  const updateIndividualProfileMutation = useUpdateIndividualProfileMutation();
  const updateCompanyProfileMutation = useUpdateCompanyProfileMutation();

  const { control, handleSubmit, reset } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: userObj?.firstName ?? "",
      lastName: userObj?.lastName ?? "",
      email: userObj?.email ?? "",
      phone: userObj?.phoneNumber ?? "",
      companyName: userObj?.companyName ?? "",
      address: userObj?.address ?? "",
      city: userObj?.city ?? "",
      country: userObj?.country ?? "",
      website: userObj?.website ?? "",
      description: userObj?.description ?? "",
    },
  });

  useEffect(() => {
    if (userObj) {
      reset({
        firstName: userObj.firstName ?? "",
        lastName: userObj.lastName ?? "",
        email: userObj.email ?? "",
        phone: userObj.phoneNumber ?? "",
        companyName: userObj.companyName ?? "",
        address: userObj.address ?? "",
        city: userObj.city ?? "",
        country: userObj.country ?? "",
        website: userObj.website ?? "",
        description: userObj.description ?? "",
      });
    }
    // Only run on mount to populate from persisted Redux state.
    // After a successful mutation the per-call onSuccess below handles the reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(data: ProfileFormValues) {
    if (isOrganization) {
      updateCompanyProfileMutation.mutate(
        {
          companyName: data.companyName,
          phoneNumber: data.phone || null,
          address: data.address || null,
          city: data.city || null,
          country: data.country || null,
          website: data.website || null,
          description: data.description || null,
        },
        {
          onSuccess: (response) => {
            const c = response.data.company;
            reset({
              companyName: c.companyName ?? "",
              email: c.email ?? "",
              phone: c.phoneNumber ?? "",
              address: c.address ?? "",
              city: c.city ?? "",
              country: c.country ?? "",
              website: c.website ?? "",
              description: c.description ?? "",
              firstName: "",
              lastName: "",
            });
          },
        },
      );
    } else {
      updateIndividualProfileMutation.mutate(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phone || null,
          address: data.address || null,
          city: data.city || null,
          country: data.country || null,
        },
        {
          onSuccess: (response) => {
            const ind = response.data.individual;
            reset({
              firstName: ind.firstName ?? "",
              lastName: ind.lastName ?? "",
              email: ind.email ?? "",
              phone: ind.phoneNumber ?? "",
              address: ind.address ?? "",
              city: ind.city ?? "",
              country: ind.country ?? "",
              companyName: "",
              website: "",
              description: "",
            });
          },
        },
      );
    }
  }

  return (
    <div className="h-full">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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
        <BaseButton
          type="submit"
          form="profile-form"
          color="primary"
          text="Save Changes"
          loading={
            updateIndividualProfileMutation.isPending ||
            updateCompanyProfileMutation.isPending
          }
        />
      </div>

      <form id="profile-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {isOrganization ? (
          /* ── Business Information ─────────────────────────────────── */
          <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Business Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Controller
                  name="companyName"
                  control={control}
                  rules={{ required: "Company name is required" }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      id="companyName"
                      label="Company / Brand Name"
                      type="text"
                      placeholder="Kindly Company"
                      error={fieldState.error?.message}
                      required
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
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="address@example.com"
                    error={fieldState.error?.message}
                    disabled
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

              <div className="sm:col-span-2">
                <Controller
                  name="website"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      id="website"
                      label="Website"
                      type="url"
                      placeholder="https://example.com"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <fieldset className="relative space-y-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-semibold text-gray-600 dark:text-slate-400"
                      >
                        Description
                      </label>
                      <textarea
                        {...field}
                        id="description"
                        placeholder="Tell us about your company..."
                        rows={4}
                        className={clsx(
                          "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 outline-none transition-all placeholder-gray-400",
                          "focus:border-theme-primary focus:bg-white focus:ring-2 focus:ring-theme-primary/20",
                          "dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder-slate-500",
                          "dark:focus:border-theme-primary dark:focus:bg-slate-900 dark:focus:ring-theme-primary/20",
                          "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-slate-800/40 dark:disabled:text-slate-600",
                          fieldState.error?.message &&
                            "border-red-500 dark:border-red-500/50 focus:border-red-500 dark:focus:border-red-500/50 focus:ring-red-500/20 dark:focus:ring-red-500/20",
                        )}
                      />
                      {fieldState.error?.message && (
                        <ErrorMessage message={fieldState.error.message} />
                      )}
                    </fieldset>
                  )}
                />
              </div>
            </div>
          </section>
        ) : (
          /* ── Personal Information ─────────────────────────────────── */
          <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Personal Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First name is required" }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="firstName"
                    label="First Name"
                    type="text"
                    placeholder="John"
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
                    label="Last Name"
                    type="text"
                    placeholder="Doe"
                    error={fieldState.error?.message}
                    required
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
                    disabled
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
        )}

        {/* ── Address Details ─────────────────────────────────────── */}
        <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
            Address Details
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
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
                    placeholder="123 Kindly Street"
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
      </form>
    </div>
  );
}
