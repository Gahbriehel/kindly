"use client";

import { useMemo, useState, type ComponentProps, type JSX } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  Controller,
  type Control,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import {
  FiChevronDown,
  FiMail,
  FiPhone,
  FiPlus,
  FiTag,
  FiX,
} from "react-icons/fi";
import { clsx } from "clsx";
import { SidebarModal } from "@/src/components/UI/SidebarModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import {
  Select,
  emptySelect,
  type ISelect,
} from "@/src/components/FormElements/Select";
import { useCategoriesQuery } from "@/src/hooks/useCategoryQuery";
import { useAddClient, useUpdateClient } from "@/src/hooks/useClientQuery";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import { customToast } from "@/src/helpers/customToast";
import { formatDateToInputType } from "@/src/helpers/formatDate";
import type {
  IClient,
  ICreateClientItem,
  ICreateClientPayload,
} from "@/src/models/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface PersonValues {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
}

interface ClientFormValues {
  persons: PersonValues[];
  category: ISelect;
  eventName: string;
  eventDate: string;
  birthDate: string;
  tags: string[];
}

const emptyPerson = (): PersonValues => ({
  name: "",
  phone: "",
  email: "",
  birthDate: "",
});

function getDefaultValues(client: IClient | null): ClientFormValues {
  if (!client) {
    return {
      persons: [emptyPerson()],
      category: emptySelect(),
      eventName: "",
      eventDate: "",
      birthDate: "",
      tags: [],
    };
  }
  return {
    persons: [
      {
        name: client.fullName ?? "",
        phone: client.phoneNumber ?? "",
        email: client.email ?? "",
        birthDate: "",
      },
    ],
    category: emptySelect(),
    eventName: "",
    eventDate: "",
    birthDate: client.birthDate ? formatDateToInputType(client.birthDate) : "",
    tags: client.tags ?? [],
  };
}

function toItem(person: PersonValues): ICreateClientItem {
  return {
    name: person.name.trim(),
    ...(person.phone.trim() && { phoneNumber: person.phone.trim() }),
    ...(person.email.trim() && { email: person.email.trim() }),
    ...(person.birthDate && { birthDate: person.birthDate }),
  };
}

type InputProps = Omit<ComponentProps<typeof Input>, "name" | "defaultValue">;

function ControlledInput({
  name,
  control,
  rules,
  ...props
}: InputProps & {
  name: Path<ClientFormValues>;
  control: Control<ClientFormValues>;
  rules?: RegisterOptions<ClientFormValues>;
}): JSX.Element {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Input
          {...props}
          {...field}
          value={field.value as string}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

interface Props {
  close: () => void;
  /** When provided the modal edits this client, otherwise it creates one. */
  client?: IClient | null;
}

export function ClientFormModal({ close, client = null }: Props): JSX.Element {
  const isEdit = !!client;
  const [eventOpen, setEventOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<ClientFormValues>({
    defaultValues: getDefaultValues(client),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "persons",
  });

  const handleClose = close;
  const { requestClose, prompt } = useUnsavedChangesGuard(
    isDirty || tagInput.trim() !== "",
    close,
  );

  const addMutation = useAddClient({
    onSuccess: () => {
      customToast.success("Client added successfully");
      handleClose();
    },
  });
  const updateMutation = useUpdateClient({
    onSuccess: () => {
      customToast.success("Client updated successfully");
      handleClose();
    },
  });

  const isSubmitting = addMutation.isPending || updateMutation.isPending;
  const tags = useWatch({ control, name: "tags" });
  const eventName = useWatch({ control, name: "eventName" });
  const anyBirthDate = useWatch({ control, name: "persons" }).some(
    (p) => p.birthDate,
  );

  const { data: categoriesData, isLoading: loadingCategories } =
    useCategoriesQuery();
  // The backend creates the Birthday event itself when a birth date is given.
  const availableCategories = useMemo(() => {
    const categories = categoriesData?.data.categories ?? [];
    return (
      anyBirthDate
        ? categories.filter((c) => c.name.toLowerCase() !== "birthday")
        : categories
    ).map((c): ISelect => ({ value: { _id: c.id }, label: c.name }));
  }, [categoriesData, anyBirthDate]);

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (!tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setValue("tags", [...tags, value]);
    }
    setTagInput("");
  };

  const onSubmit = (values: ClientFormValues) => {
    const [first] = values.persons;

    if (client) {
      updateMutation.mutate({
        id: client.id,
        payload: {
          fullName: first.name.trim(),
          email: first.email.trim(),
          phoneNumber: first.phone.trim(),
          ...(values.birthDate && { birthDate: values.birthDate }),
          tags: values.tags,
        },
      });
      return;
    }

    const isMultiple = values.persons.length > 1;
    const payload: ICreateClientPayload = {
      type: isMultiple ? "MULTIPLE" : "INDIVIDUAL",
      individual: isMultiple ? null : toItem(first),
      multiple: isMultiple ? values.persons.map(toItem) : null,
      ...(values.eventName.trim() &&
        values.eventDate && {
          eventName: values.eventName.trim(),
          eventDate: values.eventDate,
          ...(values.category.value._id && {
            categoryId: values.category.value._id,
          }),
        }),
    };
    addMutation.mutate(payload);
  };

  const phoneIcon = (
    <FiPhone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
  );
  const mailIcon = (
    <FiMail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
  );

  return (
    <SidebarModal
      display
      close={requestClose}
      title={isEdit ? "Edit Client" : "Add New Client"}
      footer={
        <>
          <BaseButton
            type="button"
            color="outline"
            text="Cancel"
            onClick={requestClose}
            disabled={isSubmitting}
            className="h-12 flex-1 rounded-2xl"
          />
          <BaseButton
            type="button"
            color="primary"
            text={isEdit ? "Save Changes" : "Add Client"}
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
            className="h-12 flex-1 rounded-2xl"
          />
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
          Client Details
        </h3>

        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-6">
            {index > 0 && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-5 dark:border-slate-800">
                <span className="text-sm font-semibold text-gray-600 dark:text-slate-300">
                  Person {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex cursor-pointer items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                >
                  <FiX className="size-3.5" /> Remove
                </button>
              </div>
            )}
            <ControlledInput
              control={control}
              name={`persons.${index}.name`}
              rules={{
                validate: (v) =>
                  !!(v as string).trim() || "Full name is required",
              }}
              id={`person-${index}-name`}
              label="Full Name"
              placeholder="e.g. Sarah Johnson"
              required
              autoFocus={index === 0}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <ControlledInput
                control={control}
                name={`persons.${index}.phone`}
                id={`person-${index}-phone`}
                label="Phone"
                type="tel"
                placeholder="+1 234 567 8900"
                className="pl-10"
                icon={phoneIcon}
              />
              <ControlledInput
                control={control}
                name={`persons.${index}.email`}
                rules={{
                  validate: (v) =>
                    !(v as string).trim() ||
                    EMAIL_REGEX.test((v as string).trim()) ||
                    "Invalid email",
                }}
                id={`person-${index}-email`}
                label="Email"
                type="email"
                placeholder="email@example.com"
                className="pl-10"
                icon={mailIcon}
              />
            </div>
            {!isEdit && (
              <ControlledInput
                control={control}
                name={`persons.${index}.birthDate`}
                id={`person-${index}-birth-date`}
                label="Birth Date (Optional)"
                type="date"
              />
            )}
          </div>
        ))}

        {!isEdit && (
          <button
            type="button"
            onClick={() => append(emptyPerson())}
            className="flex cursor-pointer items-center gap-1.5 self-end text-sm font-medium text-theme-primary hover:underline"
          >
            <FiPlus className="size-4" /> Add Another person
          </button>
        )}

        {isEdit && (
          <>
            <ControlledInput
              control={control}
              name="birthDate"
              id="client-birth-date"
              label="Birth Date"
              type="date"
            />
            <div className="space-y-2">
              <label
                htmlFor="client-tag"
                className="block text-sm font-semibold text-gray-600 dark:text-slate-400"
              >
                Tags (Optional)
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <FiTag className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="client-tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="e.g. VIP, Referral..."
                    className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm font-medium text-gray-700 outline-none transition-all placeholder-gray-400 focus:border-theme-primary focus:bg-white focus:ring-2 focus:ring-theme-primary/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder-slate-500"
                  />
                </div>
                <BaseButton
                  type="button"
                  color="primary"
                  text="Add"
                  onClick={addTag}
                  className="rounded-xl px-5"
                />
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                      <button
                        type="button"
                        aria-label={`Remove ${tag}`}
                        onClick={() =>
                          setValue(
                            "tags",
                            tags.filter((t) => t !== tag),
                          )
                        }
                        className="cursor-pointer text-gray-400 hover:text-red-500"
                      >
                        <FiX className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!isEdit && (
          <div className="border-t border-gray-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEventOpen((o) => !o)}
              aria-expanded={eventOpen}
              className="flex w-full cursor-pointer items-center justify-between text-left"
            >
              <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                Event / Milestone{" "}
                <span className="text-xs font-normal text-gray-500 dark:text-slate-400">
                  (optional)
                </span>
              </span>
              <FiChevronDown
                className={clsx(
                  "size-5 text-gray-400 transition-transform",
                  eventOpen && "rotate-180",
                )}
              />
            </button>

            {eventOpen && (
              <div className="mt-5 flex flex-col gap-6">
                <ControlledInput
                  control={control}
                  name="eventName"
                  id="client-event-name"
                  label="Event Name"
                  placeholder="e.g. Grace's Wedding"
                />
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      ref={field.ref}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      label="Milestone Category"
                      placeholder="Select category"
                      options={availableCategories}
                      loading={loadingCategories}
                    />
                  )}
                />
                <ControlledInput
                  control={control}
                  name="eventDate"
                  rules={{
                    validate: (v) =>
                      !eventName.trim() || !!v || "Event date is required",
                  }}
                  id="client-event-date"
                  label="Event Date"
                  type="date"
                />
              </div>
            )}
          </div>
        )}
      </form>
      {prompt}
    </SidebarModal>
  );
}
