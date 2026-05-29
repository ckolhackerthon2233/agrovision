import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/api";
import { Crop, CropFormValues } from "./schema";

const cropsKey = ["crops"] as const;
const cropKey = (id: string) => ["crops", id] as const;

export function useCrops() {
  return useQuery({ queryKey: cropsKey, queryFn: () => apiFetch<Crop[]>("/api/crops") });
}

export function useCrop(id: string) {
  return useQuery({
    queryKey: cropKey(id),
    queryFn: () => apiFetch<Crop>(`/api/crops/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateCrop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: CropFormValues) =>
      apiFetch<Crop>("/api/crops", { method: "POST", body: JSON.stringify(values) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cropsKey }),
  });
}

export function useUpdateCrop(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<CropFormValues>) =>
      apiFetch<Crop>(`/api/crops/${id}`, { method: "PATCH", body: JSON.stringify(values) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cropsKey });
      qc.invalidateQueries({ queryKey: cropKey(id) });
    },
  });
}

export function useDeleteCrop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/api/crops/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cropsKey }),
  });
}
