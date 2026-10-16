You are designing an original SVG background theme, "cheery jungle oasis", for a stream page. You write the files yourself (the sandbox allows writes inside this repo). Deliver exactly these files and nothing else:

1. `assets/jungle-landscape.svg` — `viewBox="0 0 1920 1080"`, `preserveAspectRatio="xMidYMid slice"`.
2. `assets/jungle-vertical.svg` — `viewBox="0 0 1080 1920"`, same attribute.
3. `design/jungle-notes.md` — 15 lines max: the palette you used (hex), where each element sits, and anything the page's CSS should know (for example the colour to use for text panels so they still read).

Read first: `design/ref/jungle-frame-README.md` (the stream's art programme), `design/ref/JF-08-watercolor-lagoon.md` (the oasis angle this theme belongs to), `design/spec.md` §2 (the page's current tokens) and §5–§6 (the layouts). The attached images are the stream's existing jungle frames (a golden canopy and a pixel-art ruin): match their spirit (edge art, open middle, cheery) but do not copy them, and do not use pixel art.

## What it is for

The page shows cream text cards (`#F4EEE1` paper, ink `#1A1F2B`) on a dark stage, read aloud on a Twitch stream, plus a translucent gold-bordered "talking points" box. The theme replaces the stage background. The art must stay on the EDGES: the middle of both canvases carries the cards and must be a calm, dark, low-detail fill so the cream cards pop and the gold box stays legible.

## Mood and palette

Cheery daylight oasis, vacation light, tiki-bar warmth. Use this palette (you may add one or two tints of these; no greys, no black outlines):
- turquoise `#2BB3A3`, aqua `#8FE0D6`, deep lagoon `#1F7A6B`, dark lagoon `#123F3A` (the stage fill), night lagoon `#0C2F2C` (rail/header fill)
- sand cream `#F4E7CF`, coral `#F27C6A`, hibiscus pink `#FF8FA3`, palm green `#4E9E57`, leaf light `#7FD07C`, sunlit gold `#F2C66B`, bark `#8A5A3C`

The whole-canvas base is a vertical gradient from dark lagoon at the top to a slightly deeper teal at the bottom, with a soft, large, low-contrast sun-glow (radial, `#F2C66B` at ≤8% opacity) near the top-right. That base is the stage; the cards sit on it. Keep everything in the middle region under 6% luminance variation.

## Safe zones (must stay base-fill only, no art, no bright shapes)

Landscape (1920x1080 units):
- Header strip y 0–96 across x 112–1920: the red timecode and the counter live here. Only very low-contrast canopy shadow allowed here (≤12% opacity), nothing bright.
- Content area x 112–1840, y 96–1000: NOTHING. Cards and the talking-points box occupy it.
- Left rail x 0–112, full height: this is where the WATERFALL lives (see below). Note: in the stream layout the left column widens to x 0–480 and carries the webcam (top) and a chat overlay (chat text in white over the background) — so x 112–480 must stay plain dark fill, and the waterfall must stay within x 0–112.
- Bottom band y 1000–1080, full width: shoreline art allowed. Nothing above y 1000 except the waterfall column.
- Right strip x 1840–1920: a thin fringe of hanging fronds is allowed from y 96 down; keep it inside x 1850–1920 so the dot navigation at x 1892 can still be seen (dots are 12px gold circles; fronds behind them are fine if not gold).
- Top corners (x 0–112 and x 1840–1920, y 0–96) may hold frond tips.

Vertical (1080x1920 units):
- Header strip y 0–128 (and in the stream layout the top y 0–480 is covered by a webcam band): only low-contrast canopy shadow in y 0–128; whatever you put in y 128–480 will be hidden by the cam in stream mode, so keep that region plain too.
- Content area x 48–1032, y 128–1800: NOTHING.
- Side strips x 0–48 and x 1032–1080: thin fronds / vines allowed.
- Bottom band y 1800–1920: shoreline, pool, a small waterfall at the lower-left corner (it may rise to y 1700 but only inside x 0–140).

## The elements (all edge-hugging, cheery, simple vector shapes with soft gradients, no outlines)

- A WATERFALL: landscape, a narrow white-aqua cascade running down the left rail (x 20–95) from y ≈ 60 to a small turquoise pool at the bottom-left, with foam highlights in sand cream and two or three mist arcs; vertical, a shorter cascade at the lower-left corner into the shoreline pool. Give it gentle animation ONLY with SMIL (`<animate>` on 2–3 opacity/translate attributes, 3–6 s, `prefers-reduced-motion` is handled by the page: wrap animated nodes in a `<g class="jungle-anim">` so CSS can pause them).
- Palm fronds and broad leaves hanging into the top corners and along the right strip, palm green / leaf light, with one coral hibiscus and one hibiscus-pink bloom at the top-right corner.
- Bottom shoreline: turquoise water with a few wobbly sand-cream reflection strokes, a sand curve coming in from the lower-right, three small shells, a tiki torch (bark post, sunlit gold flame) at the bottom-right corner, flame animated like the waterfall.
- Optional: one tiny toucan silhouette on a frond at the top-right, no bigger than 60 units. No other animals, no people, no text, no walrus.

## Technical

- Pure SVG, no raster, no external references, no fonts, no filters heavier than one `feGaussianBlur` for the glow; keep each file under 120 KB; ids unique per file (prefix `jl-` and `jv-`).
- The SVGs will be used as CSS `background-image` with `background-size: cover` and also must look right if the page is slightly cropped at the edges, so keep critical shapes ≥16 units inside the edges.
- Also render a quick mental check: on the landscape canvas a cream card 1000 wide sits at x 152, y 112; the art must not touch it.

When done, list the three files with sizes and a one-paragraph description of the scene. Do not modify any other file.
