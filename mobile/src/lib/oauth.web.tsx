import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { Colors } from "@/src/constants/Colors";

// Web-specific OAuth via Clerk's redirect-based flow.
// Metro automatically uses this file instead of oauth.tsx when building for web.
// No expo-auth-session / native crypto modules required.

type Provider = "google" | "facebook";

export function useSocialAuth() {
  const { signIn } = useSignIn();
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState("");

  const signInWith = async (provider: Provider) => {
    if (!signIn) return;
    setError("");
    setLoading(provider);
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider === "google" ? "oauth_google" : "oauth_facebook",
        // Clerk sends the user here after the provider redirects back
        redirectUrl: `${window.location.origin}/sso-callback`,
        // After Clerk completes the session, it navigates here
        redirectUrlComplete: `${window.location.origin}/`,
      });
      // Browser navigates away from this page — code below won't run
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ??
        `${provider === "google" ? "Google" : "Facebook"} sign-in failed. Please try again.`;
      setError(msg);
      setLoading(null);
    }
  };

  return { signInWith, loading, error };
}

interface OAuthButtonsProps {
  label?: string;
}

export function OAuthButtons({ label = "or continue with" }: OAuthButtonsProps) {
  const { signInWith, loading, error } = useSocialAuth();

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
