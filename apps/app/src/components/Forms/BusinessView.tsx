"use client";

import { useEffect, useMemo, useState, type JSX } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import {
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiBriefcase,
  FiHash,
  FiLayers,
} from "react-icons/fi";
import { LuPencil } from "react-icons/lu";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { IUserData } from "@/src/models/auth";
import { FALLBACK_COUNTRIES } from "@/src/models/locations";
import { INDUSTRY_OPTIONS, CLIENT_COUNT_OPTIONS } from "@/src/models/business";
import { useUpdateCompanyProfileMutation } from "@/src/hooks/useAuthQuery";
import { useCountriesQuery } from "@/src/hooks/useLocationQuery";
import { Input } from "@/src/components/FormElements/Input";
import { Select, ISelect } from "@/src/components/FormElements/Select";
import { BaseButton } from "@/src/components/UI/Buttons";

interface BusinessFormValues {
  businessName: string;
  industry: ISelect;
  estimatedClientCount: ISelect;
  phoneNumber: string;
  address: string;
  country: ISelect;
  website: string;
  description: string;
  billingAddress: string;
  registrationNumber: string;
  taxId: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
}

export function BusinessView(): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const userObj = user as IUserData | null;
  const company = userObj?.company;

  const updateCompanyMutation = useUpdateCompanyProfileMutation();
  const countriesQuery = useCountriesQuery();

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

  const getInitialValues = (): BusinessFormValues => {
    const countValue = company?.estimatedClientCount
      ? String(company.estimatedClientCount)
      : "5";
    const matchedCount = CLIENT_COUNT_OPTIONS.find(
      (opt) => opt.value === countValue,
    );

    return {
      businessName: company?.businessName ?? "",
      industry: {
        value: { _id: company?.industry ?? "Professional services" },
        label: company?.industry ?? "Professional services",
      },
      estimatedClientCount: {
        value: { _id: countValue },
        label: matchedCount?.label ?? `${countValue} clients`,
      },
      phoneNumber: company?.phoneNumber ?? "",
      address: company?.address ?? "",
      country: {
        value: { _id: company?.country ?? "Nigeria" },
        label: company?.country ?? "Nigeria",
      },
      website: company?.website ?? "",
      description: company?.description ?? "",
      billingAddress: company?.billingAddress ?? "",
      registrationNumber: company?.registrationNumber ?? "",
      taxId: company?.taxId ?? "",
      bankName: company?.bankName ?? "",
      bankAccountName: company?.bankAccountName ?? "",
      bankAccountNumber: company?.bankAccountNumber ?? "",
    };
  };

  const { control, handleSubmit, reset } = useForm<BusinessFormValues>({
    defaultValues: getInitialValues(),
  });

  // Sync form when company data updates
  useEffect(() => {
    if (company) {
      reset(getInitialValues());
    }
  }, [company, reset]);

  // Live preview watch
  const watchedBusinessName = useWatch({ control, name: "businessName" });
  const watchedIndustry = useWatch({ control, name: "industry" });
  const watchedCountry = useWatch({ control, name: "country" });
  const watchedPhone = useWatch({ control, name: "phoneNumber" });
  const watchedWebsite = useWatch({ control, name: "website" });

  const currentBusinessName = isEditing
    ? watchedBusinessName || company?.businessName || "My Business"
    : company?.businessName || "My Business";

  const currentIndustry = isEditing
    ? watchedIndustry?.label || company?.industry || "Professional services"
    : company?.industry || "Professional services";

  const currentCountry = isEditing
    ? watchedCountry?.label || company?.country || ""
    : company?.country || "";

  const currentPhone = isEditing
    ? watchedPhone || company?.phoneNumber || ""
    : company?.phoneNumber || "";

  const currentWebsite = isEditing
    ? watchedWebsite || company?.website || ""
    : company?.website || "";

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    if (name.length >= 2) {
      return name.slice(0, 2).toUpperCase();
    }
    return "BI";
  };

  const businessInitials = getInitials(currentBusinessName);
  const isLoading = updateCompanyMutation.isPending;

  function handleCancel() {
    reset(getInitialValues());
    setIsEditing(false);
  }

  function onSubmit(data: BusinessFormValues) {
    const clientCount =
      parseInt(data.estimatedClientCount?.value?._id || "5", 10) || 5;

    updateCompanyMutation.mutate(
      {
        businessName: data.businessName.trim(),
        industry:
          data.industry?.value?._id ||
          data.industry?.label ||
          "Professional services",
        estimatedClientCount: clientCount,
        phoneNumber: data.phoneNumber.trim() || null,
        address: data.address.trim() || null,
        country: data.country?.value?._id || data.country?.label || null,
        website: data.website.trim() || null,
        description: data.description.trim() || null,
        billingAddress: data.billingAddress.trim() || null,
        registrationNumber: data.registrationNumber.trim() || null,
        taxId: data.taxId.trim() || null,
        bankName: data.bankName.trim() || null,
        bankAccountName: data.bankAccountName.trim() || null,
        bankAccountNumber: data.bankAccountNumber.trim() || null,
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
            Business Information
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Company profile, contact details, tax info, and business preferences
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
              form="inline-business-form"
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

      {/* Business Summary Banner */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border border-gray-200/60 bg-gray-50/80 p-5 sm:p-6 dark:border-slate-700/50 dark:bg-slate-900/60">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-lg font-bold tracking-wide text-theme-primary select-none ring-4 ring-indigo-50/60 dark:bg-indigo-950/70 dark:border-indigo-800/50 dark:text-indigo-300 dark:ring-indigo-900/30">
          {company?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logoUrl}
              alt={currentBusinessName}
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            businessInitials
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
              {currentBusinessName}
            </h3>
            {company?.subscriptionTier && (
              <span className="inline-flex items-center rounded-full bg-theme-primary/10 px-2.5 py-0.5 text-xs font-semibold text-theme-primary dark:bg-theme-primary/20">
                {company.subscriptionTier} Plan
              </span>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-600 dark:text-slate-300">
            {currentIndustry && (
              <div className="flex items-center gap-1.5">
                <FiBriefcase className="size-3.5 text-gray-400 dark:text-slate-400 shrink-0" />
                <span>{currentIndustry}</span>
              </div>
            )}
            {currentCountry && (
              <div className="flex items-center gap-1.5">
                <FiMapPin className="size-3.5 text-gray-400 dark:text-slate-400 shrink-0" />
                <span>{currentCountry}</span>
              </div>
            )}
            {currentPhone && (
              <div className="flex items-center gap-1.5">
                <FiPhone className="size-3.5 text-gray-400 dark:text-slate-400 shrink-0" />
                <span>{currentPhone}</span>
              </div>
            )}
            {currentWebsite && (
              <div className="flex items-center gap-1.5">
                <FiGlobe className="size-3.5 text-gray-400 dark:text-slate-400 shrink-0" />
                <a
                  href={
                    currentWebsite.startsWith("http")
                      ? currentWebsite
                      : `https://${currentWebsite}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-theme-primary hover:underline"
                >
                  {currentWebsite.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form / Details */}
      <form
        id="inline-business-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 divide-y divide-gray-100 dark:divide-slate-700/50"
      >
        {/* ── Section: Basic Details ───────────────────────── */}
        <div className="pb-2 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
            General Business Details
          </h4>
        </div>

        {/* Business Name */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Business Name
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="businessName"
                control={control}
                rules={{ required: "Business name is required" }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="businessName"
                    placeholder="e.g. Apex Creative Studio"
                    error={fieldState.error?.message}
                    required
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.businessName || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not provided
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Industry */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Industry
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    options={industryOptions}
                    placeholder="Select industry"
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.industry || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not provided
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Client Count */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Estimated Clients
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="estimatedClientCount"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    options={clientCountOptions}
                    placeholder="Select client range"
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.estimatedClientCount ? (
                  `${company.estimatedClientCount} clients`
                ) : (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not specified
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Website */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Website URL
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="website"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="website"
                    placeholder="https://yourbusiness.com"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.website ? (
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-theme-primary hover:underline"
                  >
                    {company.website}
                  </a>
                ) : (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not provided
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Description
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="description"
                    rows={3}
                    placeholder="Tell your clients a little bit about what your company does..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700 outline-none transition-all placeholder-gray-400 focus:border-theme-primary focus:bg-white focus:ring-2 focus:ring-theme-primary/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-theme-primary dark:focus:bg-slate-900 dark:focus:ring-theme-primary/20"
                  />
                )}
              />
            ) : (
              <p className="text-sm font-medium text-gray-700 dark:text-slate-300 py-0.5 leading-relaxed">
                {company?.description || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    No description added yet.
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* ── Section: Contact & Location ───────────────────── */}
        <div className="pb-2 pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
            Contact &amp; Location
          </h4>
        </div>

        {/* Phone */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Phone Number
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="companyPhone"
                    type="tel"
                    placeholder="+234 801 234 5678"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.phoneNumber || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not provided
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Country
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    options={countryOptions}
                    placeholder="Search country"
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.country || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not provided
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Street Address */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Street Address
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="address"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="address"
                    placeholder="123 Business Way, Suite 100"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.address || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not provided
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Billing Address */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Billing Address
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="billingAddress"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="billingAddress"
                    placeholder="Leave empty if same as street address"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.billingAddress || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Same as street address
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* ── Section: Tax & Registration ──────────────────── */}
        <div className="pb-2 pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
            Tax &amp; Legal Registration
          </h4>
        </div>

        {/* Registration Number */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Registration # (RC)
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="registrationNumber"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="registrationNumber"
                    placeholder="e.g. RC-1234567"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.registrationNumber || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not provided
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Tax ID */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Tax Identification #
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="taxId"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="taxId"
                    placeholder="e.g. TIN-987654321"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.taxId || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not provided
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* ── Section: Banking & Payouts ────────────────────── */}
        <div className="pb-2 pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
            Banking &amp; Settlement Details
          </h4>
        </div>

        {/* Bank Name */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Bank Name
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="bankName"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="bankName"
                    placeholder="e.g. Chase / GTBank / Barclays"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.bankName || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not provided
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Account Name */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Account Name
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="bankAccountName"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="bankAccountName"
                    placeholder="e.g. Apex Creative Studio Ltd"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.bankAccountName || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not provided
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Account Number */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Account Number
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="bankAccountNumber"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="bankAccountNumber"
                    placeholder="e.g. 0123456789"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {company?.bankAccountNumber || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Not provided
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* ── Section: Invoicing & Subscription Status ─────── */}
        <div className="pb-2 pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
            Invoicing &amp; Plan Status
          </h4>
        </div>

        {/* Next Invoice # */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <div className="sm:w-48 shrink-0 sm:pt-0.5">
            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Next Invoice #
            </span>
          </div>
          <div className="w-full sm:max-w-xl flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <FiHash className="size-3 text-gray-400" />
              <span>
                {company?.nextInvoiceNumber
                  ? String(company.nextInvoiceNumber).padStart(4, "0")
                  : "0001"}
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-slate-500">
              (Auto-increments with each issued invoice)
            </span>
          </div>
        </div>

        {/* Plan Tier */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <div className="sm:w-48 shrink-0 sm:pt-0.5">
            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Subscription Tier
            </span>
          </div>
          <div className="w-full sm:max-w-xl flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50/70 px-3 py-1 text-xs font-semibold text-theme-primary dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
              <FiLayers className="size-3 text-theme-primary" />
              <span>{company?.subscriptionTier || "Basic"} Plan</span>
            </div>
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/30 dark:text-emerald-400">
              {company?.subscriptionActive ? "Active" : "Active"}
            </span>
          </div>
        </div>
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
            form="inline-business-form"
            color="primary"
            loading={isLoading}
            text="Save Changes"
          />
        </div>
      )}
    </div>
  );
}
