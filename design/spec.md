# Design spec — "Gold River returns" stage page

Builder contract: **zero creative latitude.** Every token, size, timing and easing below is pinned. Where this spec is silent, do the plainest thing and list it in your report; do not invent. Content comes verbatim from `content/outline.md`; frames from `images/manifest.json`. One `index.html`, one `style.css`, one `app.js`, no frameworks, no build step, no `fetch()` (the page must work from `file://` inside an OBS browser source, where fetch is blocked). All content is inline in the HTML.

Design sizes are given in CSS px at two reference viewports: **landscape 1920x1080** and **vertical 1080x1920**. They are implemented in `rem` (1rem = 16 design px) on top of the scaling model in §2, so the page renders identically at 2560x1440 (the stream canvas) and 1080x1920 (the vertical canvas).

## 1. Concept

A broadcast control room. The one memorable element is the **timecode**: a red, tabular Barlow Condensed VOD timecode fixed at the top-left that rolls to each stage's timestamp as the viewer advances, with a small red on-air lamp beside it. Everything else stays quiet. The summary text sits on warm **cue cards** on a night-navy stage so it reads from across a room at 1080p. Talking points live in a separate, visibly different box so a viewer never confuses our prompts with his words.

## 2. Tokens and scaling

Colours (CSS custom properties on `:root`):

| token | value | use |
|---|---|---|
| `--stage` | `#131B30` | page background |
| `--stage-deep` | `#0C1222` | rail, header, bezels, bottom sheet |
| `--card` | `#F4EEE1` | cue card paper |
| `--ink` | `#1A1F2B` | text on card |
| `--ink-muted` | `#5B6274` | secondary text on card |
| `--on-stage` | `#C9CFDD` | text on the stage (captions, counter, footer) |
| `--on-stage-muted` | `#8A93A8` | secondary text on the stage |
| `--onair` | `#E2473F` | lamp and timecode only |
| `--gold` | `#C8A45C` | hairlines, bullets, emphasis bars, active dot, talking-points frame |
| `--bar` | `#3A4460` | non-emphasised stat bars |
| `--link` | `#6EA8FF` | links on the stage |

Type: Google Fonts, one `<link>` (plus the two `preconnect` links), `display=swap`:
`https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Noto+Sans+KR:wght@400;600&display=swap`

- `--font-display`: `"Barlow Condensed", "Arial Narrow", sans-serif` — timecode, counter, titles, stat numerals, captions, talking-points heading. Always `font-variant-numeric: tabular-nums`.
- `--font-body`: `"Source Serif 4", Georgia, "Noto Sans KR", serif` — card body, talking points, standfirst, glossary gloss, footer.
- Korean glyphs fall through to Noto Sans KR via the font stack; also set `.kr { font-family: "Noto Sans KR", sans-serif; }` on every element that holds Korean (glossary KR column, the 금강선 in the standfirst, the kicker).

Scaling model (the only place viewport units appear):

```css
html { font-size: max(10px, calc(min(100vw / 1920, 100vh / 1080) * 16)); }
html[data-layout="vertical"] { font-size: max(10px, calc(min(100vw / 1080, 100vh / 1920) * 16)); }
```

Everything else is in `rem` (value = design px / 16). `*, *::before, *::after { box-sizing: border-box }`. `body` background `--stage`, `margin: 0`, `color: var(--on-stage)`. No `overflow: hidden` on html/body.

## 3. Layout switch

`<html data-layout="landscape">` by default. `app.js` sets it on load and on `resize`:

1. `?layout=vertical` → `vertical`; `?layout=landscape` → `landscape`; else
2. `window.matchMedia("(orientation: portrait)").matches` → `vertical`; else `landscape`.
3. Then, if the chosen mode's scale would hit the floor (`min(innerWidth/1920, innerHeight/1080) * 16 < 10` for landscape, `min(innerWidth/1080, innerHeight/1920) * 16 < 10` for vertical), the mode becomes `narrow` (§9): a flowing reading layout for small windows and phones, never used by OBS.

All layout CSS keys off `html[data-layout="landscape"]` / `html[data-layout="vertical"]` / `html[data-layout="narrow"]`. No other media queries except `prefers-reduced-motion`.

## 4. Document structure

```html
<body>
  <!-- jw-back snippet pasted VERBATIM here (anchor + its <style>) -->
  <div class="rail" aria-hidden="true"></div>
  <header class="head">
    <span class="lamp" aria-hidden="true"></span>
    <span class="vod" aria-hidden="true">VOD</span>
    <a class="timecode" id="timecode" href="https://www.youtube.com/watch?v=wZ0rwJWBLec&t=1797s">00:29:57</a>
    <span class="counter" id="counter">01 / 22</span>
  </header>
  <main class="stages" id="stages">
    <section class="stage stage--title" id="s0" data-tc="00:29:57" data-sec="1797"> … </section>
    <section class="stage" id="s1" data-tc="00:29:57" data-sec="1797"> … </section>
    …
    <section class="stage stage--glossary" id="s20" data-tc="01:56:50" data-sec="7010"> … </section>
    <section class="stage stage--glossary" id="s21" data-tc="01:56:50" data-sec="7010"> … <footer class="site-footer">…</footer></section>
  </main>
  <nav class="dots" aria-label="Stages"><button class="dot" data-stage="0" aria-label="Stage 1: Gold River returns"></button> … </nav>
  <button class="tp-toggle" id="tp-toggle" type="button">Our talking points (T)</button>
  <script src="app.js"></script>
</body>
```

Stage ids are `s0`…`s21` in outline order (22 stages). `images/manifest.json` is authoritative for every image's file, pixel size, caption, alt and VOD seconds; where this spec's examples differ, the manifest wins. `data-sec` = seconds for the VOD `t=` link. Each regular stage:

```html
<section class="stage" id="s4" data-tc="00:42:50" data-sec="2570">
  <article class="card">
    <h2 class="card__title">Mordum: the decisions</h2>
    <ul class="card__list"><li>…</li></ul>
    <figure class="stat"> (only on stat stages, §7.5) </figure>
  </article>
  <div class="side">
    <figure class="monitor"> (only on frame stages)
      <div class="monitor__bezel"><img src="images/dps-gap.jpg" alt="…" width="1400" height="784"></div>
      <figcaption class="monitor__cap"><span>His slide: max–min DPS spread by raid gate</span><a href="https://www.youtube.com/watch?v=wZ0rwJWBLec&t=2210s">00:36:50</a></figcaption>
    </figure>
    <aside class="tp">
      <h3 class="tp__title">Our talking points</h3>
      <ul class="tp__list"><li>…</li></ul>
    </aside>
  </div>
</section>
```

Stages with no frame get class `stage--nofig` (card wider, §5). `<strong>` in bullets → weight 600, same colour. The `[hh:mm:ss]` markers in the outline are NOT rendered. The arrows `→` in the outline are rendered as the character `→` (U+2192), nothing else.

Heading hierarchy: one `<h1>` on the title stage, `<h2>` per stage, `<h3>` for "Our talking points". `<html lang="en">`, `<title>Gold River returns: Lost Ark On Air, 2026-10-16</title>`, `<meta name="description" content="Stage-by-stage English summary of Gold River's 2026-10-16 Lost Ark On Air broadcast after Mordum Extreme.">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`.

## 5. Landscape layout (1920x1080 design px)

Fixed chrome:
- `.rail`: `position: fixed; left: 0; top: 0; bottom: 0; width: 112px; background: var(--stage-deep); border-right: 1px solid rgba(200,164,92,.35)`. The jw-back anchor sits inside it visually (its own fixed 14/14 px position, untouched). The rail holds nothing else.
- `.head`: `position: fixed; left: 112px; right: 0; top: 0; height: 96px; background: linear-gradient(var(--stage) 70%, rgba(19,27,48,0))` (so content scrolling under it fades, nothing else). Contents on one line, vertically centred on the timecode's cap height (timecode top at 28px): `.lamp` at `left: 40px` (14px circle, §7.1); `.vod` at `left: 66px`, Barlow Condensed 600 20px/1 `--on-stage-muted`; `.timecode` at `left: 118px`: Barlow Condensed 700, 44px/1, colour `--onair`, letter-spacing .01em, `text-decoration: none`; `.counter` at `right: 96px`: Barlow Condensed 600, 28px/1, colour `--on-stage`, text "04 / 22" (two-digit, space-slash-space, 22 is the stage count).
- `.dots`: `position: fixed; right: 28px; top: 50%; transform: translateY(-50%)`, column, `gap: 12px`. Each `.dot`: 12x12, `border-radius: 50%`, `background: rgba(244,238,225,.35)`, `border: 0`, `padding: 0`, `cursor: pointer`. `.dot.is-active`: `background: var(--gold); box-shadow: 0 0 0 2px var(--stage), 0 0 0 3px var(--gold)`. `:focus-visible`: `outline: 2px solid var(--gold); outline-offset: 3px`.

Scroller:
- `.stages`: `height: 100vh; overflow-y: auto; scroll-snap-type: y mandatory; scrollbar-width: none` (and `::-webkit-scrollbar { display: none }`).
- `.stage`: `height: 100vh; box-sizing: border-box; scroll-snap-align: start; scroll-snap-stop: always; padding: 112px 96px 56px 152px; display: grid; grid-template-columns: 1000px 624px; column-gap: 48px; align-items: start`.
- `.stage--nofig`: `grid-template-columns: 1080px 544px`.
- `.stage--title`: same grid as a frame stage (1000 / 624), no `.tp`.
- `.stage--glossary`: `grid-template-columns: 1240px`; on S21 the footer is a second grid row under the card (`margin-top: 28px`).
- **Webcam safe area (landscape):** the stream webcam covers design px x 1440–1920, y 810–1080. Nothing in `.side` may extend below y = 800; the verifier measures the bottom of the last `.side` child on every stage at 1920x1080. The card column ends at x 1152 and is unaffected. If a stage fails, the fix is `is-tight` on that stage (§6), not a layout change.

Cue card `.card`: `background: var(--card); color: var(--ink); border-radius: 6px; padding: 40px 44px; box-shadow: 0 8px 32px rgba(0,0,0,.35)`.
- `.card__title`: Barlow Condensed 700, 56px/1.05, margin `0 0 20px`, letter-spacing 0.
- `.card__list`: `list-style: none; margin: 0; padding: 0`. `li`: Source Serif 4 400, 28px/1.42, `padding-left: 30px; position: relative`. `li::before`: 8x8 square, `background: var(--gold)`, `position: absolute; left: 4px; top: .6em`. `li + li { margin-top: 14px }`.
- Title stage card: `.title__kicker` Barlow 600 22px/1.2 `--ink-muted`, items separated by two spaces and a middle dot as written in the outline (this is the one place a dot separator is allowed, because it is the kicker line); then `h1.title__name` Barlow 700 96px/.95 `--ink` margin `16px 0 4px`; `.title__sub` Barlow 600 44px/1.05 `--ink-muted` margin `0 0 28px`; `.title__stand` Source Serif 4 400 24px/1.5 `--ink` max-width 40ch; `.title__keys` Barlow 600 18px/1.3 `--ink-muted` margin-top 36px, the four hints separated by three spaces (`&#8195;` em spaces, three of them).

Side column `.side`: `display: flex; flex-direction: column; gap: 28px`.
- `.monitor` (`margin: 0`): `.monitor__bezel { background: var(--stage-deep); padding: 4px; border: 2px solid var(--gold); border-radius: 4px }`, `img { display: block; width: 100%; height: auto }`. `.monitor__cap`: `display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin-top: 10px`; text: Barlow Condensed 600 20px/1.2 `--on-stage`; the link: Barlow 600 20px `--on-stage`, `text-decoration: underline; text-decoration-color: var(--gold); text-underline-offset: 3px; text-decoration-thickness: 1px` (red stays reserved for the lamp and the big timecode).
- `.tp`: `background: rgba(200,164,92,.08); border: 1px solid rgba(200,164,92,.55); border-radius: 6px; padding: 20px 24px; color: var(--card)`. `.tp__title`: Barlow Condensed 600 22px/1, colour `--gold`, margin `0 0 12px`, text always "Our talking points". `.tp__list`: Source Serif 4 400 24px/1.4, same square-bullet rule as the card (`::before` in `--gold`, `padding-left: 24px`), `li + li { margin-top: 10px }`.

Glossary cards (S20: six rows; S21: five rows plus the footer): `.glossary` is a CSS grid `grid-template-columns: 200px 220px 1fr; column-gap: 24px; row-gap: 0`. Header row: Barlow 600 20px `--ink-muted`, "KR", "Romanised", "Gloss". Body rows: KR cell Noto Sans KR 600 24px/1.3 (class `kr`); romanised Barlow Condensed 600 24px/1.3 `--ink`; gloss Source Serif 4 400 22px/1.4 `--ink`. Each body cell `padding: 9px 0; border-top: 1px solid rgba(26,31,43,.12)`. `.is-tight .glossary`: gloss 20px, cell padding 6px.

Footer `.site-footer` (markup copied from the kr-patch-digest template, with these texts): first `<p>`: "Summary of the Lost Ark On Air broadcast of 2026-10-16. Source: " + link "the VOD on YouTube" (`https://www.youtube.com/live/wZ0rwJWBLec`). Second `<p>`: "Made by " + link "junglewalrus" (Twitch). Then the `nav.footer-links` row exactly as in the template, with the GitHub link pointing at `https://github.com/thejunglewalrus/loa-on-air-2026-10-16`. Styles: `p { margin: 0 0 6px; font: 400 18px/1.4 var(--font-body); color: var(--on-stage) }`, links `--link` underlined, `.footer-links { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; font: 600 18px/1 var(--font-display) }`, `.icon { width: 16px; height: 16px; vertical-align: -2px; margin-right: 4px }`, `.dot` inside the footer is the template's separator span — rename that span's class to `sep` to avoid clashing with the stage dots, colour `--on-stage-muted`.

## 6. Vertical layout (1080x1920 design px)

- `.rail` hidden. `.head`: `left: 0; right: 0; height: 128px`, same gradient. `.lamp` at `left: 48px` (16px circle), `.vod` at `left: 76px` (22px), `.timecode` at `left: 136px; top: 52px`, 56px/1, all centred on the timecode's cap height. `.counter` at `right: 48px; top: 66px`, 32px/1. jw-back keeps its own fixed spot (top-left, above the timecode line; they do not overlap because the timecode starts at y 52 and jw-back ends at y 50).
- `.stage`: `padding: 144px 48px 48px; display: flex; flex-direction: column; gap: 28px; align-items: flex-start` (all variants, including title and glossary).
- `.card`: `width: 100%; padding: 40px 44px`. `.card__title` 60px/1.05. `li` 36px/1.4, `padding-left: 36px`, square 10x10 at `left: 6px; top: .55em`, `li + li { margin-top: 16px }`. Title stage: kicker 26px, h1 112px/.95, sub 52px, standfirst 34px/1.45, keys 24px.
- `.side`: `width: 100%`. `.monitor { width: 100% }` (984px: charts and screenshots must survive a phone-sized simulcast; the card still comes first and takes the larger share of the height). `.monitor__cap` 24px. Stat tiles in vertical: `figcaption` and `.stat__note` 28px, svg text 30 viewBox units (the labels still fit the 260-unit column).
- Talking points in vertical replace the monitor instead of overlaying anything: while talking points are on (`html[data-tp="on"]`), `.monitor` is `display: none` and `.tp` is shown (`.tp__title` 30px, `.tp__list` 36px/1.35, same square bullets); while off, `.tp` is hidden and the monitor shows. On no-frame stages `.tp` shows whenever talking points are on. Default off in vertical (§9).
- `.dots`: `right: auto; top: auto; left: 50%; bottom: 24px; transform: translateX(-50%); flex-direction: row; gap: 10px`; dots 10x10.
- Title stage: kicker 26px, h1 112px/.95, sub 52px, standfirst 34px/1.45, keys 24px; hero monitor at 100% width below the card.
- Glossary: `.glossary { grid-template-columns: 300px 1fr; column-gap: 24px }` with the KR cell and romanised cell stacked in the first column (KR 30px Noto Sans KR 600 on top, romanised 24px Barlow 600 `--ink-muted` beneath); gloss 28px/1.35. Footer 20px, below the card.

Overflow guard (both layouts): after `document.fonts.ready` and on `resize`, for each `.stage`, if `stage.scrollHeight > stage.clientHeight + 1`, add class `is-tight`. `.is-tight .card__list li` → 25px in landscape, 32px in vertical; `.is-tight .monitor` → 800px wide in vertical. Re-check once after applying. If a stage is still overflowing, log `console.warn("overflow", stage.id)` (the verifier reads this).

## 7. Components

### 7.1 Lamp and timecode
- `.lamp`: 14x14 (16x16 in vertical) `border-radius: 50%; background: var(--onair); box-shadow: 0 0 12px rgba(226,71,63,.7)`; sits immediately left of "VOD" and the timecode so the three read as one signal; starts `opacity: 0` and is set to 1 on load (§8).
- `#timecode` text is always `hh:mm:ss` with leading zeros; `href` is updated to the active stage's `t=` link on every stage change.

### 7.2 Monitor
Image files and captions come from `images/manifest.json` (`file`, `timecode`, `seconds`, `caption`, `alt`, `stage`). Width/height attributes = the file's pixel size. S16 (Rasamoa) has five images: render all five `<img>` inside one bezel stacked with `position: absolute` in a `position: relative` box whose aspect ratio is the first image's; only the one with class `is-shown` is visible (`opacity: 1`, others `opacity: 0`); the caption's text is the shown image's caption; Inactive images carry `aria-hidden="true"`. The presenter advances it: key `N` shows the next image (wrapping), `B` the previous; the image crossfades 400ms `ease` and the caption text swaps at the fade midpoint (instant under reduced motion). Autoplay (every 6000ms while S16 is active, interval cleared when it is not) runs only with `?auto=1`. The first image shows by default.

### 7.3 Talking points
Exactly the outline's two prompts per stage. Never on the title stage or the glossary.

### 7.4 Links
Only three kinds of links exist: the timecode, the monitor caption timecodes, and the footer. All open the VOD at `https://www.youtube.com/watch?v=wZ0rwJWBLec&t=<seconds>s`. Footer and caption links have `rel="noopener" target="_blank"`; the big timecode too.

### 7.5 Stat tiles (`figure.stat`, inside the card, `margin: 24px 0 0`)
Inline SVG, no library. Shared rules: `figcaption` first (Barlow Condensed 600 20px `--ink-muted`, margin-bottom 8px) stating what the tile shows; then one `<svg>` `width: 100%` with `viewBox` as given; bars `rx="2"`; labels Barlow Condensed 600 (sizes below, in viewBox units); emphasised bar `--gold`, others `--bar`; value text right of the bar end, `--ink`, tabular. Each bar's width is `value / scaleMax * trackWidth`. Bars and value texts render in their final state immediately: no growth, no count-up (data is not decoration; the timecode is the page's only rolling number). Keep an `aria-label` on the svg stating the values.

| stage | figcaption | viewBox | rows (label → value, emphasised?) | scaleMax |
|---|---|---|---|---|
| S4 | "Mordum clear rate, before and after the nerf (after = as of the night before)" | `0 0 900 110` | "Before the nerf" → 3.47% (no); "After the nerf" → 33.09% (yes) | 40 |
| S12 | "Nice-dan share of rosters, from his chart" | `0 0 900 200` | "Summer 2023" → 2.1%; "Summer 2024" → 6.0%; "Summer 2025" → 16.0%; "Summer 2026" → 17.8% (yes) | 20 |
| S15 | "Package-sourced gold, peak share of all gold produced" | `0 0 900 70` | one track 100% wide in `--bar` at 35% opacity; one fill 2.65% wide in `--gold` (yes); value "2.65%" placed at x = fill end + 12 | 100 |
| S18 | "Dev headcount growth since the 2018-11-07 open beta" | `0 0 900 110` | "By mid-2021" → +15; "By December 2025" → +57 (yes) | 60 |

S18 adds one line under its svg, `p.stat__note`, Barlow Condensed 600 20px `--ink-muted`, margin-top 8px: "2026: three or four fewer than 2025, flat." Labels never wrap: the longest ("By December 2025") fits 260 viewBox units at 22 units of Barlow Condensed; the builder confirms this in its report.

Row geometry: label column 0–260 (text anchored at x=0, 22 units), track from x=280 to x=820 (540 units), bar height 28, row pitch 45, first row y=10. S15 is a single 28-high track at y=20 with the value text at y=40.

### 7.6 Dots and counter
Dots and counter reflect the active stage (IntersectionObserver, threshold .6, root `#stages`). Clicking a dot scrolls to that stage.

## 8. Motion (the complete list; nothing else animates)

Easing everywhere: `cubic-bezier(.2,.7,.2,1)`.
1. Load: `.lamp` opacity 0→1 over 180ms, then the timecode counts from 00:00:00 to the active stage's time over 700ms (tween the seconds value, render each frame).
2. Stage change: the timecode tweens from the current seconds to the new stage's seconds over 420ms. The active stage's `.monitor` goes from `opacity: .55` to `1` over 260ms; inactive monitors sit at `.55`. Cards never fade or slide.
3. Rasamoa crossfade: §7.2 (presenter-driven).
4. Keyboard/dot navigation scrolls with `scrollIntoView({ behavior: "smooth", block: "start" })`.
5. Talking points toggle on/off instantly.

`@media (prefers-reduced-motion: reduce)`: every duration above is 0 and scrolling is `behavior: "auto"`.

No hover effects (the pasted jw-back keeps its own; leave it), no gradients other than the header fade, no transitions on links or dots other than the focus ring.

## 9. Keyboard, URL, hash, phone fallback

Keys (ignored while a text input is focused; none exist, but guard anyway):
- `ArrowDown`, `ArrowRight`, `PageDown`, `Space` → next stage; `ArrowUp`, `ArrowLeft`, `PageUp` → previous; `Home` → first; `End` → last. `preventDefault()` on all of these.
- `T` → toggle `html[data-tp]` between `on` and `off`. Landscape: `off` hides every `.tp`. Vertical: `on` swaps the monitor for `.tp` (§6).
- `N` / `B` → next / previous Rasamoa image (only does something on S16).
- `P` → toggle `html[data-presenter="on"]`: hides `.jw-back`, `.dots`, `.title__keys`, `.tp-toggle`. The counter and timecode stay.
- `#tp-toggle`: a visible button for mouse and touch users, `position: fixed` (landscape `right: 28px; bottom: 24px`; vertical `right: 48px; bottom: 60px`), Barlow Condensed 600 18px, `background: var(--stage-deep); color: var(--gold); border: 1px solid var(--gold); border-radius: 999px; padding: 8px 14px; cursor: pointer`, same focus ring as the dots. Click = `T`. Hidden in presenter mode and in `narrow`.

**Sync between instances (required for OBS, where the landscape and vertical canvases load two separate copies of the page):** every navigation, `T`, and `N`/`B` writes `localStorage["loa-on-air:state"] = JSON.stringify({ stage, tp, tpSeq, rasamoa, at: Date.now() })`. `tpSeq` is a counter bumped only by an explicit `T`; a follower applies `tp` only when `tpSeq` differs from the one it last saw, so a plain navigation in landscape never switches the vertical canvas's talking points on (each layout keeps its own default until someone presses `T`). States older than the last applied `at` are ignored; `stage` and `rasamoa` must be integers in range or the state is ignored. Every instance listens for the `storage` event AND polls that key every 250ms (the event does not fire reliably between `file://` documents); on a change it applies the state (scrolls instantly with `behavior: "auto"`, sets `data-tp`, sets the Rasamoa image) without writing it back. `?sync=0` disables both writing and following. So driving either OBS source's Interact window, or a browser tab on the same origin, moves both canvases. Wrap every storage access in try/catch (private windows, blocked storage).

URL params read once on load: `stage=<n>` or `#s<n>` → scroll there instantly (`behavior: "auto"`) before the lamp animation (the synced state's `stage`, if present and newer than 10 minutes, wins over both; its `tp` is not applied at load, only its `tpSeq` is adopted); `presenter=1` → presenter on; `tp=0` / `tp=1` → talking points off/on (defaults: on in landscape, off in vertical); `layout=` per §3; `auto=1` → Rasamoa autoplay; `sync=0` → no sync. On every stage change `history.replaceState(null, "", "#s<n>")`.

`obs-landscape.html` and `obs-vertical.html` at the repo root are two-line shims: `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=index.html?presenter=1&layout=landscape">` (and `…&layout=vertical`). They exist so an OBS browser source in local-file mode can carry the query string.

Stream mode (`?stream=1` → `html[data-stream="on"]`, set on both OBS sources): the page leaves room for the stream webcam and chat. Landscape: the left 480 design px (the rail, 640 real px on the 2560x1440 canvas) are reserved: webcam 640x360 real at the top-left, the chat column 640x1080 real below it; `.head` starts at 480, stages pad 520 on the left, frame stages are 848 | 40 | 416, no-frame stages 904 | 40 | 360, glossary 1200. Vertical: the top 480 px are reserved for the webcam band; the header starts at 480 and stages pad 624 on top; the monitor is 648 wide (520 under `is-tight`, 432 under `is-tighter`). The earlier bottom-right webcam safe area no longer applies in stream mode. A second fit step, `is-tighter` (landscape body 22px, title 48px, prompts 20px; vertical body 28px, title 52px), is added when `is-tight` still overflows; only after that does the page warn.

Theme (`html[data-theme="jungle"]`, default; `?theme=none` restores the plain navy stage; never in control mode): the stage colours shift to a lagoon teal set (`--stage #123F3A`, `--stage-deep #0C2F2C`, on-stage text `#E6F2EC`) and `body` carries `assets/jungle-landscape.svg` / `assets/jungle-vertical.svg` as a cover background (designed by Astra from `design/jungle-brief.md`; edge art only, safe zones in that brief). The rail turns transparent so the waterfall shows; in stream mode the chat column (x 120–480 design px) keeps a 92% dark overlay so chat text stays readable. The talking-points box gets a 72% dark fill.

Graphics-first stream layout (amendment 2026-10-16, user: "make the on-screen graphics much bigger than the text; the text is guideposts"): in stream mode, stages with a frame or a stat tile get `.stage--gfx` (the stat tile is moved out of the card into `.side` at load). Landscape: graphic 1100 wide centred on top (stat tiles on a cream panel), card below as a full-width strip with a 36px title and 20px bullets in three columns; no-graphic stages centre a 1000px card with 24px bullets. Vertical: graphic full width on top, 26px bullets below; no-graphic stages 32px. Fit steps shrink the graphic (896/736 landscape; 82%/68% vertical) and the bullets.

Talking points (amendment 2026-10-16): the presenter's prompts are never rendered on the canvases or the public page (`.tp` and the toggle are hidden); they appear only in the control dock's prompter. `T` is inert; the `tp` state field is kept for compatibility.

Narrow layout (`html[data-layout="narrow"]`, §3 rule 3; a reading layout for phones and small windows, never used by OBS): `html { font-size: 16px }`; `.rail` hidden; `.head` is `position: sticky; top: 0; height: 56px; background: var(--stage-deep)` with the lamp, "VOD", the timecode (28px) and counter (16px) on one line, 16px right padding and 104px left padding (clears the fixed jw-back pill); `.stages` has no snap and no fixed height (`height: auto; overflow: visible`); `.stage` is `height: auto; min-height: 0; display: block; padding: 20px 16px 32px`; `.card` full width, `padding: 20px`, title 28px, body 17px/1.5; `.side` stacks below the card, `gap: 16px`; `.monitor` 100% wide and never dimmed; stat svg text 36 units; `.tp` always shown inline (title 16px, list 16px/1.45); `.glossary` is one column (KR, romanised and gloss stacked per row, 16px); `.dots` and `#tp-toggle` hidden; keyboard handlers still work; sync still works. Verifier checks 390x844, 844x390 and 1100x800: no horizontal scroll, every image contained, no stage overlapping the next.

## 10. Accessibility
Visible focus rings on dots and links (2px `--gold`, offset 3px). `aria-current="true"` on the active dot. Every `img` has `alt` from the manifest. Colour contrast: `--ink` on `--card` and `--on-stage` on `--stage` both exceed 7:1; `--gold` on `--stage` exceeds 4.5:1 for the 20px+ sizes used.

## 11. Files
```
index.html  style.css  app.js  obs-landscape.html  obs-vertical.html
images/*.jpg  images/manifest.json  assets/walrus.png  assets/palm.png
```
`assets/` PNGs are not used by the page (they are the brand files every repo carries); include `<link rel="icon" href="assets/walrus.png">`.

## 12. Prohibited
Numbered eyebrows ("01 / Mordum"), all-caps labels (the three-letter "VOD" is the one exception), middle-dot meta strings outside the title kicker, hover effects, gradients, drop caps, icons other than the footer's, emoji, parallax, scroll-linked effects, auto-advance of stages, a sticky "scroll down" chevron, any text not in the outline.
