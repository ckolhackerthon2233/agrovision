import { ImageSourcePropType } from "react-native";

export interface OnboardingSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: ImageSourcePropType;
  accentColor: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "1",
    badge: "🌱  Smart Agriculture",
    title: "Welcome to\nAgroVision",
    subtitle: "The Future of African Farming",
    description:
      "Manage your entire farm operation with AI-powered intelligence. From soil health to market sales — all in one platform.",
    image: require("../../../app/assets/tractor.jpg"),
    accentColor: "#74C69D",
  },
  {
    id: "2",
    badge: "🤖  AI Crop Intelligence",
    title: "Detect, Protect\n& Optimize",
    subtitle: "AI-Powered Disease Detection",
    description:
      "Identify crop diseases in seconds using your phone camera. Monitor soil, weather, and get expert AI recommendations.",
    image: require("../../../app/assets/services/crop_disease.jpg"),
    accentColor: "#95D5B2",
  },
  {
    id: "3",
    badge: "📈  Grow Your Business",
    title: "Scale Your\nAgribusiness",
    subtitle: "Connect, Trade & Prosper",
    description:
      "Access national markets, join cooperatives, manage warehouses, and unlock agricultural financing for your farm.",
    image: require("../../../app/assets/fruit.jpg"),
    accentColor: "#52B788",
  },
];
