"use client";

import { JSX, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { clsx } from "clsx";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import { Select, ISelect } from "@/src/components/FormElements/Select";
import { RichTextEditor } from "@/src/components/FormElements/RichTextEditor";
import { SidebarModal } from "@/src/components/UI/SidebarModal";
import {
  useAddTemplate,
  useUpdateTemplate,
} from "@/src/hooks/useTemplateQuery";
import { useCategoriesQuery } from "@/src/hooks/useCategoryQuery";
import { ITemplate, ITemplatePayload } from "@/src/models/template";
import { customToast } from "@/src/helpers/customToast";

interface TemplateFormValues {
  title: string;
  type: ISelect;
  categoryId: string;
  message: string;
}

interface TemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingTemplate: ITemplate | null;
}

export function TemplateForm({
  isOpen,
  onClose,
  editingTemplate,
}: TemplateFormProps): JSX.Element {
  const { data: catData } = useCategoriesQuery();
  const categories = catData?.data?.categories ?? [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TemplateFormValues>({
    defaultValues: {
      title: "",
      type: { value: { _id: "EMAIL" }, label: "EMAIL" },
      categoryId: "",
      message: "",
    },
  });

  // Keep form values in sync with editingTemplate state
  useEffect(() => {
    if (editingTemplate) {
      reset({
        title: editingTemplate.title,
        type: {
          value: { _id: editingTemplate.type.toUpperCase() },
          label: editingTemplate.type.toUpperCase(),
        },
        categoryId: editingTemplate.categoryId,
        message: editingTemplate.message,
      });
    } else {
      reset({
        title: "",
        type: { value: { _id: "EMAIL" }, label: "EMAIL" },
        categoryId: "",
        message: "",
      });
    }
  }, [editingTemplate, reset, isOpen]);

  const addMutation = useAddTemplate({
    onSuccess: () => {
      customToast.success("Template created successfully");
      onClose();
      reset();
    },
  });

  const updateMutation = useUpdateTemplate({
    onSuccess: () => {
      customToast.success("Template updated successfully");
      onClose();
      reset();
    },
  });

  const onSubmit = async (formData: TemplateFormValues) => {
    const payload: ITemplatePayload = {
      title: formData.title,
      type: formData.type.value._id,
      categoryId: formData.categoryId,
      message: formData.message,
    };

    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <SidebarModal
      display={isOpen}
      close={onClose}
      title={editingTemplate ? "Edit Template" : "New Template"}
      footer={
        <div className="w-full flex justify-end gap-3">
          <BaseButton
            type="button"
            color="outline"
            text="Cancel"
            onClick={onClose}
          />
          <BaseButton
            type="button"
            color="primary"
            text={editingTemplate ? "Save Changes" : "Create Template"}
            loading={isSubmitting || isPending}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="title"
          control={control}
          rules={{ required: "Template name is required" }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="template-title"
              label="Template Name"
              placeholder="e.g. Birthday Greetings"
              error={fieldState.error?.message}
              required
              autoFocus
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          rules={{ required: "Template type is required" }}
          render={({ field, fieldState }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              label="Type"
              options={[
                { value: { _id: "EMAIL" }, label: "EMAIL" },
                { value: { _id: "SMS" }, label: "SMS" },
                { value: { _id: "WHATSAPP" }, label: "WHATSAPP" },
              ]}
              required
              validationError={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="categoryId"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-600 dark:text-slate-300">
                Category <span className="text-red-600">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSelected = field.value === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => field.onChange(cat.id)}
                      className={clsx(
                        "px-4 py-2 border rounded-full text-xs font-semibold transition-all duration-200",
                        isSelected
                          ? "bg-theme-primary text-white border-theme-primary shadow-sm hover:bg-theme-primary/90"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700",
                      )}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
              {fieldState.error && (
                <span className="text-xs text-red-500 font-medium block">
                  {fieldState.error.message}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          name="message"
          control={control}
          rules={{ required: "Message content is required" }}
          render={({ field, fieldState }) => (
            <RichTextEditor
              {...field}
              label="Message Body"
              placeholder="Compose your template message..."
              error={fieldState.error?.message}
              required
            />
          )}
        />
      </form>
    </SidebarModal>
  );
}
