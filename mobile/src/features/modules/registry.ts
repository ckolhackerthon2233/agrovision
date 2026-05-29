import { images, type AppImage } from "@/src/constants/images";

// Single source of truth for the AgriOS module catalogue. The dashboard renders
// this as a grid; the dynamic /(tabs)/modules/[key] page renders any entry that
// doesn't already have its own dedicated screen (via `href`).
//
// status: "live" → fully wired feature with its own screens.
//         "soon" → viewable overview page, backend/feature lands per-module
//                  (we build feature-by-feature, per docs/prompt2.md).

export type ModuleStatus = "live" | "soon";

export type ModuleFeature = { icon: string; title: string; desc: string };
export type ModuleStat = { icon: string; value: string; label: string };

export type ModuleDef = {
  key: string;
  title: string;
  tagline: string;
  icon: string;
  /** Hex accent used for the icon tile + hero gradient (dynamic, so inline). */
  accent: string;
  image?: AppImage;
  status: ModuleStatus;
  /** If set, the card navigates to this existing route instead of the [key] page. */
  href?: string;
  features: ModuleFeature[];
  stats?: ModuleStat[];
};

export const MODULES: ModuleDef[] = [
  {
    key: "farms",
    title: "Farm Management",
    tagline: "Your farms, fields and operations in one place.",
    icon: "🏡",
    accent: "#2D6A4F",
    image: images.tractor,
    status: "live",
    href: "/(tabs)/farms",
    features: [
      { icon: "🗺️", title: "Farm profiles", desc: "Location, size and type per farm." },
      { icon: "📐", title: "Land tracking", desc: "Hectares and usage at a glance." },
      { icon: "✏️", title: "Full CRUD", desc: "Create, edit and remove farms." },
    ],
  },
  {
    key: "crops",
    title: "Crop Management",
    tagline: "Plan planting, track growth and harvests.",
    icon: "🌾",
    accent: "#40916C",
    image: images.seeds,
    status: "live",
    href: "/(tabs)/crops",
    features: [
      { icon: "🌱", title: "Planting plans", desc: "Seasons, cycles and rotations." },
      { icon: "📈", title: "Growth stages", desc: "Track each crop to harvest." },
      { icon: "🗓️", title: "Harvest calendar", desc: "Never miss a window." },
    ],
  },
  {
    key: "livestock",
    title: "Livestock Management",
    tagline: "Herds, health records and production.",
    icon: "🐄",
    accent: "#52B788",
    image: images.fruit,
    status: "live",
    href: "/(tabs)/livestock",
    features: [
      { icon: "🐄", title: "Herd registry", desc: "Animals, breeds and tags." },
      { icon: "💉", title: "Health & vaccines", desc: "Records and reminders." },
      { icon: "🥛", title: "Production logs", desc: "Milk, eggs and yield." },
    ],
    stats: [
      { icon: "🐄", value: "—", label: "Animals" },
      { icon: "💉", value: "—", label: "Due checks" },
    ],
  },
  {
    key: "market",
    title: "Marketplace",
    tagline: "Buy and sell produce, inputs and equipment.",
    icon: "🛒",
    accent: "#40916C",
    image: images.fruit,
    status: "soon",
    href: "/(tabs)/market",
    features: [
      { icon: "🏷️", title: "List produce", desc: "Sell directly to buyers." },
      { icon: "🔎", title: "Discover", desc: "Browse listings near you." },
      { icon: "💬", title: "Negotiate", desc: "Chat and agree on price." },
    ],
  },
  {
    key: "analytics",
    title: "Farm Analytics",
    tagline: "Yields, costs and trends, visualised.",
    icon: "📊",
    accent: "#2D6A4F",
    status: "soon",
    href: "/(tabs)/analytics",
    features: [
      { icon: "📈", title: "Yield trends", desc: "Season-over-season charts." },
      { icon: "💰", title: "Cost tracking", desc: "Inputs vs revenue." },
      { icon: "🎯", title: "Forecasts", desc: "Plan with projections." },
    ],
  },
  {
    key: "ai-detection",
    title: "AI Disease Detection",
    tagline: "Scan a leaf, get an instant diagnosis.",
    icon: "🤖",
    accent: "#1B4332",
    image: images.tomato,
    status: "soon",
    features: [
      { icon: "📷", title: "Photo scan", desc: "Detect disease from an image." },
      { icon: "🧪", title: "Diagnosis", desc: "Likely cause and confidence." },
      { icon: "💊", title: "Treatment", desc: "Recommended next steps." },
    ],
    stats: [
      { icon: "🔬", value: "—", label: "Scans" },
      { icon: "✅", value: "—", label: "Healthy" },
    ],
  },
  {
    key: "iot",
    title: "IoT Smart Farming",
    tagline: "Live sensor data from the field.",
    icon: "📡",
    accent: "#40916C",
    status: "live",
    href: "/(tabs)/iot",
    features: [
      { icon: "🌡️", title: "Soil & climate", desc: "Moisture, temp, humidity." },
      { icon: "💧", title: "Irrigation", desc: "Automate watering." },
      { icon: "🔔", title: "Alerts", desc: "Thresholds and warnings." },
    ],
    stats: [
      { icon: "📡", value: "—", label: "Devices" },
      { icon: "💧", value: "—", label: "Moisture" },
    ],
  },
  {
    key: "erp",
    title: "Agricultural ERP",
    tagline: "Accounting, payroll and resources.",
    icon: "🧾",
    accent: "#2D6A4F",
    status: "soon",
    features: [
      { icon: "💵", title: "Accounting", desc: "Income, expenses, P&L." },
      { icon: "👷", title: "Payroll", desc: "Workers and wages." },
      { icon: "📦", title: "Resources", desc: "Plan inputs and assets." },
    ],
  },
  {
    key: "warehouse",
    title: "Inventory & Warehouse",
    tagline: "Stock levels across your stores.",
    icon: "🏭",
    accent: "#52B788",
    status: "soon",
    features: [
      { icon: "📦", title: "Stock control", desc: "Track quantities and SKUs." },
      { icon: "⚠️", title: "Low-stock alerts", desc: "Reorder before you run out." },
      { icon: "🏬", title: "Multi-store", desc: "Many warehouses, one view." },
    ],
  },
  {
    key: "supply-chain",
    title: "Supply Chain",
    tagline: "Trace produce from farm to buyer.",
    icon: "🔗",
    accent: "#1B4332",
    status: "soon",
    features: [
      { icon: "🧭", title: "Traceability", desc: "Every step, end to end." },
      { icon: "🤝", title: "Suppliers", desc: "Manage partners." },
      { icon: "📑", title: "Orders", desc: "Purchase and fulfil." },
    ],
  },
  {
    key: "logistics",
    title: "Logistics",
    tagline: "Deliveries, routes and fleet.",
    icon: "🚚",
    accent: "#40916C",
    image: images.tractor,
    status: "soon",
    features: [
      { icon: "🗺️", title: "Route planning", desc: "Optimise deliveries." },
      { icon: "🚚", title: "Fleet", desc: "Vehicles and drivers." },
      { icon: "📍", title: "Tracking", desc: "Live shipment status." },
    ],
  },
  {
    key: "investments",
    title: "Investment Platform",
    tagline: "Fund farms, grow together.",
    icon: "📈",
    accent: "#2D6A4F",
    status: "soon",
    features: [
      { icon: "🌱", title: "Opportunities", desc: "Browse farm projects." },
      { icon: "💼", title: "Portfolio", desc: "Track your stakes." },
      { icon: "📊", title: "Returns", desc: "Monitor performance." },
    ],
  },
  {
    key: "tenders",
    title: "Tender System",
    tagline: "Post and bid on agri contracts.",
    icon: "📋",
    accent: "#52B788",
    status: "soon",
    features: [
      { icon: "📢", title: "Post tenders", desc: "Publish requirements." },
      { icon: "✍️", title: "Submit bids", desc: "Compete for contracts." },
      { icon: "🏆", title: "Awards", desc: "Track winners." },
    ],
  },
  {
    key: "cooperatives",
    title: "Cooperatives",
    tagline: "Organise groups and shared resources.",
    icon: "🤝",
    accent: "#40916C",
    status: "soon",
    features: [
      { icon: "👥", title: "Members", desc: "Manage your co-op." },
      { icon: "📦", title: "Shared inputs", desc: "Bulk buying power." },
      { icon: "🗳️", title: "Governance", desc: "Votes and decisions." },
    ],
  },
  {
    key: "grow-areas",
    title: "Grow Areas",
    tagline: "Map zones, plots and growing areas.",
    icon: "🗺️",
    accent: "#1B4332",
    status: "soon",
    features: [
      { icon: "🗺️", title: "Zone mapping", desc: "Draw and label growing areas." },
      { icon: "🎛️", title: "Quick actions", desc: "Jump to common tasks fast." },
      { icon: "💰", title: "Area value", desc: "Estimated value & earnings per zone." },
    ],
  },
];

export function getModule(key: string | undefined): ModuleDef | undefined {
  return MODULES.find((m) => m.key === key);
}
