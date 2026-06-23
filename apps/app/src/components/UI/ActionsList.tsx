import * as Popover from "@radix-ui/react-popover";
import { useState, type ReactNode, type JSX } from "react";
import { clsx } from "clsx";
import { SlOptionsVertical } from "react-icons/sl";
import { ClipLoader } from "react-spinners";
import dynamic from "next/dynamic";
import Link from "next/link";

interface Props {
  trigger?: ReactNode;
  actions: Array<{
    title: string;
    fn?: () => void;
    loading?: boolean;
    color?: "blue" | "red";
    verifyUser?: boolean;
    href?: string;
    disabled?: boolean;
  }>;
}

const ConfirmActionModal = dynamic(
  async () =>
    (await import("@/src/components/Modals/ConfirmActionModal"))
      .ConfirmActionModal,
);

export function ActionsList({
  actions,
  trigger = (
    <span className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md">
      <SlOptionsVertical className="h-6 w-6 text-gray-500" />
    </span>
  ),
}: Props): JSX.Element {
  const [modalDisplay, setModalDisplay] = useState(false);
  // const [verifyUser, setVerifyUser] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<() => void>(() => {});
  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={5}
            className="z-10 w-48 space-y-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-xl will-change-[transform,opacity] focus:shadow-2xl"
          >
            <>
              {actions?.map(({ color = "blue", ...action }) => (
                <Popover.Close
                  key={action.title}
                  onClick={() => {
                    if (action.disabled) {
                      return;
                    }
                    if (action.verifyUser) {
                      setActionToConfirm(() => action.fn);
                      // setVerifyUser(true);
                      return;
                    }
                    if (
                      ["delete", "delete all"].includes(
                        action.title?.toLowerCase(),
                      )
                    ) {
                      setActionToConfirm(() => action.fn);
                      setModalDisplay(true);
                      return;
                    }
                    action.fn?.();
                  }}
                  className={clsx(
                    "flex w-full items-center gap-2 rounded-md px-3 py-1 text-sm font-medium",
                    {
                      "text-gray-600 dark:text-slate-300": !action.disabled,
                      "cursor-not-allowed text-gray-400 opacity-50":
                        action.disabled,
                      "hover:bg-theme-primary/10 hover:text-theme-primary":
                        color === "blue" && !action.disabled,
                      "text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30":
                        !action.disabled &&
                        (color === "red" ||
                          ["delete", "delete all", "deactivate"].includes(
                            action.title?.toLowerCase(),
                          )),
                      "text-red-300":
                        action.disabled &&
                        (color === "red" ||
                          ["delete", "delete all", "deactivate"].includes(
                            action.title?.toLowerCase(),
                          )),
                    },
                  )}
                >
                  {!action.href && (
                    <>
                      {action.title}
                      {action.loading && (
                        <ClipLoader size={12} color="#aaaaaa" />
                      )}
                    </>
                  )}
                  {action.href && (
                    <Link
                      href={action.href}
                      className="block size-full text-left"
                    >
                      {action.title}
                    </Link>
                  )}
                </Popover.Close>
              ))}
            </>
            <Popover.Arrow className="fill-gray-200 dark:fill-slate-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <ConfirmActionModal
        actionName="delete"
        display={modalDisplay}
        close={() => {
          setModalDisplay(false);
        }}
        fn={actionToConfirm}
      />
    </>
  );
}
