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
import Link from "next/link";
import { isAxiosError } from "axios";
import { CenterModal } from "@/src/components/UI/CenterModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import {
  Select,
  type ISelect,
  emptySelect,
} from "@/src/components/FormElements/Select";
import { RichTextEditor } from "@/src/components/FormElements/RichTextEditor";
import { useTemplatesQuery } from "@/src/hooks/useTemplateQuery";
import { useClientsQuery } from "@/src/hooks/useClientQuery";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Input } from "@/src/components/FormElements/Input";
import { FiSearch } from "react-icons/fi";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import { htmlToPlainText } from "@/src/helpers/htmlHelpers";
import { getInitials } from "@/src/helpers/stringHelpers";
import { useSubscription } from "@/src/hooks/useSubscription";
import { usePermissions } from "@/src/hooks/usePermissions";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import {
  useCancelMessage,
  useConfirmMessage,
  useInitiateWhatsappMessage,
  useSendEmailMessage,
} from "@/src/hooks/useWhatsappMessageMutations";
import { customToast } from "@/src/helpers/customToast";
import {
  clearWhatsappPending,
  setModalConfirming,
  writeWhatsappPending,
  type WhatsappPending,
} from "@/src/helpers/whatsappPending";
import { EMAIL_SUBJECT_LIMIT, WHATSAPP_BODY_LIMIT } from "@/src/models/message";
import type { IUserData } from "@/src/models/auth";
import { WhatsappConfirmBody } from "@/src/components/Modals/WhatsappConfirmBody";
import type { IEvent } from "@/src/models/event";

interface MessageClient {
  id?: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
}

export interface SendClientMessageModalProps {
  display: boolean;
  close: () => void;
  event?: IEvent | null;
  client?: MessageClient | null;
  /** Pre-fills the message. When no client/event is given, the user picks a client first. */
  initialTemplate?: { id: string; message: string } | null;
}

export function SendClientMessageModal({
  display,
  close,
  event,
  client: clientProp,
  initialTemplate,
}: SendClientMessageModalProps): JSX.Element | null {
  const [pickedClient, setPickedClient] = useState<MessageClient | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const debouncedClientSearch = useDebounce(clientSearch.trim(), 400);
  const client = clientProp ?? pickedClient;
  const needsClient = !clientProp && !event && !pickedClient;
  const { data: clientsData, isLoading: isClientsLoading } = useClientsQuery(
    { page: 1, limit: 5, search: debouncedClientSearch },
    { enabled: display && needsClient && !!debouncedClientSearch },
  );
  const [selectedChannel, setSelectedChannel] = useState<"email" | "whatsapp">(
    "email",
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<ISelect>(emptySelect());
  // Email is rich text (HTML); WhatsApp is plain text.
  const [message, setMessage] = useState<string>("");
  const [whatsappMessage, setWhatsappMessage] = useState<string>("");
  const [subject, setSubject] = useState("");
  // Template/event defaults only fill the subject until the user types one.
  const [subjectEdited, setSubjectEdited] = useState(false);
  // Set when the API rejects with COMPANY_EMAIL_REQUIRED (cached company stale).
  const [companyEmailRejected, setCompanyEmailRejected] = useState(false);
  const [pending, setPending] = useState<WhatsappPending | null>(null);
  const [answering, setAnswering] = useState<"yes" | "no" | null>(null);
  const isWhatsapp = selectedChannel === "whatsapp";

  const initiateWhatsapp = useInitiateWhatsappMessage();
  const confirmMessage = useConfirmMessage();
  const cancelMessage = useCancelMessage();
  const sendEmail = useSendEmailMessage();

  // Templates are optional; without access the message is written by hand.
  const { can, reasonFor, isOwner } = usePermissions();
  const user = useAppSelector((state) => state.auth.user) as IUserData | null;
  const companyEmail = user?.company?.email;
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
  // Not clientContact: that falls back to the phone number for display.
  // Opened from an event: default the subject to its title until edited.
  const subjectValue = subject || (subjectEdited ? "" : (event?.title ?? ""));
  const emailAddress = client?.email || participant?.email || "";
  const companyEmailMissing = !companyEmail || companyEmailRejected;
  const emailMissingReason = !clientId
    ? "Client can't be identified"
    : !emailAddress
      ? "Client has no email address"
      : companyEmailMissing
        ? isOwner
          ? "Add a business email in Settings → Company to email clients"
          : "Ask the account owner to add a business email"
        : undefined;
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
    setPickedClient(null);
    setClientSearch("");
    setSelectedTemplate(emptySelect());
    setMessage("");
    setSubject("");
    setSubjectEdited(false);
    setCompanyEmailRejected(false);
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
      (subjectEdited && subjectValue.trim().length > 0) ||
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

  const fillName = (text: string, name: string = clientName) =>
    text.replace(/\{\{\s*fullName\s*\}\}/gi, name);

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
    if (!isWhatsapp && !subjectEdited && option.label) {
      setSubject(fillName(option.label));
    }
  };

  // Pre-fill from a template chosen elsewhere, using the picked client's name.
  const handlePickClient = (c: MessageClient) => {
    setPickedClient(c);
    if (!initialTemplate) return;
    setSelectedTemplate({
      value: { _id: initialTemplate.id, message: initialTemplate.message },
      label: "",
    });
    const html = fillName(initialTemplate.message, c.fullName).trim();
    setMessage(html);
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
      const url = data.whatsappUrl;
      if (!url) throw new Error("Missing WhatsApp link");
      if (tab) tab.location.href = url;
      else window.location.href = url;
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

  const emailText = htmlToPlainText(message).trim();
  const canSendEmail =
    !!subjectValue.trim() &&
    !!emailText &&
    !emailMissingReason &&
    !sendEmail.isPending;

  const handleSend = async () => {
    if (!canSendEmail || !clientId) return;
    try {
      await sendEmail.mutateAsync({
        clientId,
        subject: subjectValue.trim(),
        body: message,
        templateId: selectedTemplate.value?._id,
        eventId: event?.id,
      });
      // 202 means queued, not delivered.
      customToast.success("Email queued");
      handleActualClose();
    } catch (error) {
      // The axios interceptor already toasted the API error; keep the form open.
      if (
        isAxiosError(error) &&
        error.response?.data?.code === "COMPANY_EMAIL_REQUIRED"
      ) {
        setCompanyEmailRejected(true);
      }
    }
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
        {needsClient ? (
          <div className="p-6 space-y-3">
            <Input
              id="message-client-search"
              type="search"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              placeholder="Search clients"
              aria-label="Search clients"
              autoFocus
              className="h-12 rounded-2xl pl-11"
              icon={
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-gray-400" />
              }
            />
            {!clientSearch.trim() ? (
              <p className="px-1 text-xs text-gray-400 dark:text-slate-500">
                Search for the client you want to message.
              </p>
            ) : isClientsLoading ||
              clientSearch.trim() !== debouncedClientSearch ? (
              <p className="px-1 text-sm text-gray-500 dark:text-slate-400">
                Searching...
              </p>
            ) : (clientsData?.data ?? []).length === 0 ? (
              <p className="px-1 py-3 text-center text-sm text-gray-500 dark:text-slate-400">
                No clients match &quot;{debouncedClientSearch}&quot;
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {(clientsData?.data ?? []).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handlePickClient(c)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                      {getInitials(c.fullName) || "CL"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-slate-100">
                        {c.fullName}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-slate-400">
                        {c.email || c.phoneNumber}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : pending ? (
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
              <>
                <Input
                  id="email-subject"
                  label="Subject"
                  value={subjectValue}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setSubjectEdited(true);
                  }}
                  maxLength={EMAIL_SUBJECT_LIMIT}
                  placeholder="Email subject"
                />
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
              </>
            )}

            {!isWhatsapp && companyEmailMissing && (
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {isOwner ? (
                  <>
                    Add a business email in{" "}
                    <Link
                      href="/profile?tab=business"
                      className="font-semibold underline"
                    >
                      Settings → Company
                    </Link>{" "}
                    to email clients.
                  </>
                ) : (
                  "Ask the account owner to add a business email."
                )}
              </p>
            )}

            {/* Modal Footer / Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                <IoInformationCircleOutline className="size-4 shrink-0 text-gray-400 dark:text-slate-500" />
                <span>
                  {isWhatsapp
                    ? `${clientName} will receive this on WhatsApp. You'll press send in WhatsApp.`
                    : `${clientName} will receive this via email.${
                        companyEmail ? ` Replies go to ${companyEmail}.` : ""
                      }`}
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
                loading={isWhatsapp ? isOpening : sendEmail.isPending}
                disabledReason={
                  writeLockReason ??
                  (isWhatsapp ? undefined : emailMissingReason)
                }
                disabled={
                  isWhatsapp
                    ? !whatsappBody || whatsappTooLong || isOpening
                    : !canSendEmail
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
