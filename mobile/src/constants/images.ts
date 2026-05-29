// Centralized image imports (see docs/realdc.md image rule).
// Import every app image here and consume via the `images` object, e.g.
//   import { images } from "@/src/constants/images";
//   <Image source={images.tractor} />
//
// Remote photos can be added as { uri: "https://…" } if a local asset is missing.

const onboarding = require("../app/assets/onboarding.png");
const contact = require("../app/assets/contact_us.png");
const tractor = require("../app/assets/tractor.jpg");
const fruit = require("../app/assets/fruit.jpg");
const tomato = require("../app/assets/tomato.jpg");
const seeds = require("../app/assets/seeds.jpg");
const shovel = require("../app/assets/shovel.jpg");
const rake = require("../app/assets/rake.jpg");

export const images = {
  onboarding,
  contact,
  tractor,
  fruit,
  tomato,
  seeds,
  shovel,
  rake,
};

export type AppImage = (typeof images)[keyof typeof images];
