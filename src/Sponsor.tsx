import { useState, type CSSProperties } from "react";
import {
  DashedFrame,
  HandUnderline,
  Lightbox,
  LinkDoodle,
  Monogram,
  Pushpin,
  SectionLabel,
} from "@/components/desk";
import { Avatar } from "./Avatar";
import { afdian, sponsors, TIERS, type Sponsor } from "./sponsors";

// The wall shows up to this many stamps at once (newest first); beyond it, a
// "show more" button reveals the rest rather than letting the wall run forever.
const WALL_CAP = 99;

// prettier-ignore
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* "2025-11-20" → "Nov 2025". Leaves anything unparseable untouched. */
function formatDate(iso?: string) {
  if (!iso) return "";
  const [year, month] = iso.split("-");
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : iso;
}

/* A tidy label for an outbound link: the bare host + path, no scheme or
   trailing slash (e.g. "github.com/sseaan"). */
function linkLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// Warm stamp tints cycled across the wall for postage-stamp variety.
const STAMP_BG = [
  "color-mix(in srgb, var(--color-sticky) 50%, var(--color-paper))",
  "var(--color-note)",
  "color-mix(in srgb, var(--color-marker-green) 20%, var(--color-paper))",
  "color-mix(in srgb, var(--color-marker) 16%, var(--color-paper))",
  "color-mix(in srgb, var(--color-sticky) 28%, var(--color-paper))",
];
const TILTS = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2"];

/* A tier sticker — recognition without a number, inked in the tier's marker
   accent. Stands in for an amount so the wall stays a thank-you, not a board. */
function TierBadge({ tier }: { tier: NonNullable<Sponsor["tier"]> }) {
  const { label, color } = TIERS[tier];
  return (
    <span
      className="inline-block -rotate-1 rounded-[5px] border px-1.5 py-[2px] font-hand text-[0.8rem] leading-none"
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}

/* One sponsor as a tilted postage stamp — a perforated, colour-tinted frame
   around the avatar — that lifts and straightens on hover. Clicking it opens the
   detail lightbox. */
function StampCard({
  s,
  i,
  onOpen,
}: {
  s: Sponsor;
  i: number;
  onOpen: (s: Sponsor) => void;
}) {
  return (
    <li className="group/card">
      <button
        type="button"
        onClick={() => onOpen(s)}
        aria-label={`View ${s.name}`}
        className="block cursor-pointer"
      >
        <span className="flex flex-col items-center gap-1.5">
          <span
            className={`${TILTS[i % TILTS.length]} block transition-transform duration-200 group-hover/card:-translate-y-1 group-hover/card:rotate-0`}
          >
            <span className="postage-wrap">
              <span
                className="postage block p-[6px]"
                style={
                  {
                    "--postage-bg": STAMP_BG[i % STAMP_BG.length],
                  } as CSSProperties
                }
              >
                <span className="block size-16 overflow-hidden">
                  <Avatar seed={s.seed ?? s.name} />
                </span>
              </span>
            </span>
          </span>
          <span className="max-w-[5.5rem] truncate font-mono text-[0.7rem] font-medium leading-tight text-ink">
            {s.name}
          </span>
          {s.tier && <TierBadge tier={s.tier} />}
        </span>
      </button>
    </li>
  );
}

/* The enlarged sponsor card shown inside the lightbox: a big postage stamp with
   the avatar, then the name (+ tier), their handwritten message, the date, and
   an outbound link if they left one. */
function SponsorDetail({ s }: { s: Sponsor }) {
  return (
    <figure
      className="relative flex w-[min(86vw,20rem)] flex-col items-center gap-3 bg-paper px-7 py-8 text-center"
      style={{
        borderRadius: "8px 5px 7px 6px / 5px 8px 6px 7px",
        boxShadow:
          "0 2px 6px rgba(0,0,0,0.14), 0 26px 56px -24px rgba(0,0,0,0.6)",
      }}
    >
      <Pushpin />
      <span className="postage-wrap -rotate-2">
        <span
          className="postage block p-[7px]"
          style={
            {
              "--postage-bg":
                "color-mix(in srgb, var(--color-sticky) 40%, var(--color-paper))",
            } as CSSProperties
          }
        >
          <span className="block size-24 overflow-hidden">
            <Avatar seed={s.seed ?? s.name} />
          </span>
        </span>
      </span>

      <figcaption className="flex flex-col items-center gap-2.5">
        <span className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-mono text-[0.95rem] font-medium text-ink">
            {s.name}
          </span>
          {s.tier && <TierBadge tier={s.tier} />}
        </span>

        {s.message && (
          <p className="font-hand text-[1.3rem] leading-snug text-soft">
            “{s.message}”
          </p>
        )}

        {s.date && (
          <span className="font-mono text-[0.68rem] tabular-nums text-muted">
            {formatDate(s.date)}
          </span>
        )}

        {s.link && (
          <a
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link relative mt-1 inline-flex items-center font-mono text-[0.74rem] text-soft underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-current"
          >
            {linkLabel(s.link)}
            <LinkDoodle />
          </a>
        )}
      </figcaption>
    </figure>
  );
}

/* A little hand-drawn espresso cup with three steam wisps drifting on their
   own offsets — a drawn mark instead of the flat ☕ emoji, to match the page. */
function CoffeeCup() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="size-7 shrink-0 overflow-visible"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className="steam"
          style={{ animationDelay: "0s" }}
          d="M12,11 C10.6,9.2 13.4,7.8 12,5.8"
        />
        <path
          className="steam"
          style={{ animationDelay: "0.5s" }}
          d="M16,11.4 C14.6,9.4 17.4,8 16,6"
        />
        <path
          className="steam"
          style={{ animationDelay: "1s" }}
          d="M20,11 C18.6,9.2 21.4,7.8 20,5.8"
        />
        {/* cup */}
        <path d="M8.5,14 L23.5,14 L22.2,23.2 C21.9,25 20.4,26 18.6,26 L13.4,26 C11.6,26 10.1,25 9.8,23.2 Z" />
        {/* handle */}
        <path d="M23.6,15.6 C27,15.2 28.4,17.6 27.4,19.7 C26.6,21.3 24.7,21.6 22.8,21.2" />
        {/* saucer */}
        <path d="M9.5,28.6 L22.5,28.6" />
      </g>
    </svg>
  );
}

/* A hand-made "buy me a coffee" button — drawn cup, marker-underlined label, a
   torn-ticket dashed border — that unfolds the actual channels (Afdian + WeChat)
   on click, rather than parking a QR code on the page by default. */
function SupportCoffee() {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  return (
    <section className="rise mt-10" style={{ animationDelay: "200ms" }}>
      <div className="flex flex-col items-center">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="support-panel"
          onClick={() => setOpen((o) => !o)}
          className="sticky-note relative inline-flex -rotate-1 cursor-pointer items-center gap-2.5 px-6 py-3 transition-transform duration-200 hover:-translate-y-0.5 hover:rotate-0"
          style={{ borderRadius: "15px 9px 14px 10px / 9px 14px 10px 15px" }}
        >
          <DashedFrame />
          <CoffeeCup />
          <span className="relative font-hand text-[1.25rem] leading-none">
            <HandUnderline color="red">Buy me a coffee</HandUnderline>
          </span>
        </button>
        <div
          id="support-panel"
          className={`fold w-full ${open ? "open" : ""}`}
          inert={!open}
        >
          {/* px/pb padding gives the cards' shadows + pushpin room to render
              before the .fold wrapper's overflow:hidden (needed for the
              collapse animation) would clip them. */}
          <div className="px-3 pb-6">
            <div className="mx-auto mt-6 grid max-w-[26rem] grid-cols-1 gap-5 sm:grid-cols-2">
              <a
                href={afdian}
                target="_blank"
                rel="noopener noreferrer"
                className="note group/link relative flex -rotate-[0.6deg] items-center justify-center px-4 py-6 font-mono text-[0.82rem] font-medium"
                style={{
                  borderRadius: "11px 8px 12px 9px / 8px 12px 9px 11px",
                }}
              >
                <DashedFrame />
                Support on Afdian
                <LinkDoodle />
              </a>

              <div
                className="relative rotate-[0.8deg] bg-paper px-4 py-5 text-center"
                style={{
                  borderRadius: "6px 4px 6px 5px / 4px 6px 5px 6px",
                  border: "1px solid var(--color-hair)",
                  boxShadow:
                    "0 1px 1px rgba(38,34,28,0.05), 0 3px 7px -5px rgba(38,34,28,0.28)",
                }}
              >
                <Pushpin />
                <button
                  type="button"
                  onClick={() => setZoom(true)}
                  aria-label="Enlarge WeChat tip QR code"
                  className="group/qr mx-auto block cursor-zoom-in"
                >
                  <img
                    src="/wechatpay.jpeg"
                    alt="WeChat tip QR code"
                    width={120}
                    height={120}
                    className="mx-auto size-[120px] object-contain transition-transform duration-200 group-hover/qr:scale-[1.04]"
                  />
                </button>
                <span className="mt-2 block font-mono text-[0.72rem] text-muted">
                  WeChat — tap to enlarge
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={zoom}
        onClose={() => setZoom(false)}
        label="WeChat tip QR code"
      >
        <figure
          className="relative -rotate-1 bg-paper p-4"
          style={{
            borderRadius: "13px 9px 12px 8px / 9px 13px 8px 12px",
            boxShadow:
              "0 2px 6px rgba(0,0,0,0.18), 0 30px 60px -24px rgba(0,0,0,0.7)",
          }}
        >
          <Pushpin />
          <img
            src="/wechatpay.jpeg"
            alt="WeChat tip QR code"
            className="block size-[min(76vw,22rem)] object-contain"
          />
          <figcaption className="mt-3 text-center font-mono text-[0.74rem] text-muted">
            WeChat
          </figcaption>
        </figure>
      </Lightbox>
    </section>
  );
}

/* The sponsor hub at sponsor.sn0w.fyi — a postage-stamp thank-you wall plus a
   collapsible "buy me a coffee" CTA. Same paper shell and desk primitives as
   the home page, so it reads as part of the same hand. */
export function Sponsor() {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Sponsor | null>(null);
  const sorted = [...sponsors].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );
  const visible = showAll ? sorted : sorted.slice(0, WALL_CAP);
  const hidden = sorted.length - visible.length;

  return (
    <div className="min-h-svh">
      <main className="mx-auto max-w-[33rem] px-6 pt-16 pb-28 sm:pt-24">
        <header
          className="rise flex items-start justify-between gap-4"
          style={{ animationDelay: "0ms" }}
        >
          <a
            href="https://sn0w.fyi"
            className="group/link relative font-mono text-[0.78rem] text-soft underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-current"
          >
            ← sn0w.fyi
            <LinkDoodle />
          </a>
          <Monogram>L</Monogram>
        </header>

        <div
          className="rise mt-7 space-y-3 text-[0.95rem] leading-relaxed"
          style={{ animationDelay: "90ms" }}
        >
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            <HandUnderline color="red" note="thank you">
              Sponsors
            </HandUnderline>
          </h1>
          <p className="text-soft">
            The kind people who back the things I build. Every bit of support
            pushes this work a little further —{" "}
            <span className="font-medium text-ink">
              thank you, all {sponsors.length} of you
            </span>
            .
          </p>
        </div>

        <SupportCoffee />

        <section className="rise mt-12" style={{ animationDelay: "300ms" }}>
          <SectionLabel>wall of thanks</SectionLabel>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-7">
            {visible.map((s, i) => (
              <StampCard key={s.name} s={s} i={i} onOpen={setSelected} />
            ))}
          </ul>
          {hidden > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="note relative inline-flex -rotate-[0.4deg] cursor-pointer items-center gap-2 px-5 py-2.5 font-mono text-[0.76rem] font-medium transition-transform duration-200 hover:-translate-y-0.5 hover:rotate-0"
                style={{
                  borderRadius: "11px 8px 12px 9px / 8px 12px 9px 11px",
                }}
              >
                <DashedFrame />
                show {hidden} more
              </button>
            </div>
          )}
        </section>
      </main>

      <Lightbox
        open={!!selected}
        onClose={() => setSelected(null)}
        label={selected ? `${selected.name} — sponsor` : ""}
      >
        {selected && <SponsorDetail s={selected} />}
      </Lightbox>
    </div>
  );
}
