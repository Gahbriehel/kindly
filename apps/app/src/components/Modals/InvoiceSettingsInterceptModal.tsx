"use client";

import {
  useState,
  useRef,
  useMemo,
  useEffect,
  type ChangeEvent,
  type JSX,
} from "react";
import {
  FiImage,
  FiUploadCloud,
  FiChevronDown,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { LuFileText } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { CenterModal } from "@/src/components/UI/CenterModal";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { updateCompany } from "@/src/store/slices/auth";
import {
  useInvoiceSettingsQuery,
  useUpdateInvoiceSettings,
} from "@/src/hooks/useInvoiceQuery";
import { customToast } from "@/src/helpers/customToast";
import { axiosErrorToast } from "@/src/helpers/axiosErrorToast";
import { BANK_OPTIONS } from "@/src/data/banks";
import type { IUserData } from "@/src/models/auth";
import type { IInvoiceSettingsPayload } from "@/src/models/invoice";

interface InvoiceSettingsInterceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onSuccessAndProceed: () => void;
}

interface ContentProps {
  serverSettings?: IInvoiceSettingsPayload | null;
  company?: IUserData["company"];
  userObj: IUserData | null;
  onClose: () => void;
  onSkip: () => void;
  onSuccessAndProceed: () => void;
}

function InvoiceSettingsInterceptContent({
  serverSettings,
  company,
  userObj,
  onClose,
  onSkip,
  onSuccessAndProceed,
}: ContentProps): JSX.Element {
  const dispatch = useAppDispatch();
  const updateSettingsMutation = useUpdateInvoiceSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  const initialLogo = serverSettings?.logoUrl || company?.logoUrl || "";
  const initialBank =
    serverSettings?.bankName || company?.bankName || "First Bank of Nigeria";
  const initialAccNumber =
    serverSettings?.bankAccountNumber || company?.bankAccountNumber || "";
  const initialAccName =
    serverSettings?.bankAccountName ||
    company?.bankAccountName ||
    `${userObj?.firstName || ""} ${userObj?.lastName || ""}`.trim() ||
    company?.businessName ||
    "";

  // Form State initialized directly from props
  const [logoPreview, setLogoPreview] = useState<string>(initialLogo);
  const [logoUrl, setLogoUrl] = useState<string>(initialLogo);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [bankName, setBankName] = useState<string>(initialBank);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<string>(initialAccNumber);
  const [accountName, setAccountName] = useState<string>(initialAccName);

  const hasInitialLogo = Boolean(initialLogo);

  // Close bank dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        bankDropdownRef.current &&
        !bankDropdownRef.current.contains(event.target as Node)
      ) {
        setIsBankDropdownOpen(false);
      }
    }
    if (isBankDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBankDropdownOpen]);

  // Filter bank suggestions based on user input
  const filteredBanks = useMemo(() => {
    const query = bankName.trim().toLowerCase();
    if (!query) return BANK_OPTIONS;
    return BANK_OPTIONS.filter((b) => b.toLowerCase().includes(query));
  }, [bankName]);

  const displayBusinessName =
    company?.businessName ||
    (userObj?.firstName ? `${userObj.firstName}'s Studio` : "Kindly Studio");

  const displayAddress = useMemo(() => {
    const parts = [
      company?.billingAddress || company?.address,
      company?.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "No address provided";
  }, [company]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      customToast.error("Please upload an image file (PNG, JPG, or SVG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      customToast.error("File size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      setLogoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAndContinue = () => {
    const payload = {
      logoUrl: logoUrl.trim() || null,
      bankName: bankName.trim() || null,
      bankAccountNumber: accountNumber.trim() || null,
      bankAccountName: accountName.trim() || null,
      billingAddress:
        serverSettings?.billingAddress ||
        company?.billingAddress ||
        company?.address ||
        null,
      registrationNumber:
        serverSettings?.registrationNumber ||
        company?.registrationNumber ||
        null,
      taxId: serverSettings?.taxId || company?.taxId || null,
    };

    updateSettingsMutation.mutate(payload, {
      onSuccess: () => {
        // Also sync persisted Redux store
        dispatch(
          updateCompany({
            logoUrl: payload.logoUrl,
            bankName: payload.bankName,
            bankAccountNumber: payload.bankAccountNumber,
            bankAccountName: payload.bankAccountName,
          }),
        );
        customToast.success("Invoice settings saved");
        onSuccessAndProceed();
      },
      onError: (err) => {
        axiosErrorToast(err);
      },
    });
  };

  const isSaving = updateSettingsMutation.isPending;

  return (
    <div className="flex flex-col gap-5 text-left">
      {/* Modal Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50/90 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <LuFileText className="size-5.5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              New invoice
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-slate-400 font-normal">
              {!hasInitialLogo
                ? "Add your logo so the document looks like you"
                : "Review your invoice payout details"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <IoClose size={20} />
        </button>
      </div>

      {/* Notice Banner */}
      <div className="rounded-2xl bg-[#EEF2FF] p-4.5 border border-[#E0E7FF] dark:bg-indigo-950/35 dark:border-indigo-900/40">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400">
            {!hasInitialLogo ? (
              <FiImage className="size-4.5" />
            ) : (
              <FiAlertCircle className="size-4.5" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
              {!hasInitialLogo
                ? "Your invoice needs a logo first"
                : "Some invoice settings are missing"}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-indigo-900/80 dark:text-indigo-300/80">
              {!hasInitialLogo
                ? "It sits at the top of every document you send, next to your business name and address. You only have to do this once."
                : "Add your payout and banking details so clients know where to send payment."}
            </p>
          </div>
        </div>
      </div>

      {/* Logo Upload Card */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-4.5 sm:p-5 dark:border-slate-700/60 dark:bg-theme-surface">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Logo Preview Square */}
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 border border-gray-100/90 dark:bg-slate-800/80 dark:border-slate-700">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview}
                alt="Invoice Logo"
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <FiImage className="size-8 text-gray-300 dark:text-slate-600" />
            )}
          </div>

          {/* Upload Button & Description */}
          <div className="flex flex-col items-start gap-2 min-w-0 flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#2B44C7] px-4.5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#2338A8]"
            >
              <FiUploadCloud className="size-4" />
              <span>{logoPreview ? "Change logo" : "Upload logo"}</span>
            </button>
            <p className="text-[11px] leading-relaxed text-gray-400 dark:text-slate-400">
              PNG, JPG or SVG. A square image around 400×400 looks best on the
              invoice.
            </p>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {showUrlInput ? "Hide URL input" : "Or enter hosted image URL"}
            </button>
          </div>
        </div>

        {/* Collapsible Direct Image URL Input */}
        {showUrlInput && (
          <div className="mt-3.5 pt-3.5 border-t border-gray-100 dark:border-slate-700/60">
            <label
              htmlFor="logo-url-input"
              className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1"
            >
              Public Image URL (https://...)
            </label>
            <input
              id="logo-url-input"
              type="url"
              value={logoUrl}
              onChange={(e) => {
                setLogoUrl(e.target.value);
                setLogoPreview(e.target.value);
              }}
              placeholder="https://example.com/logo.png"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        )}
      </div>

      {/* Appears as Preview Card */}
      <div>
        <span className="block text-xs font-medium text-gray-400 dark:text-slate-500 mb-1.5">
          Appears as
        </span>
        <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200/80 bg-white p-3.5 dark:border-slate-700/60 dark:bg-theme-surface">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview}
                alt="Company Logo"
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <FiImage className="size-4 text-gray-300 dark:text-slate-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="truncate text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100">
              {displayBusinessName}
            </h5>
            <p className="truncate text-[11px] sm:text-xs text-gray-400 dark:text-slate-400 mt-0.5">
              {displayAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Account Details for Payment Section */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2.5">
          Account details for payment
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Bank Select / Typeable Combobox */}
          <div className="relative" ref={bankDropdownRef}>
            <label
              htmlFor="invoice-bank-input"
              className="block text-xs font-bold text-gray-900 dark:text-slate-100 mb-1.5"
            >
              Bank
            </label>
            <div className="relative flex items-center">
              <input
                id="invoice-bank-input"
                type="text"
                list="invoice-bank-options"
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                  setIsBankDropdownOpen(true);
                }}
                onFocus={() => setIsBankDropdownOpen(true)}
                placeholder="Select or type bank name"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-8 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <datalist id="invoice-bank-options">
                {BANK_OPTIONS.map((bank) => (
                  <option key={bank} value={bank} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={() => setIsBankDropdownOpen((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 cursor-pointer"
                aria-label="Toggle bank options"
              >
                <FiChevronDown
                  className={`size-4 transition-transform duration-200 ${
                    isBankDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Custom dropdown suggestions overlay */}
            {isBankDropdownOpen && (
              <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {filteredBanks.length > 0 ? (
                  filteredBanks.map((bank) => {
                    const isSelected =
                      bank.toLowerCase() === bankName.trim().toLowerCase();
                    return (
                      <li
                        key={bank}
                        onClick={() => {
                          setBankName(bank);
                          setIsBankDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                            : "text-gray-700 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-700/60"
                        }`}
                      >
                        <span className="truncate">{bank}</span>
                        {isSelected && (
                          <FiCheck className="size-3.5 shrink-0" />
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li className="px-3.5 py-2 text-xs text-gray-400 italic">
                    Press tab/enter to use custom bank &ldquo;{bankName}&rdquo;
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label
              htmlFor="invoice-account-number"
              className="block text-xs font-bold text-gray-900 dark:text-slate-100 mb-1.5"
            >
              Account number
            </label>
            <input
              id="invoice-account-number"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="1234567890"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Account Name input field */}
          <div className="sm:col-span-2">
            <label
              htmlFor="invoice-account-name"
              className="block text-xs font-bold text-gray-900 dark:text-slate-100 mb-1.5"
            >
              Account name
            </label>
            <input
              id="invoice-account-name"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. Sarah Johnson"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-2 flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onSkip}
          disabled={isSaving}
          className="flex-1 cursor-pointer rounded-2xl border border-gray-200 bg-white py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 text-center"
        >
          Skip for now
        </button>
        <button
          type="button"
          onClick={handleSaveAndContinue}
          disabled={isSaving}
          className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2B44C7] py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#2338A8] shadow-xs transition-colors text-center disabled:opacity-60"
        >
          {isSaving && <ClipLoader size={14} color="#ffffff" />}
          <span>Save & continue</span>
        </button>
      </div>
    </div>
  );
}

export function InvoiceSettingsInterceptModal({
  isOpen,
  onClose,
  onSkip,
  onSuccessAndProceed,
}: InvoiceSettingsInterceptModalProps): JSX.Element | null {
  const { user } = useAppSelector((state) => state.auth);
  const userObj = user as IUserData | null;
  const company = userObj?.company;

  const { data: settingsData } = useInvoiceSettingsQuery();
  const serverSettings = settingsData?.data?.settings;

  if (!isOpen) return null;

  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      maxWidth="max-w-[530px]"
      className="p-6 sm:p-7"
    >
      <InvoiceSettingsInterceptContent
        key={`${serverSettings?.logoUrl || company?.logoUrl || ""}-${serverSettings?.bankAccountNumber || company?.bankAccountNumber || ""}`}
        serverSettings={serverSettings}
        company={company}
        userObj={userObj}
        onClose={onClose}
        onSkip={onSkip}
        onSuccessAndProceed={onSuccessAndProceed}
      />
    </CenterModal>
  );
}
