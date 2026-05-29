import { create } from "zustand";
import { FarmType } from "./schema";

type TypeFilter = FarmType | "ALL";

type FarmFilterState = {
  search: string;
  typeFilter: TypeFilter;
  setSearch: (search: string) => void;
  setTypeFilter: (typeFilter: TypeFilter) => void;
  reset: () => void;
};

// Client-only UI state for the farm list (search + type filter). Server data
// lives in React Query; this is intentionally separate.
export const useFarmFilters = create<FarmFilterState>((set) => ({
  search: "",
  typeFilter: "ALL",
  setSearch: (search) => set({ search }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  reset: () => set({ search: "", typeFilter: "ALL" }),
}));
