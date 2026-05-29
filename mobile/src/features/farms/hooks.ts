import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/api";
import { Farm, FarmFormValues } from "./schema";

const farmsKey = ["farms"] as const;
const farmKey = (id: string) => ["farms", id] as const;

export function useFarms() {
  return useQuery({
    queryKey: farmsKey,
    queryFn: () => apiFetch<Farm[]>("/api/farms"),
  });
}

export function useFarm(id: string) {
  return useQuery({
    queryKey: farmKey(id),
    queryFn: () => apiFetch<Farm>(`/api/farms/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateFarm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: FarmFormValues) =>
      apiFetch<Farm>("/api/farms", { method: "POST", body: JSON.stringify(values) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmsKey }),
  });
}

export function useUpdateFarm(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<FarmFormValues>) =>
      apiFetch<Farm>(`/api/farms/${id}`, { method: "PATCH", body: JSON.stringify(values) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: farmsKey });
      qc.invalidateQueries({ queryKey: farmKey(id) });
    },
  });
}

export function useDeleteFarm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/farms/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmsKey }),
  });
}
