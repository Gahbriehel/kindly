"use client";

import { useMemo, useState, type JSX, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { FiAlertTriangle, FiMail } from "react-icons/fi";
import { SidebarModal } from "@/src/components/UI/SidebarModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";
import { PermissionEditor } from "@/src/components/Forms/PermissionEditor";
import {
  isSensitive,
  permissionLabel,
  withRequired,
} from "@/src/helpers/permissions";
import {
  useInviteStaff,
  useResendInvite,
  useRevokeInvite,
  useSetStaffStatus,
  useUpdateInvitePermissions,
  useUpdateStaffPermissions,
} from "@/src/hooks/useStaffQuery";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import type { Permission } from "@/src/models/permission";
import type { IStaffInvite, IStaffMember } from "@/src/models/staff";

export type StaffAccessTarget =
  | { kind: "member"; member: IStaffMember }
  | { kind: "invite"; invite: IStaffInvite }
  | { kind: "new" };

interface InviteFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

interface Props {
  target: StaffAccessTarget;
  /** Status pill shown under the name, e.g. Active or Invited. */
  badge?: ReactNode;
  close: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sameSet = (a: Set<Permission>, b: Set<Permission>) =>
  a.size === b.size && [...a].every((p) => b.has(p));

const initialPermissions = (target: StaffAccessTarget) =>
  target.kind === "member"
    ? target.member.permissions
    : target.kind === "invite"
      ? target.invite.permissions
      : [];

/** Edit a member's or pending invite's access, or invite someone new. */
export function StaffAccessDrawer({
  target,
  badge,
  close,
}: Props): JSX.Element {
  const person = target.kind === "member" ? target.member : null;
  const invite = target.kind === "invite" ? target.invite : null;
  const isNew = target.kind === "new";
  const isOwner = person?.role === "OWNER";
  const inviteExpired = !!invite && new Date(invite.expiresAt) <= new Date();
  const readOnly = isOwner || inviteExpired;

  const initial = useMemo(() => initialPermissions(target), [target]);
  const [selected, setSelected] = useState<Permission[]>(initial);
  const effective = useMemo(() => withRequired(selected), [selected]);
  const initialEffective = useMemo(() => withRequired(initial), [initial]);
  const permissionsDirty = !sameSet(effective, initialEffective);

  const [confirmSensitive, setConfirmSensitive] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [permissionsError, setPermissionsError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { isDirty: formDirty },
  } = useForm<InviteFormValues>({
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  const { requestClose, prompt } = useUnsavedChangesGuard(
    permissionsDirty || formDirty,
    close,
  );

  const updateMember = useUpdateStaffPermissions();
  const updateInvite = useUpdateInvitePermissions();
  const inviteStaff = useInviteStaff();
  const setStatus = useSetStaffStatus();
  const resend = useResendInvite();
  const revoke = useRevokeInvite();

  const saving =
    updateMember.isPending || updateInvite.isPending || inviteStaff.isPending;

  const newlySensitive = [...effective].filter(
    (p) => isSensitive(p) && !initialEffective.has(p),
  );

  const save = (values?: InviteFormValues) => {
    const permissions = [...effective];
    const options = { onSuccess: close };
    if (target.kind === "member")
      updateMember.mutate({ id: target.member.id, permissions }, options);
    else if (target.kind === "invite")
      updateInvite.mutate({ id: target.invite.id, permissions }, options);
    else if (values)
      inviteStaff.mutate(
        {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          permissions,
        },
        options,
      );
  };

  // Field validation runs first; then permissions; then the sensitive check.
  const submit = handleSubmit((values) => {
    if (!effective.size) {
      setPermissionsError(
        isNew
          ? "Choose at least one permission before sending the invite."
          : "Choose at least one permission, or deactivate this member instead.",
      );
      return;
    }
    setPermissionsError("");
    if (newlySensitive.length) setConfirmSensitive(true);
    else save(values);
  });

  const subject = person ?? invite;
  const firstName = subject?.firstName ?? "";
  const lastName = subject?.lastName ?? "";

  const header = isNew ? (
    "Invite Staff"
  ) : (
    <div className="flex items-center gap-3 min-w-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-slate-800 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        {`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="truncate font-manrope text-base font-bold text-gray-900 dark:text-slate-100">
            {firstName} {lastName}
          </h2>
          {badge}
        </div>
        <p className="flex items-center gap-1.5 truncate text-xs text-gray-500 dark:text-slate-400">
          <FiMail className="size-3 shrink-0" />
          {subject?.email}
        </p>
      </div>
    </div>
  );

  const secondaryActions = person && !isOwner && (
    <BaseButton
      type="button"
      color={person.isActive ? "outline" : "white"}
      text={person.isActive ? "Deactivate" : "Reactivate"}
      loading={setStatus.isPending}
      onClick={() => setConfirmStatus(true)}
      className="mr-auto"
    />
  );

  const inviteActions = invite && (
    <div className="mr-auto flex gap-3">
      <BaseButton
        type="button"
        color="outline"
        text="Resend"
        loading={resend.isPending}
        onClick={() => resend.mutate(invite.id, { onSuccess: close })}
      />
      {!inviteExpired && (
        <BaseButton
          type="button"
          color="outline"
          text="Revoke"
          loading={revoke.isPending}
          onClick={() => setConfirmRevoke(true)}
        />
      )}
    </div>
  );

  return (
    <>
      <SidebarModal
        display
        close={requestClose}
        title={header}
        footer={
          <div className="flex w-full flex-wrap items-center justify-end gap-3">
            {secondaryActions}
            {inviteActions}
            {readOnly ? (
              <BaseButton
                type="button"
                color="outline"
                text="Close"
                onClick={close}
              />
            ) : (
              <>
                <BaseButton
                  type="button"
                  color="outline"
                  text="Cancel"
                  onClick={requestClose}
                />
                <BaseButton
                  type="button"
                  color="primary"
                  text={isNew ? "Send Invite" : "Save Changes"}
                  loading={saving}
                  disabled={!isNew && !permissionsDirty}
                  onClick={submit}
                />
              </>
            )}
          </div>
        }
      >
        {isOwner ? (
          <p className="rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
            Owners have full access to everything, including staff and business
            settings. Their access can&apos;t be changed.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-8">
            {isNew && (
              <section className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{
                      validate: (v) =>
                        v.trim().length >= 2 || "Enter at least 2 characters",
                    }}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        id="invite-first-name"
                        label="First Name"
                        error={fieldState.error?.message}
                        required
                        autoFocus
                      />
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{
                      validate: (v) =>
                        v.trim().length >= 2 || "Enter at least 2 characters",
                    }}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        id="invite-last-name"
                        label="Last Name"
                        error={fieldState.error?.message}
                        required
                      />
                    )}
                  />
                </div>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    validate: (v) =>
                      EMAIL_PATTERN.test(v.trim()) ||
                      "Enter a valid email address",
                  }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      id="invite-email"
                      type="email"
                      label="Email"
                      placeholder="name@example.com"
                      error={fieldState.error?.message}
                      required
                    />
                  )}
                />
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  They&apos;ll get an email with a link to set a password. The
                  link expires after 7 days.
                </p>
              </section>
            )}

            {inviteExpired && (
              <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-slate-800/40 dark:text-slate-300">
                This invitation has expired. Resend it to send a new link; you
                can then change its permissions.
              </p>
            )}

            <fieldset
              disabled={inviteExpired}
              className="disabled:pointer-events-none disabled:opacity-60"
            >
              <PermissionEditor
                selected={selected}
                onChange={(next) => {
                  setSelected(next);
                  setPermissionsError("");
                }}
              />
            </fieldset>

            {permissionsError ? (
              <p className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <FiAlertTriangle className="size-4 shrink-0" />
                {permissionsError}
              </p>
            ) : (
              !effective.size &&
              !inviteExpired && (
                <p className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <FiAlertTriangle className="size-4 shrink-0" />
                  With no permissions, {firstName || "they"} can sign in but
                  only sees their profile.
                </p>
              )
            )}
          </form>
        )}
      </SidebarModal>

      <ConfirmActionModal
        display={confirmSensitive}
        title="Grant sensitive permissions?"
        actionName={isNew ? "Send Invite" : "Save"}
        confirmColor="primary"
        message={`${firstName || "They"} will be able to: ${newlySensitive.map(permissionLabel).join(", ")}. These actions can't be undone.`}
        loading={saving}
        fn={() => {
          setConfirmSensitive(false);
          void handleSubmit(save)();
        }}
        close={() => setConfirmSensitive(false)}
      />

      {person && (
        <ConfirmActionModal
          display={confirmStatus}
          actionName={person.isActive ? "Deactivate" : "Reactivate"}
          confirmColor={person.isActive ? "danger" : "primary"}
          message={
            person.isActive
              ? `${person.firstName} will be signed out everywhere and won't be able to sign in until reactivated. Their permissions are kept.`
              : `${person.firstName} will be able to sign in again with their current permissions.`
          }
          loading={setStatus.isPending}
          fn={() =>
            setStatus.mutate(
              { id: person.id, isActive: !person.isActive },
              { onSuccess: close },
            )
          }
          close={() => setConfirmStatus(false)}
        />
      )}

      {invite && (
        <ConfirmActionModal
          display={confirmRevoke}
          actionName="Revoke"
          message={`The link sent to ${invite.email} will stop working. You can invite them again later.`}
          loading={revoke.isPending}
          fn={() => revoke.mutate(invite.id, { onSuccess: close })}
          close={() => setConfirmRevoke(false)}
        />
      )}

      {prompt}
    </>
  );
}
