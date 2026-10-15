"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type JSX,
} from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  Controller,
  type Control,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { FiChevronDown, FiMail, FiPlus, FiX } from "react-icons/fi";
import { clsx } from "clsx";
import { SidebarModal } from "@/src/components/UI/SidebarModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import { SwitchWrapper } from "@/src/components/FormElements/Switch";
import { PhoneInput } from "@/src/components/FormElements/PhoneInput";
import { TagInput } from "@/src/components/FormElements/TagInput";
import {
  Select,
  emptySelect,
  type ISelect,
} from "@/src/components/FormElements/Select";
import { CategoryDrawer } from "@/src/components/Forms/CategoryDrawer";
import { useCategoriesQuery } from "@/src/hooks/useCategoryQuery";
import { useAddClient, useUpdateClient } from "@/src/hooks/useClientQuery";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import { customToast } from "@/src/helpers/customToast";
import {
  todayInputValue,
  validateNotFutureDate,
} from "@/src/helpers/dateHelpers";
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
  isRecurring: boolean;
  notes: string;
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
      isRecurring: false,
      notes: "",
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
    isRecurring: false,
    notes: "",
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

function eventFields(values: ClientFormValues) {
  const name = values.eventName.trim();
  if (!name || !values.eventDate) return {};
  return {
    eventName: name,
    eventDate: values.eventDate,
    isRecurring: values.isRecurring,
    ...(values.notes.trim() && { notes: values.notes.trim() }),
    ...(values.category.value._id && {
      categoryId: values.category.value._id,
    }),
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
  const [hasTagDraft, setHasTagDraft] = useState(false);

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
    isDirty || hasTagDraft,
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
  const eventDate = useWatch({ control, name: "eventDate" });
  const eventCategory = useWatch({ control, name: "category" });
  // Name and date must be supplied together as soon as any event field is used.
  const hasEventInput =
    !!eventName.trim() || !!eventDate || !!eventCategory.value._id;
  const anyBirthDate = useWatch({ control, name: "persons" }).some(
    (p) => p.birthDate,
  );

  const { data: categoriesData, isLoading: loadingCategories } =
    useCategoriesQuery();
  // The backend creates the Birthday event itself when a birth date is given.
  const availableCategories = useMemo(() => {
    const categories = categoriesData?.data ?? [];
    return (
      anyBirthDate
        ? categories.filter((c) => c.name.toLowerCase() !== "birthday")
        : categories
    ).map((c): ISelect => ({ value: { _id: c.id }, label: c.name }));
  }, [categoriesData, anyBirthDate]);

  const [addingCategory, setAddingCategory] = useState(false);
  const pendingCategoryName = useRef<string | null>(null);

  // Select the newly created category once the refetched list contains it.
  useEffect(() => {
    const name = pendingCategoryName.current;
    if (!name) return;
    const created = availableCategories.find(
      (c) => c.label.toLowerCase() === name.toLowerCase(),
    );
    if (!created) return;
    setValue("category", created, { shouldDirty: true });
    pendingCategoryName.current = null;
  }, [availableCategories, setValue]);

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
          ...eventFields(values),
        },
      });
      return;
    }

    const isMultiple = values.persons.length > 1;
    const payload: ICreateClientPayload = {
      type: isMultiple ? "MULTIPLE" : "INDIVIDUAL",
      individual: isMultiple ? null : toItem(first),
      multiple: isMultiple ? values.persons.map(toItem) : null,
      ...(values.tags.length > 0 && { tags: values.tags }),
      ...eventFields(values),
    };
    addMutation.mutate(payload);
  };

  const mailIcon = (
    <FiMail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
  );

  return (
    <>
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
                <Controller
                  name={`persons.${index}.phone`}
                  control={control}
                  rules={{
                    validate: (v) =>
                      !!(v as string).trim() || "Phone is required",
                  }}
                  render={({ field, fieldState }) => (
                    <PhoneInput
                      id={`person-${index}-phone`}
                      label="Phone"
                      required
                      placeholder="801 234 5678"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <ControlledInput
                  control={control}
                  name={`persons.${index}.email`}
                  rules={{
                    validate: (v) =>
                      !!(v as string).trim() || "Email is required",
                    pattern: {
                      value: EMAIL_REGEX,
                      message: "Invalid email",
                    },
                  }}
                  id={`person-${index}-email`}
                  label="Email"
                  type="email"
                  required
                  placeholder="email@example.com"
                  className="pl-10"
                  icon={mailIcon}
                />
              </div>
              {!isEdit && (
                <ControlledInput
                  control={control}
                  name={`persons.${index}.birthDate`}
                  rules={{
                    validate: (v) =>
                      validateNotFutureDate(
                        v,
                        "Birth date cannot be in the future",
                      ),
                  }}
                  max={todayInputValue()}
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

          <TagInput
            value={tags}
            onChange={(next) => setValue("tags", next, { shouldDirty: true })}
            onDraftChange={setHasTagDraft}
          />

          {isEdit && (
            <>
              <ControlledInput
                control={control}
                name="birthDate"
                rules={{
                  validate: (v) =>
                    validateNotFutureDate(
                      v,
                      "Birth date cannot be in the future",
                    ),
                }}
                max={todayInputValue()}
                id="client-birth-date"
                label="Birth Date"
                type="date"
              />
            </>
          )}

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
                  rules={{
                    validate: (v) =>
                      !hasEventInput ||
                      !!(v as string).trim() ||
                      "Event name is required",
                  }}
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
                      addNewOption={() => setAddingCategory(true)}
                    />
                  )}
                />
                <ControlledInput
                  control={control}
                  name="eventDate"
                  rules={{
                    validate: (v) =>
                      !hasEventInput || !!v || "Event date is required",
                  }}
                  id="client-event-date"
                  label="Event Date"
                  type="date"
                />
                <Controller
                  name="isRecurring"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SwitchWrapper
                      label="Recurring (repeats every year)"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.error}
                    />
                  )}
                />
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <fieldset className="space-y-2">
                      <label
                        htmlFor="client-event-notes"
                        className="block text-sm font-semibold text-gray-600 dark:text-slate-400"
                      >
                        Notes (Optional)
                      </label>
                      <textarea
                        {...field}
                        id="client-event-notes"
                        rows={3}
                        placeholder="Anything worth remembering about this event..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700 outline-none transition-all placeholder-gray-400 focus:border-theme-primary focus:bg-white focus:ring-2 focus:ring-theme-primary/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-theme-primary dark:focus:bg-theme-surface dark:focus:ring-theme-primary/20"
                      />
                    </fieldset>
                  )}
                />
              </div>
            )}
          </div>
        </form>
        {prompt}
      </SidebarModal>
      {addingCategory && (
        <CategoryDrawer
          close={() => setAddingCategory(false)}
          onSaved={(name) => {
            pendingCategoryName.current = name;
          }}
        />
      )}
    </>
  );
}
