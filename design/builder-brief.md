# Builder brief

You are building a static web page from a finished design. **Zero creative latitude**: every colour, size, spacing, timing, easing, key binding and piece of text is already decided. Where the spec is silent, do the plainest possible thing and list it under "Decisions I had to make" in your report. Do not improve, restyle, reorder or reword anything.

Repo root: `C:\Users\PandaPanda\Projects\loa-on-air-2026-10-16`

Read, in this order, completely:
1. `design/spec.md` — the design. Follow it literally (§4 gives the markup skeleton and class names, §5–§7 the sizes, §8 motion, §9 keys/URL).
2. `content/outline.md` — the text. Copy it verbatim into the HTML (titles, bullets, talking points, glossary, title-stage strings). Do not render the `[hh:mm:ss]` markers; do render the stage's own timecode as `data-tc`/`data-sec` on the `<section>`. Converting `hh:mm:ss` to seconds: `h*3600 + m*60 + s`.
3. `images/manifest.json` — the frames (file, size, caption, alt, VOD seconds) per stage.
4. `reviews/triage.md` — section "Pre-build review findings" lists accepted changes; the spec and outline already incorporate them, this is for context only.

Also load the `dataviz` skill before writing the SVG stat tiles (§7.5) and follow its mark rules; the spec's numbers win over the skill's defaults where they differ.

Fixed inputs to paste:
- jw-back: paste the whole of `C:\Users\PandaPanda\Projects\thejunglewalrus.github.io\snippets\jw-back.html` verbatim (the comment block may be dropped, the `<a>` and its `<style>` must be byte-identical) as the first thing inside `<body>`.
- Footer: copy the `<footer class="site-footer">…</footer>` markup from `C:\Users\PandaPanda\.claude\skills\kr-patch-digest\assets\patch.template.html`, with the text and link changes in spec §5 (rename the separator span class from `dot` to `sep`).
- Brand PNGs are already in `assets/`.

Deliverables (write these files, nothing else; `obs-landscape.html` and `obs-vertical.html` already exist, leave them):
- `index.html`, `style.css`, `app.js`.

Rules:
- Vanilla HTML/CSS/JS, no frameworks, no build step, no `fetch`, no inline `<script>` other than none at all (all JS in `app.js`), no inline styles except on the jw-back snippet's own `<style>`.
- The page must work when opened as a `file://` URL (OBS loads it that way) and from a plain `python -m http.server`.
- Every number and every word on the page must come from the outline or the manifest.
- Use `&rarr;` for the arrows in the outline (the → characters), `&mdash;` only where the outline has an em dash (it has none in body text; the stat tile label "−3 to −4" uses U+2212 minus via `&minus;`).

When done, run a quick self-check: open `index.html` via `python -m http.server 8765 --bind 127.0.0.1` is NOT required of you; just make sure the HTML parses (no unclosed tags; run `python -c "import html.parser"`-level sanity if you like) and that `app.js` has no syntax errors (`node --check app.js`).

Report back with: the file list with sizes; the stage count and their ids; the list of "Decisions I had to make"; anything in the spec you could not implement exactly and why. Nothing else.
