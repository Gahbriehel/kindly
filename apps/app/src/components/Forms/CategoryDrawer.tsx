"use client";

import type { JSX } from "react";
import { useForm, Controller } from "react-hook-form";
import { SidebarModal } from "@/src/components/UI/SidebarModal";
import { BaseButton, DeleteButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import {
  useAddCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/src/hooks/useCategoryQuery";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import type { ICategory } from "@/src/models/categories";

interface CategoryFormValues {
  name: string;
}

interface Props {
  /** Category being edited; omit to create a new one. */
  category?: ICategory | null;
  close: () => void;
  /** Called with the trimmed name after a successful create or update. */
  onSaved?: (name: string) => void;
}

/** Add/edit category drawer, shared by the categories tab and other forms. */
export function CategoryDrawer({
  category = null,
  close,
  onSaved,
}: Props): JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<CategoryFormValues>({
    defaultValues: { name: category?.name ?? "" },
  });

  const { requestClose, prompt } = useUnsavedChangesGuard(isDirty, close);

  const addMutation = useAddCategory({});
  const updateMutation = useUpdateCategory({});
  const deleteMutation = useDeleteCategory({ onSuccess: close });

  const onSubmit = ({ name }: CategoryFormValues) => {
    const trimmed = name.trim();
    const options = {
      onSuccess: () => {
        onSaved?.(trimmed);
        close();
      },
    };
    if (category) {
      updateMutation.mutate(
        { id: category.id, payload: { name: trimmed } },
        options,
      );
    } else {
      addMutation.mutate({ name: trimmed }, options);
    }
  };

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  return (
    <>
      <SidebarModal
        display
        close={requestClose}
        title={category ? "Edit Category" : "Add Category"}
        footer={
          <fieldset className="w-full grid grid-cols-2 gap-6 py-4 px-0">
            {category ? (
              <>
                <DeleteButton
                  text="Delete"
                  title="Delete Category"
                  loading={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(category.id)}
                />
                <BaseButton
                  onClick={handleSubmit(onSubmit)}
                  color="primary"
                  text="Save Changes"
                  loading={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-sm"
                />
              </>
            ) : (
              <>
                <BaseButton
                  onClick={requestClose}
                  color="outline"
                  text="Cancel"
                  className="px-5 py-2.5 rounded-xl text-sm"
                />
                <BaseButton
                  onClick={handleSubmit(onSubmit)}
                  color="primary"
                  text="Create Category"
                  loading={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-sm"
                />
              </>
            )}
          </fieldset>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="name"
            control={control}
            rules={{
              validate: (v) => !!v.trim() || "Category name is required",
            }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                id="drawer-category-name"
                label="Category Name"
                placeholder="e.g. Activity Checkups"
                error={fieldState.error?.message}
                required
                autoFocus
              />
            )}
          />

          {category && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800/50 text-xs text-gray-500 dark:text-slate-400 space-y-1">
              <p>
                <strong>Templates Linked:</strong> {category.templateCount}
              </p>
              <p>
                <strong>Events Count:</strong> {category.eventCount}
              </p>
            </div>
          )}
        </form>
      </SidebarModal>
      {prompt}
    </>
  );
}
