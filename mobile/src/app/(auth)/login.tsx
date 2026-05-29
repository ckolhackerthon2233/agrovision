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
import { useSignIn } from "@/src/lib/clerk";
import { Colors } from "@/src/constants/Colors";
import { OAuthButtons } from "@/src/lib/oauth";

interface LoginForm {
  email: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { signIn, setActive, isLoaded } = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    if (!isLoaded) return;
    setServerError("");
    setIsLoading(true);
    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Redirect handled by the (auth) layout guard once isSignedIn flips.
      } else {
        setServerError("Sign-in requires additional verification.");
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ?? "Invalid email or password. Please try again.";
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
        source={require("../assets/shovel.jpg")}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      <LinearGradient
        colors={["rgba(8,28,21,0.50)", "rgba(8,28,21,0.98)"]}
        locations={[0, 0.82]}
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
          <Text style={styles.welcomeText}>Sign in to your account</Text>
        </View>

        {/* Card */}
        <View style={styles.cardWrapper}>
          <BlurView intensity={32} tint="dark" style={styles.blurCard}>
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>Welcome Back</Text>
              <Text style={styles.cardSubtitle}>
                Good to see you again. Enter your details below.
              </Text>

              {serverError ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{serverError}</Text>
                </View>
              ) : null}

              {/* Email */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address</Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: EMAIL_REGEX,
                      message: "Enter a valid email address",
                    },
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

              {/* Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordRow}>
                  <Controller
                    control={control}
                    name="password"
                    rules={{ required: "Password is required" }}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <TextInput
                        style={[
                          styles.input,
                          styles.passwordInput,
                          errors.password && styles.inputError,
                        ]}
                        placeholder="••••••••"
                        placeholderTextColor={Colors.text.whiteAlpha50}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoComplete="password"
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
                  <Text style={styles.fieldError}>
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Forgot password */}
              <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Sign In button */}
              <TouchableOpacity
                style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                onPress={handleSubmit(onSubmit)}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.text.white} size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Social sign-in */}
              <OAuthButtons />

              {/* Switch to register */}
              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/register")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.switchLink}>Create one</Text>
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
    gap: 32,
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.glass.white,
    borderWidth: 2,
    borderColor: Colors.glass.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    color: Colors.text.white,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  welcomeText: {
    color: Colors.text.whiteAlpha70,
    fontSize: 14,
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
    marginBottom: 24,
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
  forgotRow: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: -6,
  },
  forgotText: {
    color: Colors.primary[500],
    fontSize: 13,
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: Colors.primary[700],
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary[600],
    marginBottom: 20,
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
