"use client";

import { useState, useMemo, useEffect, type JSX } from "react";
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
import { useSubscription } from "@/src/hooks/useSubscription";
import { usePermissions } from "@/src/hooks/usePermissions";
import {
  useCancelMessage,
  useConfirmMessage,
  useInitiateWhatsappMessage,
} from "@/src/hooks/useWhatsappMessageMutations";
import { customToast } from "@/src/helpers/customToast";
import {
  clearWhatsappPending,
  setModalConfirming,
  writeWhatsappPending,
  type WhatsappPending,
} from "@/src/helpers/whatsappPending";
import { WHATSAPP_BODY_LIMIT } from "@/src/models/message";
import { WhatsappConfirmBody } from "@/src/components/Modals/WhatsappConfirmBody";
import type { IEvent } from "@/src/models/event";

export interface SendClientMessageModalProps {
  display: boolean;
  close: () => void;
  event?: IEvent | null;
  client?: {
    id?: string;
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
  // Email is rich text (HTML); WhatsApp is plain text.
  const [message, setMessage] = useState<string>("");
  const [whatsappMessage, setWhatsappMessage] = useState<string>("");
  const [pending, setPending] = useState<WhatsappPending | null>(null);
  const [answering, setAnswering] = useState<"yes" | "no" | null>(null);
  const isWhatsapp = selectedChannel === "whatsapp";

  const initiateWhatsapp = useInitiateWhatsappMessage();
  const confirmMessage = useConfirmMessage();
  const cancelMessage = useCancelMessage();

  // Templates are optional; without access the message is written by hand.
  const { can, reasonFor } = usePermissions();
  const { data: templatesData, isLoading: isTemplatesLoading } =
    useTemplatesQuery({ limit: 50 }, { enabled: can("TEMPLATE_VIEW") });

  // Extract client information from event or prop
  const participant = event?.participants?.[0]?.client;
  const clientName =
    client?.fullName || participant?.fullName || event?.title || "Client";
  // Show where the message goes on the selected channel
  const clientId = client?.id || participant?.id;
  const phoneNumber = client?.phoneNumber || participant?.phoneNumber || "";
  const clientContact = isWhatsapp
    ? phoneNumber
    : client?.email ||
      participant?.email ||
      client?.phoneNumber ||
      participant?.phoneNumber ||
      "";
  const whatsappDisabledReason = reasonFor("CLIENT_VIEW")
    ? reasonFor("CLIENT_VIEW")
    : !phoneNumber
      ? "Client has no phone number"
      : !clientId
        ? "Client can't be identified"
        : undefined;
  const initials = getInitials(clientName) || "CL";

  // Handle actual close: reset state and trigger close
  const handleActualClose = () => {
    setSelectedTemplate(emptySelect());
    setMessage("");
    setWhatsappMessage("");
    setSelectedChannel("email");
    setPending(null);
    setAnswering(null);
    setModalConfirming(false);
    close();
  };

  // Once WhatsApp is opened the text has been logged, so nothing is unsaved.
  const isDirty =
    !pending &&
    (htmlToPlainText(message).length > 0 ||
      whatsappMessage.trim().length > 0 ||
      Boolean(selectedTemplate.value?._id));

  // Tell the global prompt that this modal is asking the question itself.
  useEffect(() => {
    setModalConfirming(!!pending && display);
    return () => setModalConfirming(false);
  }, [pending, display]);

  const { requestClose, prompt } = useUnsavedChangesGuard(
    isDirty,
    handleActualClose,
    display,
  );

  // Transform templates for Select component
  const templateOptions: ISelect[] = useMemo(() => {
    const list = templatesData?.data ?? [];
    // WhatsApp prefers WHATSAPP templates, and can reuse EMAIL ones.
    const usable = isWhatsapp
      ? list
          .filter((t) => t.type === "WHATSAPP" || t.type === "EMAIL")
          .sort(
            (a, b) =>
              Number(b.type === "WHATSAPP") - Number(a.type === "WHATSAPP"),
          )
      : list;
    return usable.map((t) => ({
      value: {
        _id: t.id,
        message: t.message,
      },
      label: t.title,
    }));
  }, [templatesData, isWhatsapp]);

  const fillName = (text: string) =>
    text.replace(/\{\{\s*fullName\s*\}\}/gi, clientName);

  const handleChannelChange = (channel: "email" | "whatsapp") => {
    if (channel === selectedChannel) return;
    setSelectedChannel(channel);
    // A template picked on one channel may not be offered on the other.
    setSelectedTemplate(emptySelect());
  };

  // When a template is picked, fill the message into the rich text editor
  const handleSelectTemplate = (option: ISelect) => {
    setSelectedTemplate(option);
    if (option.value?.message) {
      // Clean trailing empty paragraphs if present
      const cleanHtml = option.value.message
        .replace(/(<p><\/p>|<p><br><\/p>)+$/gi, "")
        .trim();
      const html = fillName(cleanHtml || option.value.message);
      if (isWhatsapp) {
        // WhatsApp has no rich text; convert once, keeping line breaks.
        setWhatsappMessage(htmlToPlainText(html));
      } else {
        setMessage(html);
      }
    }
  };

  const whatsappBody = whatsappMessage.trim();
  const whatsappTooLong = whatsappMessage.length > WHATSAPP_BODY_LIMIT;
  const isOpening = initiateWhatsapp.isPending;
  const { writeLockReason } = useSubscription();

  const handleOpenWhatsapp = async () => {
    if (!clientId || !whatsappBody || whatsappTooLong || isOpening || pending)
      return;
    // Open the tab synchronously in the click handler, or popup blockers
    // block it after the await.
    const tab = window.open("about:blank", "_blank");
    if (tab) tab.opener = null;

    try {
      const { data } = await initiateWhatsapp.mutateAsync({
        clientId,
        body: whatsappBody,
        templateId: selectedTemplate.value?._id,
        eventId: event?.id,
      });
      if (tab) tab.location.href = data.whatsappUrl;
      else window.location.href = data.whatsappUrl;
      const next = { id: data.id, clientName };
      writeWhatsappPending(next);
      setPending(next);
    } catch {
      // The axios interceptor already toasted the API error.
      tab?.close();
    }
  };

  const answerPending = async (choice: "yes" | "no") => {
    if (!pending) return;
    setAnswering(choice);
    try {
      if (choice === "yes") {
        await confirmMessage.mutateAsync(pending.id);
        customToast.success("Logged");
      } else {
        await cancelMessage.mutateAsync(pending.id);
      }
      clearWhatsappPending();
      if (choice === "yes") {
        handleActualClose();
      } else {
        // Back to editing; the text is kept.
        setPending(null);
      }
    } catch {
      // Error already toasted; keep the question so the user can retry.
    } finally {
      setAnswering(null);
    }
  };

  const handleSend = () => {
    // Email sending is not wired to an endpoint yet and does nothing for now
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
        {pending ? (
          <WhatsappConfirmBody
            clientName={pending.clientName}
            loading={answering}
            onYes={() => answerPending("yes")}
            onNo={() => answerPending("no")}
          />
        ) : (
          <div className="p-6 space-y-5">
            {/* Channel Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChannelChange("email")}
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

              <span title={whatsappDisabledReason} className="flex">
                <button
                  type="button"
                  onClick={() => handleChannelChange("whatsapp")}
                  disabled={!!whatsappDisabledReason}
                  aria-pressed={isWhatsapp}
                  className={clsx(
                    "flex h-12 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-75",
                    isWhatsapp
                      ? "border-theme-primary/20 bg-indigo-50/70 text-theme-primary dark:bg-indigo-950/40 dark:border-indigo-800/40 dark:text-indigo-300 shadow-xs"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 disabled:bg-gray-100/70 disabled:text-gray-400 dark:disabled:bg-slate-800/50 dark:disabled:text-slate-500",
                  )}
                >
                  <RiWhatsappLine className="size-4.5" />
                  <span>WhatsApp</span>
                </button>
              </span>
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

            {/* WhatsApp has no rich text, so it gets a plain textarea */}
            {isWhatsapp ? (
              <div className="space-y-2">
                <label
                  htmlFor="whatsapp-message"
                  className="text-sm font-semibold text-gray-900 dark:text-slate-100"
                >
                  Message
                </label>
                <textarea
                  id="whatsapp-message"
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full resize-y rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none focus:border-theme-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <p
                  className={clsx(
                    "text-right text-xs",
                    whatsappTooLong
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-400 dark:text-slate-500",
                  )}
                >
                  {whatsappMessage.length}/{WHATSAPP_BODY_LIMIT}
                </p>
              </div>
            ) : (
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
            )}

            {/* Modal Footer / Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                <IoInformationCircleOutline className="size-4 shrink-0 text-gray-400 dark:text-slate-500" />
                <span>
                  {isWhatsapp
                    ? `${clientName} will receive this on WhatsApp. You'll press send in WhatsApp.`
                    : `${clientName} will receive this via email.`}
                </span>
              </div>
              <BaseButton
                type="button"
                color="primary"
                onClick={isWhatsapp ? handleOpenWhatsapp : handleSend}
                icon={
                  isWhatsapp ? (
                    <RiWhatsappLine className="size-4" />
                  ) : (
                    <RiSendPlaneFill className="size-4" />
                  )
                }
                text={isWhatsapp ? "Open WhatsApp" : "Send message"}
                loading={isWhatsapp && isOpening}
                disabledReason={writeLockReason}
                disabled={
                  isWhatsapp && (!whatsappBody || whatsappTooLong || isOpening)
                }
                className="px-5 font-semibold"
              />
            </div>
          </div>
        )}
      </CenterModal>
      {prompt}
    </>
  );
}
