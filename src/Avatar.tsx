import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import * as micah from "@dicebear/micah";

/* A DiceBear "micah" avatar, generated deterministically from a seed so the
   same person always gets the same face. Rendered square (no radius) to sit
   inside a postage-stamp frame; the surrounding `.postage` supplies the
   coloured field and perforated edge. */
export function Avatar({ seed }: { seed: string }) {
  const uri = useMemo(() => createAvatar(micah, { seed }).toDataUri(), [seed]);
  return (
    <img
      src={uri}
      alt=""
      loading="lazy"
      draggable={false}
      className="block size-full"
    />
  );
}
