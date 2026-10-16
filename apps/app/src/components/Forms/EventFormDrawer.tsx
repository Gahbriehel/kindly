"use client";

import { useMemo, useState, type JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import { SidebarModal } from "@/src/components/UI/SidebarModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import {
  Select,
  emptySelect,
  type ISelect,
} from "@/src/components/FormElements/Select";
import { MultiSelect } from "@/src/components/FormElements/MultiSelect";
import { SwitchWrapper } from "@/src/components/FormElements/Switch";
import { CategoryDrawer } from "@/src/components/Forms/CategoryDrawer";
import { useCategoriesQuery } from "@/src/hooks/useCategoryQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getClients } from "@/src/services/clients";
import { useAddEvent } from "@/src/hooks/useEventQuery";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import { customToast } from "@/src/helpers/customToast";
import type { IQueryParams } from "@/src/models/base";

interface EventFormValues {
  title: string;
  date: string;
  category: ISelect;
  isRecurring: boolean;
  notes: string;
}

interface Props {
  /** Pre-filled `YYYY-MM-DD` date, e.g. the day selected on the calendar. */
  defaultDate?: string;
  close: () => void;
}

/** The select drives its search through `name`; the clients API wants `search`. */
function useClientOptions(params: IQueryParams) {
  const query = { page: params.page, limit: params.limit, search: params.name };
  // Keep the previous page on screen while the next one loads, so the
  // Prev/Next bar doesn't vanish between pages.
  return useQuery({
    queryKey: ["clients", query],
    queryFn: () => getClients(query),
    placeholderData: keepPreviousData,
  });
}

const toClientOption = (c: { id: string; fullName: string }): ISelect => ({
  value: { _id: c.id },
  label: c.fullName,
});

/** Add-event drawer. Past dates are allowed. */
export function EventFormDrawer({ defaultDate, close }: Props): JSX.Element {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<EventFormValues>({
    defaultValues: {
      title: "",
      date: defaultDate ?? "",
      category: emptySelect(),
      isRecurring: false,
      notes: "",
    },
  });
  const [participants, setParticipants] = useState<ISelect[]>([]);
  const [addingCategory, setAddingCategory] = useState(false);

  const { requestClose, prompt } = useUnsavedChangesGuard(
    isDirty || participants.length > 0,
    close,
  );

  const { data: categoriesData, isLoading: loadingCategories } =
    useCategoriesQuery();
  const categoryOptions = useMemo(
    () =>
      (categoriesData?.data ?? []).map(
        (c): ISelect => ({ value: { _id: c.id }, label: c.name }),
      ),
    [categoriesData],
  );

  const addEvent = useAddEvent({
    onSuccess: () => {
      customToast.success("Event added");
      close();
    },
  });

  const onSubmit = (values: EventFormValues) => {
    addEvent.mutate({
      title: values.title.trim(),
      date: values.date,
      isRecurring: values.isRecurring,
      categoryId: values.category.value._id || undefined,
      notes: values.notes.trim() || undefined,
      participantClientIds: participants.length
        ? participants.map((p) => p.value._id)
        : undefined,
    });
  };

  return (
    <>
      <SidebarModal
        display
        close={requestClose}
        title="Add Event"
        footer={
          <fieldset className="grid w-full grid-cols-2 gap-6 px-0 py-4">
            <BaseButton
              onClick={requestClose}
              color="outline"
              text="Cancel"
              className="rounded-xl px-5 py-2.5 text-sm"
            />
            <BaseButton
              onClick={handleSubmit(onSubmit)}
              color="primary"
              text="Add Event"
              loading={addEvent.isPending}
              className="rounded-xl px-5 py-2.5 text-sm"
            />
          </fieldset>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="title"
            control={control}
            rules={{
              validate: (v) => !!v.trim() || "Event title is required",
              maxLength: { value: 150, message: "Maximum of 150 characters" },
            }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                id="event-title"
                label="Title"
                placeholder="e.g. Ada's Birthday"
                error={fieldState.error?.message}
                required
                autoFocus
              />
            )}
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
                label="Category"
                placeholder="Select category"
                options={categoryOptions}
                loading={loadingCategories}
                addNewOption={() => setAddingCategory(true)}
              />
            )}
          />

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="event-date"
                    label="Date"
                    type="date"
                    error={fieldState.error?.message}
                    required
                  />
                )}
              />
            </div>
            <div className="shrink-0">
              <Controller
                name="isRecurring"
                control={control}
                render={({ field, fieldState }) => (
                  <SwitchWrapper
                    label="Recurring"
                    className="[&_button]:translate-y-3"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error}
                  />
                )}
              />
            </div>
          </div>

          <MultiSelect
            value={participants}
            onChange={setParticipants}
            label="Clients (Optional)"
            placeholder="Search clients to add"
            queryHook={useClientOptions}
            dataKey="data"
            defaultLimit={10}
            transformData={toClientOption}
          />

          <Controller
            name="notes"
            control={control}
            rules={{
              maxLength: { value: 500, message: "Maximum of 500 characters" },
            }}
            render={({ field }) => (
              <fieldset className="space-y-2">
                <label
                  htmlFor="event-notes"
                  className="block text-sm font-semibold text-gray-600 dark:text-slate-400"
                >
                  Notes (Optional)
                </label>
                <textarea
                  {...field}
                  id="event-notes"
                  rows={3}
                  maxLength={500}
                  placeholder="Anything worth remembering about this event..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700 outline-none transition-all placeholder-gray-400 focus:border-theme-primary focus:bg-white focus:ring-2 focus:ring-theme-primary/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-theme-primary dark:focus:bg-theme-surface dark:focus:ring-theme-primary/20"
                />
              </fieldset>
            )}
          />
        </form>
        {prompt}
      </SidebarModal>
      {addingCategory && (
        <CategoryDrawer
          close={() => setAddingCategory(false)}
          onSaved={(name) => {
            // Pick the new category once the refreshed list contains it.
            const created = categoryOptions.find((o) => o.label === name);
            if (created) setValue("category", created, { shouldDirty: true });
          }}
        />
      )}
    </>
  );
}
