import { Redirect } from "expo-router";
import { useAuth } from "@/src/lib/clerk";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(onboarding)" />;
}
