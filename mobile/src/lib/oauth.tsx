import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { Colors } from "@/src/constants/Colors";

WebBrowser.maybeCompleteAuthSession();

// useOAuth pulls in ExpoCryptoAES (a native module present only in dev builds,
// not Expo Go). We must never evaluate @clerk/clerk-expo in Expo Go, so we
// branch on appOwnership and defer the require into the hook body (dev only).
// A try/catch around the require is NOT enough — once any module fails to load
// the clerk barrel, Metro caches the failure and re-throws past the catch.
const isExpoGo = Constants.appOwnership === "expo";

// ── useSocialAuth ─────────────────────────────────────────────────────────

function useRealSocialAuth() {
  // Deferred require — only runs in a dev build where the native module exists.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useOAuth } = require("@clerk/clerk-expo");
  const { startOAuthFlow: startGoogle } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startFacebook } = useOAuth({ strategy: "oauth_facebook" });
  const router = useRouter();
  const [loading, setLoading] = useState<"google" | "facebook" | null>(null);
  const [error, setError] = useState("");

  const signInWith = useCallback(
    async (provider: "google" | "facebook") => {
      setError("");
      setLoading(provider);
      try {
        const startFlow = provider === "google" ? startGoogle : startFacebook;
        const { createdSessionId, setActive } = await startFlow({
          redirectUrl: Linking.createURL("/"),
        });
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          router.replace("/(tabs)");
        }
      } catch (err: any) {
        const msg =
          err?.errors?.[0]?.longMessage ??
          `${provider === "google" ? "Google" : "Facebook"} sign-in failed. Please try again.`;
        setError(msg);
      } finally {
        setLoading(null);
      }
    },
    [startGoogle, startFacebook, router]
  );

  return { signInWith, loading, error };
}

function useStubSocialAuth() {
  return {
    signInWith: async (_provider: "google" | "facebook") => {},
    loading: null as null,
    error: "",
  };
}

export const useSocialAuth = isExpoGo ? useStubSocialAuth : useRealSocialAuth;

// ── OAuthButtons ──────────────────────────────────────────────────────────
// Returns null in Expo Go (native module unavailable).
// Renders Google + Facebook buttons in a dev build.

interface OAuthButtonsProps {
  label?: string;
}

export function OAuthButtons({ label = "or continue with" }: OAuthButtonsProps) {
  const { signInWith, loading, error } = useSocialAuth();

  if (isExpoGo) return null;

  return (
    <View style={styles.container}>
      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{label}</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* OAuth error */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Social buttons */}
      <View style={styles.row}>
        {/* Google */}
        <TouchableOpacity
          style={styles.oauthBtn}
          onPress={() => signInWith("google")}
          activeOpacity={0.75}
          disabled={!!loading}
        >
          {loading === "google" ? (
            <ActivityIndicator color={Colors.text.white} size="small" />
          ) : (
            <>
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.btnLabel}>Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Facebook */}
        <TouchableOpacity
          style={[styles.oauthBtn, styles.facebookBtn]}
          onPress={() => signInWith("facebook")}
          activeOpacity={0.75}
          disabled={!!loading}
        >
          {loading === "facebook" ? (
            <ActivityIndicator color={Colors.text.white} size="small" />
          ) : (
            <>
              <Text style={styles.facebookF}>f</Text>
              <Text style={styles.btnLabel}>Facebook</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  dividerText: {
    color: Colors.text.whiteAlpha50,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  errorBox: {
    backgroundColor: "rgba(220,53,69,0.15)",
    borderWidth: 1,
    borderColor: "rgba(220,53,69,0.40)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorText: {
    color: "#FF7B8A",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  oauthBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  facebookBtn: {
    backgroundColor: "rgba(24,119,242,0.12)",
    borderColor: "rgba(24,119,242,0.30)",
  },
  googleG: {
    fontSize: 15,
    fontWeight: "900",
    color: "#4285F4",
  },
  facebookF: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1877F2",
  },
  btnLabel: {
    color: Colors.text.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
