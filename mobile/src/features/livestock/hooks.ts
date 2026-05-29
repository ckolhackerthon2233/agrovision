import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/api";
import { Livestock, LivestockFormValues } from "./schema";

const listKey = ["livestock"] as const;
const itemKey = (id: string) => ["livestock", id] as const;

export function useLivestockList() {
  return useQuery({ queryKey: listKey, queryFn: () => apiFetch<Livestock[]>("/api/livestock") });
}

export function useLivestock(id: string) {
  return useQuery({
    queryKey: itemKey(id),
    queryFn: () => apiFetch<Livestock>(`/api/livestock/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateLivestock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: LivestockFormValues) =>
      apiFetch<Livestock>("/api/livestock", { method: "POST", body: JSON.stringify(values) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
  });
}

export function useUpdateLivestock(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<LivestockFormValues>) =>
      apiFetch<Livestock>(`/api/livestock/${id}`, { method: "PATCH", body: JSON.stringify(values) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey });
      qc.invalidateQueries({ queryKey: itemKey(id) });
    },
  });
}

export function useDeleteLivestock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/api/livestock/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
  });
}
