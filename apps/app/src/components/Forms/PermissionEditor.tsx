"use client";

import { useMemo, useState, type JSX } from "react";
import { clsx } from "clsx";
import { FiChevronDown, FiLock, FiAlertTriangle } from "react-icons/fi";
import { Checkbox } from "@/src/components/FormElements/Checkbox";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";
import {
  PERMISSION_GROUPS,
  PERMISSION_PRESETS,
  dependentsOf,
  matchPreset,
  permissionLabel,
  withRequired,
  type PermissionGroup,
  type PermissionOption,
} from "@/src/helpers/permissions";
import type { Permission } from "@/src/models/permission";

interface Props {
  /**
   * Permissions the owner picked. Anything they require is shown as granted
   * on top of these, and drops away again once nothing needs it.
   */
  selected: Permission[];
  onChange: (selected: Permission[]) => void;
}

interface PendingRemoval {
  title: string;
  /** The permissions the owner asked to turn off. */
  targets: Permission[];
  /** Granted permissions that stop working without the targets. */
  dependents: Permission[];
}

const listLabels = (permissions: Permission[]) =>
  permissions.map(permissionLabel).join(", ");

export function PermissionEditor({ selected, onChange }: Props): JSX.Element {
  const effective = useMemo(() => withRequired(selected), [selected]);
  const preset = useMemo(() => matchPreset(effective), [effective]);
  const [pending, setPending] = useState<PendingRemoval | null>(null);

  // Groups with anything granted start open; the rest stay out of the way.
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () =>
      new Set(
        PERMISSION_GROUPS.filter((g) =>
          g.permissions.some((p) => effective.has(p.key)),
        ).map((g) => g.id),
      ),
  );

  const toggleOpen = (id: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const grant = (permissions: Permission[]) => {
    onChange([...new Set([...selected, ...permissions])]);
    setOpenGroups((prev) => {
      const next = new Set(prev);
      PERMISSION_GROUPS.forEach((g) => {
        if (g.permissions.some((p) => permissions.includes(p.key)))
          next.add(g.id);
      });
      return next;
    });
  };

  const revoke = (targets: Permission[], dependents: Permission[]) => {
    const removed = new Set([...targets, ...dependents]);
    onChange(selected.filter((p) => !removed.has(p)));
  };

  /** Turns `targets` off, first confirming if other grants depend on them. */
  const requestRevoke = (targets: Permission[], title: string) => {
    const dependents = [
      ...new Set(targets.flatMap((t) => dependentsOf(t, effective))),
    ].filter((p) => !targets.includes(p));
    if (dependents.length) setPending({ title, targets, dependents });
    else revoke(targets, []);
  };

  const togglePermission = (option: PermissionOption) => {
    if (effective.has(option.key))
      requestRevoke([option.key], `Turn off ${option.label}?`);
    else grant([option.key]);
  };

  const toggleGroup = (group: PermissionGroup) => {
    const keys = group.permissions.map((p) => p.key);
    if (keys.every((k) => effective.has(k)))
      requestRevoke(keys, `Turn off all ${group.label} access?`);
    else grant(keys);
  };

  const autoAdded = [...effective].filter((p) => !selected.includes(p));

  return (
    <div className="space-y-6">
      {/* Presets */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300">
            Start from a preset
          </h3>
          <span className="text-xs font-medium text-gray-400 dark:text-slate-500">
            {preset
              ? preset.label
              : effective.size
                ? `Custom · ${effective.size} permission${effective.size === 1 ? "" : "s"}`
                : "No access"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PERMISSION_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.permissions)}
              className={clsx(
                "rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer",
                preset?.id === p.id
                  ? "border-theme-primary bg-theme-primary/5 dark:bg-theme-primary/10"
                  : "border-gray-200 hover:border-gray-300 dark:border-slate-700 dark:hover:border-slate-600",
              )}
            >
              <span className="block text-sm font-semibold text-gray-900 dark:text-slate-100">
                {p.label}
              </span>
              <span className="block text-xs text-gray-500 dark:text-slate-400">
                {p.desc}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Groups */}
      <section className="space-y-3">
        {PERMISSION_GROUPS.map((group) => {
          const granted = group.permissions.filter((p) =>
            effective.has(p.key),
          ).length;
          const total = group.permissions.length;
          const isOpen = openGroups.has(group.id);
          return (
            <div
              key={group.id}
              className="rounded-2xl border border-gray-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <GroupCheckbox
                  id={`perm-group-${group.id}`}
                  granted={granted}
                  total={total}
                  onChange={() => toggleGroup(group)}
                />
                <button
                  type="button"
                  onClick={() => toggleOpen(group.id)}
                  aria-expanded={isOpen}
                  className="flex flex-1 min-w-0 items-center justify-between gap-3 text-left cursor-pointer"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-slate-100">
                      {group.label}
                    </span>
                    <span className="block truncate text-xs text-gray-500 dark:text-slate-400">
                      {group.desc}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-gray-400 dark:text-slate-500">
                    {granted} of {total}
                    <FiChevronDown
                      className={clsx(
                        "size-4 transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </span>
                </button>
              </div>

              {isOpen && (
                <ul className="space-y-1 border-t border-gray-50 px-4 py-3 dark:border-slate-800/60">
                  {group.permissions.map((option) => (
                    <PermissionRow
                      key={option.key}
                      option={option}
                      checked={effective.has(option.key)}
                      auto={
                        effective.has(option.key) &&
                        !selected.includes(option.key)
                      }
                      requiredBy={dependentsOf(option.key, effective)}
                      onToggle={() => togglePermission(option)}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>

      {autoAdded.length > 0 && (
        <p className="rounded-xl bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-500 dark:bg-slate-800/40 dark:text-slate-400">
          <strong className="font-semibold text-gray-700 dark:text-slate-300">
            Also granted automatically:
          </strong>{" "}
          {autoAdded
            .map(
              (p) =>
                `${permissionLabel(p)} (needed for ${listLabels(dependentsOf(p, effective))})`,
            )
            .join("; ")}
        </p>
      )}

      <ConfirmActionModal
        display={!!pending}
        title={pending?.title}
        actionName="Turn off"
        message={
          pending &&
          `This also turns off ${listLabels(pending.dependents)}, which can't work without it.`
        }
        fn={() => {
          if (pending) revoke(pending.targets, pending.dependents);
          setPending(null);
        }}
        close={() => setPending(null)}
      />
    </div>
  );
}

function GroupCheckbox({
  id,
  granted,
  total,
  onChange,
}: {
  id: string;
  granted: number;
  total: number;
  onChange: () => void;
}): JSX.Element {
  return (
    <span
      className="flex"
      ref={(el) => {
        const input = el?.querySelector("input");
        if (input) input.indeterminate = granted > 0 && granted < total;
      }}
    >
      <Checkbox
        id={id}
        checked={granted === total}
        onChange={onChange}
        className="cursor-pointer"
      />
    </span>
  );
}

function PermissionRow({
  option,
  checked,
  auto,
  requiredBy,
  onToggle,
}: {
  option: PermissionOption;
  checked: boolean;
  auto: boolean;
  requiredBy: Permission[];
  onToggle: () => void;
}): JSX.Element {
  const id = `perm-${option.key}`;
  const locked = checked && requiredBy.length > 0;
  return (
    <li>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-slate-800/40"
      >
        <Checkbox
          id={id}
          checked={checked}
          onChange={onToggle}
          className="mt-0.5 cursor-pointer"
        />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex flex-wrap items-center gap-2 text-sm text-gray-700 dark:text-slate-200">
            {option.label}
            {option.sensitive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[0.7rem] font-semibold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <FiAlertTriangle className="size-3" />
                Sensitive
              </span>
            )}
            {auto && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.7rem] font-medium text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                Added automatically
              </span>
            )}
          </span>
          {locked && (
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500">
              <FiLock className="size-3 shrink-0" />
              Required by {listLabels(requiredBy)}
            </span>
          )}
        </span>
      </label>
    </li>
  );
}
