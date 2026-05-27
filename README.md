# Sponsor

A thank-you wall for the people who support my work, alongside a "buy me a
coffee" link. It lives at [sponsor.sn0w.fyi](https://sponsor.sn0w.fyi).

## Becoming a sponsor

Thank you 🙏 I add new supporters to the wall myself from time to time, so if
you've already sponsored, you don't have to do anything — your name will show
up in a future round.

If you'd rather not wait, or want a say in how you appear (a particular name, a
link, a short message), open an issue and I'll add it sooner:

1. Open an **["Add a sponsor"](../../issues/new?template=add-sponsor.yml)** issue
   and fill in the short form — a display name, and optionally a link and a
   one-line message.
2. I'll take a look and approve it.
3. Your name goes up the next time the site updates.

You don't have to fill in any dates or technical details — just the form.

## How approvals work (automated)

The wall is curated, but adding an approved entry is automated so I'm not
editing files by hand for every supporter:

1. Someone opens an **Add a sponsor** issue.
2. I review it and apply the `sponsor` label once I'm happy with it.
3. A [GitHub Action](.github/workflows/sponsor-pr.yml) reads the form, adds the
   entry to `src/sponsors.json` (dated that day), and opens a pull request.
4. I merge the pull request — which deploys the updated site automatically.

Every entry is reviewed twice (the label, then the merge), and nothing goes live
without me. Opening an issue on its own changes nothing until I label it.

## Development

```bash
bun install
bun run dev      # local dev server
bun run build    # production build → dist/
```

The thank-you wall and support link live in `src/sponsors.json` — with write
access you can edit that file directly instead of going through an issue.

## License

[AGPL-3.0](LICENSE)
