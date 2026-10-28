"use client";

import { useState, useMemo, type JSX } from "react";
import {
  IoClose,
  IoMailOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { RiWhatsappLine, RiSendPlaneFill } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import { clsx } from "clsx";
import { CenterModal } from "@/src/components/UI/CenterModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import {
  Select,
  type ISelect,
  emptySelect,
} from "@/src/components/FormElements/Select";
import { RichTextEditor } from "@/src/components/FormElements/RichTextEditor";
import { useTemplatesQuery } from "@/src/hooks/useTemplateQuery";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import { htmlToPlainText } from "@/src/helpers/htmlHelpers";
import { getInitials } from "@/src/helpers/stringHelpers";
import type { IEvent } from "@/src/models/event";

export interface SendClientMessageModalProps {
  display: boolean;
  close: () => void;
  event?: IEvent | null;
  client?: {
    fullName: string;
    phoneNumber?: string;
    email?: string;
  } | null;
}

export function SendClientMessageModal({
  display,
  close,
  event,
  client,
}: SendClientMessageModalProps): JSX.Element | null {
  const [selectedChannel, setSelectedChannel] = useState<"email" | "whatsapp">(
    "email",
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<ISelect>(emptySelect());
  const [message, setMessage] = useState<string>("");

  // Fetch available templates
  const { data: templatesData, isLoading: isTemplatesLoading } =
    useTemplatesQuery({
      limit: 50,
    });

  // Extract client information from event or prop
  const participant = event?.participants?.[0]?.client;
  const clientName =
    client?.fullName || participant?.fullName || event?.title || "Client";
  // Email is the only active channel, so show the address the message goes to
  const clientContact =
    client?.email ||
    participant?.email ||
    client?.phoneNumber ||
    participant?.phoneNumber ||
    "";
  const initials = getInitials(clientName) || "CL";

  // Handle actual close: reset state and trigger close
  const handleActualClose = () => {
    setSelectedTemplate(emptySelect());
    setMessage("");
    setSelectedChannel("email");
    close();
  };

  const isDirty =
    htmlToPlainText(message).length > 0 || Boolean(selectedTemplate.value?._id);

  const { requestClose, prompt } = useUnsavedChangesGuard(
    isDirty,
    handleActualClose,
    display,
  );

  // Transform templates for Select component
  const templateOptions: ISelect[] = useMemo(() => {
    const list = templatesData?.data ?? [];
    return list.map((t) => ({
      value: {
        _id: t.id,
        message: t.message,
      },
      label: t.title,
    }));
  }, [templatesData]);

  // When a template is picked, fill the message into the rich text editor
  const handleSelectTemplate = (option: ISelect) => {
    setSelectedTemplate(option);
    if (option.value?.message) {
      // Clean trailing empty paragraphs if present
      const cleanHtml = option.value.message
        .replace(/(<p><\/p>|<p><br><\/p>)+$/gi, "")
        .trim();
      setMessage(cleanHtml || option.value.message);
    }
  };

  const handleSend = () => {
    // "Send message" does not call any endpoint yet and does nothing for now
  };

  const customHeader = (
    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 px-6 py-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
          {initials}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100 truncate">
            {clientName}
          </h2>
          {clientContact && (
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium truncate mt-0.5">
              {clientContact}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={requestClose}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        aria-label="Close modal"
      >
        <IoClose size={22} />
      </button>
    </div>
  );

  return (
    <>
      <CenterModal
        display={display}
        close={requestClose}
        header={customHeader}
        maxWidth="max-w-lg"
        className="p-0"
      >
        <div className="p-6 space-y-5">
          {/* Channel Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedChannel("email")}
              className={clsx(
                "flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer",
                selectedChannel === "email"
                  ? "border-theme-primary/20 bg-indigo-50/70 text-theme-primary dark:bg-indigo-950/40 dark:border-indigo-800/40 dark:text-indigo-300 shadow-xs"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300",
              )}
            >
              <IoMailOutline className="size-4.5" />
              <span>Email</span>
            </button>

            {/* WhatsApp option disabled for now */}
            <button
              type="button"
              disabled
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200/60 bg-gray-100/70 text-gray-400 dark:border-slate-800/60 dark:bg-slate-800/50 dark:text-slate-500 text-sm font-semibold cursor-not-allowed opacity-75"
              title="WhatsApp is currently disabled"
            >
              <RiWhatsappLine className="size-4.5" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-slate-100">
              <HiSparkles className="size-4 text-theme-primary dark:text-indigo-400" />
              <span>Use a Template</span>
            </div>
            <Select
              value={selectedTemplate}
              onChange={handleSelectTemplate}
              options={templateOptions}
              placeholder="Select a template"
              loading={isTemplatesLoading}
            />
          </div>

          {/* Message Rich Text Editor */}
          <RichTextEditor
            label="Message"
            value={message}
            onChange={setMessage}
            placeholder="Write your message here..."
            toolbarPosition="bottom"
            variant="compact"
            editorMinHeight="110px"
            showCharCount
          />

          {/* Modal Footer / Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
              <IoInformationCircleOutline className="size-4 shrink-0 text-gray-400 dark:text-slate-500" />
              <span>{clientName} will receive this via email.</span>
            </div>
            <BaseButton
              type="button"
              color="primary"
              onClick={handleSend}
              icon={<RiSendPlaneFill className="size-4" />}
              text="Send message"
              className="px-5 font-semibold"
            />
          </div>
        </div>
      </CenterModal>
      {prompt}
    </>
  );
}
