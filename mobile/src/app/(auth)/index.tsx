import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/src/constants/Colors";
import { OAuthButtons } from "@/src/lib/oauth";

export default function AuthLanding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Image
        source={require("../assets/rake.jpg")}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        cachePolicy="memory-disk"
      />

      <LinearGradient
        colors={["rgba(8,28,21,0.35)", "rgba(8,28,21,0.97)"]}
        locations={[0.05, 0.88]}
        style={StyleSheet.absoluteFillObject}
      />

      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 52, paddingBottom: insets.bottom + 36 },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <Text style={styles.appName}>AgroVision</Text>
          <Text style={styles.tagline}>Your Agricultural Operating System</Text>
        </View>

        {/* Glass card */}
        <View style={styles.cardWrapper}>
          <BlurView intensity={28} tint="dark" style={styles.blurCard}>
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>Get Started</Text>
              <Text style={styles.cardSubtitle}>
                Sign in or create a free account to manage your entire farm
                operation.
              </Text>

              <TouchableOpacity
                style={styles.primaryBtn}
                activeOpacity={0.85}
                onPress={() => router.push("/(auth)/register")}
              >
                <Text style={styles.primaryBtnText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                activeOpacity={0.75}
                onPress={() => router.push("/(auth)/login")}
              >
                <View style={styles.secondaryBtnInner}>
                  <Text style={styles.secondaryBtnText}>Sign In</Text>
                </View>
              </TouchableOpacity>

              {/* Social sign-in */}
              <OAuthButtons label="or sign in with" />

              <Text style={styles.termsText}>
                By continuing you agree to our{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> &{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary[950],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  logoArea: {
    alignItems: "center",
    gap: 10,
  },
  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: Colors.glass.white,
    borderWidth: 2,
    borderColor: Colors.glass.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    color: Colors.text.white,
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  tagline: {
    color: Colors.text.whiteAlpha70,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  cardWrapper: {
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  blurCard: {
    borderRadius: 32,
    overflow: "hidden",
  },
  cardInner: {
    padding: 28,
    backgroundColor: "rgba(27,67,50,0.28)",
    gap: 12,
  },
  cardTitle: {
    color: Colors.text.white,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    color: Colors.text.whiteAlpha70,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
  primaryBtn: {
    backgroundColor: Colors.primary[700],
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary[600],
  },
  primaryBtnText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    borderRadius: 50,
    overflow: "hidden",
  },
  secondaryBtnInner: {
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: Colors.glass.white,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  secondaryBtnText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    color: Colors.text.whiteAlpha50,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 4,
  },
  termsLink: {
    color: Colors.primary[500],
    fontWeight: "600",
  },
});
