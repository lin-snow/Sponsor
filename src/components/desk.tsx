import { useState, type CSSProperties } from "react";

/* Replays an entrance animation (by remounting via a bumped key) on hover —
   but only on devices with a true pointer. Touchscreens synthesize a
   `mouseenter` on tap, which would replay a lone squiggle/frame *without* its
   hover-gated note, reading as half-broken; ignoring those keeps the page a
   clean static thing on touch and the full delight on desktop. */
function useHoverReplay() {
  const [key, setKey] = useState(0);
  const replay = () => {
    if (window.matchMedia?.("(hover: hover)").matches) setKey((k) => k + 1);
  };
  return [key, replay] as const;
}

/* ----------------------------- desk elements ----------------------------- */

/* Corner script monogram that writes itself in on load and re-inks on hover
   (the key remount replays the wipe), echoing the page's drawn-by-hand feel. */
export function Monogram({ children }: { children: string }) {
  const [trace, reInk] = useHoverReplay();
  return (
    <span
      onMouseEnter={reInk}
      className="select-none pt-1 font-script text-6xl leading-none text-muted/70"
    >
      <span
        key={trace}
        className={`inline-block ${trace === 0 ? "inkwrite" : "inkwrite-re"}`}
      >
        {children}
      </span>
    </span>
  );
}

const MARKER = {
  red: "var(--color-marker)",
  green: "var(--color-marker-green)",
  blue: "var(--color-marker-blue)",
} as const;

/* Wavy marker underline that hugs whatever text it wraps. */
export function HandUnderline({
  children,
  color = "red",
  note,
}: {
  children: string;
  color?: keyof typeof MARKER;
  note?: string;
}) {
  // Bumping this key remounts the path, replaying the re-trace animation each
  // time the phrase is hovered.
  const [trace, reTrace] = useHoverReplay();
  return (
    <span
      className="group/note relative inline-block whitespace-nowrap"
      onMouseEnter={reTrace}
    >
      {children}
      <svg
        viewBox="0 0 120 10"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-[7px] w-full overflow-visible"
      >
        <path
          key={trace}
          className={trace === 0 ? "scribble" : "retrace"}
          d="M2,6 C22,2 40,9 58,5 C78,1 98,9 118,4"
          fill="none"
          stroke={MARKER[color]}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      {note && <Annotation stroke={MARKER[color]}>{note}</Annotation>}
    </span>
  );
}

/* Hand-scribbled margin note that peels up above its phrase on hover — paper
   stock, marker ink, lightly tilted, like a sticky added as an afterthought.
   The parent must carry the `group/note` class. */
function Annotation({
  children,
  stroke,
}: {
  children: string;
  stroke: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 -rotate-2 scale-90 whitespace-nowrap border px-2 py-[3px] font-hand text-[0.8rem] font-normal leading-none text-(--ann) opacity-0 transition-[opacity,transform] duration-200 group-hover/note:scale-100 group-hover/note:opacity-100"
      style={
        {
          "--ann": stroke,
          borderColor: `color-mix(in srgb, ${stroke} 55%, transparent)`,
          backgroundColor: "var(--color-paper)",
          // uneven corners read as hand-torn, not a CSS pill
          borderRadius: "9px 6px 8px 6px / 6px 8px 6px 9px",
          boxShadow: "0 1px 1px rgba(0,0,0,0.04), 0 3px 6px rgba(0,0,0,0.09)",
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}

/* Tiny marker arrow that sketches itself in to the upper-right of a link on
   hover — the "this goes somewhere" flourish. Inherits the link's color via
   currentColor; absolutely placed so it never nudges the layout. */
export function LinkDoodle() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="pointer-events-none absolute left-full top-[0.1em] ml-[3px] size-3 -translate-x-1 -rotate-3 overflow-visible opacity-0 transition-all duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3,12.6 C7,9 10,6 12.7,3.1" />
        <path d="M6.6,2.9 C9.4,2.7 12.4,2.9 12.9,3.2 C13.2,4.2 13.2,7 13,9.4" />
      </g>
    </svg>
  );
}

/* Postage-stamp perforated border — a fine dashed outline hugging a note, set
   a few px inside the edge. The dash pattern stays uniform at any box size
   (non-scaling stroke) and inks itself in the note's currentColor. */
export function DashedFrame() {
  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      className="pointer-events-none absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] overflow-visible opacity-70"
    >
      <rect
        x="0.6"
        y="0.6"
        width="98.8"
        height="98.8"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeDasharray="2 3.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* Little hand-drawn pushpin that "pins" the note to the page. */
export function Pushpin() {
  return (
    <svg
      viewBox="0 0 28 28"
      aria-hidden="true"
      className="absolute -left-2.5 -top-2.5 size-7 -rotate-12 overflow-visible drop-shadow-sm"
    >
      {/* needle */}
      <path
        d="M13,12 L18.5,23"
        fill="none"
        stroke="var(--color-stamp)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* head */}
      <circle
        cx="11"
        cy="9"
        r="6.5"
        fill="var(--color-marker)"
        stroke="var(--color-paper)"
        strokeWidth="1.4"
      />
      {/* shine */}
      <circle cx="8.6" cy="6.8" r="1.7" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

/* Hand-drawn asterisk spark — three slightly-wobbly marker strokes, replaces
   the ✳ glyph that renders as a color emoji on iOS. */
function Spark() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-3 shrink-0 -rotate-6 overflow-visible text-marker"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M8,1.8 C7.7,5 8.2,11 8,14.2" />
        <path d="M2.4,4.6 C5,6.2 11,9.8 13.6,11.4" />
        <path d="M13.6,4.6 C11,6.2 5,9.8 2.4,11.4" />
      </g>
    </svg>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Spark />
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
        {children}
      </span>
    </div>
  );
}
