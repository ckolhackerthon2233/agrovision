import "../../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, useAuth } from "@/src/lib/clerk";
import { authBridge } from "@/src/lib/authBridge";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// Pushes the current user's id + token getter into the API bridge so apiFetch
// can authenticate every request (real Clerk token, or the Expo Go mock id).
function AuthSync() {
  const { userId, getToken } = useAuth();
  useEffect(() => {
    authBridge.setUserId(userId ?? null);
    authBridge.setTokenGetter(getToken ?? (async () => null));
  }, [userId, getToken]);
  return null;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <AuthSync />
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="sso-callback" />
          </Stack>
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
