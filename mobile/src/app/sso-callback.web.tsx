import { useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Colors } from "@/src/constants/Colors";

// Handles the OAuth redirect that Google/Facebook sends back to /sso-callback.
// Clerk's handleRedirectCallback reads the URL params, completes the session,
// then navigates to the redirectUrlComplete set in authenticateWithRedirect.
// This file is web-only (Metro resolves .web.tsx before .tsx).

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    handleRedirectCallback({}).catch(() => {
      // Callback failed (cancelled, error, etc.) — send back to auth
      router.replace("/(auth)");
    });
  }, []);

  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color={Colors.primary[500]} />
      <Text style={styles.label}>Completing sign in…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary[950],
    gap: 16,
  },
  label: {
    color: Colors.text.whiteAlpha70,
    fontSize: 14,
    fontWeight: "500",
  },
});
