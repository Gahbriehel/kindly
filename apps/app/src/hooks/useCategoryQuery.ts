import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categories";
import { ICategoryPayload, ICategoryResponse } from "../models/categories";

const CATEGORIES_KEY = ["categories"];

interface Props {
  onSuccess?: () => void;
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: async () => await getCategories(),
  });
}

export function useAddCategory({
  onSuccess,
}: Props): UseMutationResult<ICategoryResponse, Error, ICategoryPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICategoryPayload) => addCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      onSuccess?.();
    },
  });
}

export function useUpdateCategory({ onSuccess }: Props) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ICategoryPayload }) =>
      updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      onSuccess?.();
    },
  });
}

export function useDeleteCategory({ onSuccess }: Props) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      onSuccess?.();
    },
  });
}
