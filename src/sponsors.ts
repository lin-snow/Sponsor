// All sponsor data lives in sponsors.json (the hand-maintained source of truth);
// this module just types it and exposes the page-level support link + tier map.
import data from "./sponsors.json";

export type Tier = "coffee" | "meal" | "rocket";

export type Sponsor = {
  name: string; // required; also the default avatar seed
  tier?: Tier;
  link?: string; // optional outbound link wrapped around the card
  message?: string; // optional one-line note
  seed?: string; // optional avatar-seed override (defaults to `name`)
  date?: string;
};

type SponsorData = { afdian: string; sponsors: Sponsor[] };

const { afdian, sponsors } = data as unknown as SponsorData;

export { afdian, sponsors };

// Tier → its sticker label and marker accent. Deliberately no amounts:
// recognition without turning the wall into a leaderboard.
export const TIERS: Record<Tier, { label: string; color: string }> = {
  coffee: { label: "coffee", color: "var(--color-marker-blue)" },
  meal: { label: "a meal", color: "var(--color-marker-green)" },
  rocket: { label: "rocket", color: "var(--color-marker)" },
};
