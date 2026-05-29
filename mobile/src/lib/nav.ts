import type { Href } from "expo-router";

// expo-router generates a strict Href union from the route tree (typedRoutes).
// Newly-added routes only appear in that union after the dev server regenerates
// types, so we cast here to keep navigation ergonomic. The path string is
// resolved correctly at runtime regardless of the generated types.
export const href = (path: string) => path as unknown as Href;
