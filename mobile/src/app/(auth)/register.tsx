import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { useSignUp } from "@/src/lib/clerk";
import { Colors } from "@/src/constants/Colors";
import { OAuthButtons } from "@/src/lib/oauth";

type Role = "farmer" | "buyer" | "agent";

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLES: { key: Role; label: string; icon: string; desc: string }[] = [
  { key: "farmer", label: "Farmer", icon: "🌾", desc: "Grow & manage crops" },
  { key: "buyer", label: "Buyer", icon: "🛒", desc: "Source farm produce" },
  { key: "agent", label: "Agent", icon: "🤝", desc: "Connect & facilitate" },
];

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedRole, setSelectedRole] = useState<Role>("farmer");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { signUp, setActive, isLoaded } = useSignUp();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  const onSubmit = async (data: RegisterForm) => {
    if (!isLoaded) return;
    setServerError("");
    setIsLoading(true);
    try {
      const parts = data.name.trim().split(" ");
      const result = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: parts[0],
        lastName: parts.slice(1).join(" ") || undefined,
        // Store role + phone in Clerk public metadata
        unsafeMetadata: {
          role: selectedRole,
          phone: data.phone || undefined,
        },
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Redirect handled by the (auth) layout guard once isSignedIn flips.
      } else {
        // Clerk may require email verification — configure in Clerk Dashboard
        setServerError(
          "Please check your email to verify your account before signing in."
        );
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ?? "Registration failed. Please try again.";
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../assets/seeds.jpg")}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      <LinearGradient
        colors={["rgba(8,28,21,0.45)", "rgba(8,28,21,0.98)"]}
        locations={[0, 0.8]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.75}
        >
          <BlurView intensity={22} tint="dark" style={styles.backBlur}>
            <Text style={styles.backIcon}>←</Text>
          </BlurView>
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <Text style={styles.appName}>AgroVision</Text>
          <Text style={styles.welcomeText}>Join Africa's farming platform</Text>
        </View>

        {/* Card */}
        <View style={styles.cardWrapper}>
          <BlurView intensity={32} tint="dark" style={styles.blurCard}>
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>Create Account</Text>
              <Text style={styles.cardSubtitle}>
                Let's set up your farm profile. This takes under a minute.
              </Text>

              {serverError ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{serverError}</Text>
                </View>
              ) : null}

              {/* Social sign-up — shown first for quick onboarding */}
              <OAuthButtons label="sign up with" />

              {/* Divider before email form */}
              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>or fill in details</Text>
                <View style={styles.orLine} />
              </View>

              {/* Role selector */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>I am a</Text>
                <View style={styles.roleRow}>
                  {ROLES.map((role) => {
                    const active = selectedRole === role.key;
                    return (
                      <TouchableOpacity
                        key={role.key}
                        style={[styles.rolePill, active && styles.rolePillActive]}
                        onPress={() => setSelectedRole(role.key)}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.roleIcon}>{role.icon}</Text>
                        <Text
                          style={[
                            styles.roleLabel,
                            active && styles.roleLabelActive,
                          ]}
                        >
                          {role.label}
                        </Text>
                        {active && (
                          <Text style={styles.roleDesc}>{role.desc}</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Full name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full Name</Text>
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: "Full name is required",
                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      style={[styles.input, errors.name && styles.inputError]}
                      placeholder="John Kamau"
                      placeholderTextColor={Colors.text.whiteAlpha50}
                      autoCapitalize="words"
                      autoComplete="name"
                      returnKeyType="next"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.name && (
                  <Text style={styles.fieldError}>{errors.name.message}</Text>
                )}
              </View>

              {/* Email */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address</Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: { value: EMAIL_REGEX, message: "Enter a valid email address" },
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      placeholder="farmer@example.com"
                      placeholderTextColor={Colors.text.whiteAlpha50}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      returnKeyType="next"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.email && (
                  <Text style={styles.fieldError}>{errors.email.message}</Text>
                )}
              </View>

              {/* Phone */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Phone Number{" "}
                  <Text style={styles.optionalTag}>(optional)</Text>
                </Text>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="+254 700 000 000"
                      placeholderTextColor={Colors.text.whiteAlpha50}
                      keyboardType="phone-pad"
                      autoComplete="tel"
                      returnKeyType="next"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>

              {/* Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordRow}>
                  <Controller
                    control={control}
                    name="password"
                    rules={{
                      required: "Password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" },
                    }}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <TextInput
                        style={[
                          styles.input,
                          styles.passwordInput,
                          errors.password && styles.inputError,
                        ]}
                        placeholder="Min. 8 characters"
                        placeholderTextColor={Colors.text.whiteAlpha50}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(onSubmit)}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    style={styles.eyeBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eyeIcon}>
                      {showPassword ? "🙈" : "👁️"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.fieldError}>{errors.password.message}</Text>
                )}
              </View>

              {/* Submit */}
              <TouchableOpacity
                style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                onPress={handleSubmit(onSubmit)}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.text.white} size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Create Account</Text>
                )}
              </TouchableOpacity>

              {/* Terms */}
              <Text style={styles.termsText}>
                By creating an account you agree to our{" "}
                <Text style={styles.termsLink}>Terms</Text> &{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>

              {/* Switch to login */}
              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/login")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.switchLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary[950],
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 28,
  },
  backBtn: {
    alignSelf: "flex-start",
    borderRadius: 50,
    overflow: "hidden",
  },
  backBlur: {
    width: 44,
    height: 44,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  backIcon: {
    color: Colors.text.white,
    fontSize: 20,
    fontWeight: "600",
  },
  logoArea: {
    alignItems: "center",
    gap: 8,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.glass.white,
    borderWidth: 2,
    borderColor: Colors.glass.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoEmoji: {
    fontSize: 30,
  },
  appName: {
    color: Colors.text.white,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  welcomeText: {
    color: Colors.text.whiteAlpha70,
    fontSize: 13,
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
    backgroundColor: "rgba(27,67,50,0.26)",
  },
  cardTitle: {
    color: Colors.text.white,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  cardSubtitle: {
    color: Colors.text.whiteAlpha70,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  errorBanner: {
    backgroundColor: "rgba(220,53,69,0.18)",
    borderWidth: 1,
    borderColor: "rgba(220,53,69,0.45)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  errorBannerText: {
    color: "#FF7B8A",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  orText: {
    color: Colors.text.whiteAlpha50,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    color: Colors.text.whiteAlpha70,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  optionalTag: {
    color: Colors.text.whiteAlpha50,
    fontWeight: "400",
  },
  roleRow: {
    flexDirection: "row",
    gap: 10,
  },
  rolePill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    gap: 4,
  },
  rolePillActive: {
    backgroundColor: "rgba(64,145,108,0.35)",
    borderColor: Colors.primary[600],
  },
  roleIcon: {
    fontSize: 20,
  },
  roleLabel: {
    color: Colors.text.whiteAlpha70,
    fontSize: 12,
    fontWeight: "600",
  },
  roleLabelActive: {
    color: Colors.text.white,
  },
  roleDesc: {
    color: Colors.primary[400],
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: Colors.text.white,
    fontSize: 15,
    fontWeight: "400",
  },
  inputError: {
    borderColor: "rgba(220,53,69,0.60)",
  },
  passwordRow: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 52,
  },
  eyeBtn: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeIcon: {
    fontSize: 18,
  },
  fieldError: {
    color: "#FF7B8A",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  submitBtn: {
    backgroundColor: Colors.primary[700],
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary[600],
    marginBottom: 16,
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitBtnText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  termsText: {
    color: Colors.text.whiteAlpha50,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  termsLink: {
    color: Colors.primary[500],
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    color: Colors.text.whiteAlpha70,
    fontSize: 14,
  },
  switchLink: {
    color: Colors.primary[500],
    fontSize: 14,
    fontWeight: "700",
  },
});
