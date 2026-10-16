# Waterfall redraw review

Replaced the smooth column with a mossy basalt cleft and two offset waterfalls. Irregular water sheets sit between dark angular boulders with cool facets; a shallow middle ledge catches the upper fall before the second drop. Thin cream brink highlights, broken water channels, foam crowns, outward spray, expanding ripples and soft mist give it scale without making a bright wall beside chat. Portrait uses independently drawn short, broad proportions rather than a vertically crushed landscape asset.

Only the waterfall gradient, waterfall clip/definitions and group, and the foam/mist/splash replacement area inside the shoreline were edited in each SVG. The unchanged original pool ellipse stays in place. A clipped internal reuse of the lower drop and mist keeps the water connected across the shoreline's paint order. No commit was made.

## Counts and motion

| SVG | Bytes | XML elements | Authored SMIL nodes | Direct animated targets | SMIL / targets including reused instances |
| --- | ---: | ---: | ---: | ---: | ---: |
| Landscape | 41,423 | 435 | 31 | 20 | 39 / 25 |
| Vertical | 35,437 | 388 | 31 | 20 | 39 / 25 |

Counts include the unchanged torch (one opacity animation and one target); XML counts include definitions. Internal `<use>` references add two lower-drop flow instances and three mist instances at the shoreline, so even conservatively counting those gives 39 animation instances on 25 animated targets per file. There is one `feGaussianBlur` per file, stdDeviation 3, used only for mist. No raster image, script, external reference, or CSS animation was introduced.

Each tier has 26 streaks: 13 in the back layer and 13 in the front layer. Each layer's tile is reused at offsets 0 and H, with translation from -H to 0, linear, indefinitely. H is 560 in landscape and 64 in portrait; periods are 2.4s and 1.4s. Foam pulses over 0.96-1.28s, spray arcs over 1.08-1.25s, two staggered ripples expand over 2.5s, and three staggered mist ellipses rise 24 units over 4.6-5.6s. Only groups/effects animate; streaks are batched into paths.

## Preservation and geometry

Both files parsed with lxml. All IDs are unique and prefixed, every URL/href reference resolves, and every authored animation is descended from `.jungle-anim`. Both original SVGs were snapshotted before editing. Replacing only the explicitly owned regions with markers leaves byte-identical strings before/after; this covers the base, fronds, flowers, brink tufts, shoreline, pool ellipse, shells and torch. Original line endings are retained.

Bounds are enforced after transforms and filter output by absolute user-space clipping:

- Landscape main waterfall: [16,108] x [56,1030]. Shore effects: [16,140] x [1000,1030], intersected with the unchanged shore clip. Thus x>=112 above y1000 cannot receive any new pixels. Clipping also contains the spray arcs and blurred mist at all animation times.
- Portrait main waterfall: [0,140] x [1700,1840]. Shore effects: [0,140] x [1800,1840], intersected with the unchanged shore clip.
- For each CSS cover scale `s=max(viewportWidth/viewBoxWidth,viewportHeight/viewBoxHeight)`, these rectangles map by `(sx+offsetX,sy+offsetY)` with the same centered offsets as the background; no separate screen-space decoration can escape them.
- The required unchanged turquoise pool ellipse is an inherited exception: center (83,1038)/(83,1838), radii (70,17), so its existing bounds reach x153 and y1055/y1855. It was not resized to the new-art rectangle, because preserving it was explicit. No new art extends to those inherited limits.

Rendered the new artwork in isolation against black at t=0, .37, .87, 1.39, 2.39, 4.4 and 5.1 seconds. A per-row pixel check found no new pixels outside the allowed rectangles, including blur and splash.

## Render and animation verification

Headless Microsoft Edge rendered full 1920x1080 landscape and 1080x1920 portrait images, plus the landscape x0-200 crop and portrait x0-200/y1620-1920 crop. Full views and enlarged crops were visually inspected. The portrait initially lost its bottom continuation behind the unchanged shoreline; the clipped lower-drop reuse fixes that connection. The final pass also introduced broken darker water channels and kept bright cream to small accents.

Paused SVG time samples at .37s and .87s confirmed all four translations increase downward: landscape back +116.667px / front +200px; portrait back +13.333px / front +22.857px. Each flow layer was checked immediately before/after its 1.4s or 2.4s loop boundary. Identical paired tile references guarantee the periodic geometry. Separate live screenshots of a CSS `background-image` with centered `cover`, about .5s apart, show moving water in the actual consumption mode.

Reduced-motion checks: page-level emulation hides all `.jungle-anim` groups in standalone SVGs and yields identical frames. Edge's page-level emulation does not propagate into SVG CSS-image documents in this harness. Launching Edge with `--force-prefers-reduced-motion` makes both CSS backgrounds pixel-stable across .5s, and each is pixel-identical to the standalone static fallback. The existing embedded media-query style was preserved. This is a Chromium render check, not an OBS performance measurement.

Landscape verification: static rail mean grayscale 126.01 before / 85.59 after (0-255); maximum loop comparison mean channel delta 0.045245/255. This is an image brightness sanity check, not a photometric luminance measurement.

Vertical verification: static rail mean grayscale 105.31 before / 83.36 after (0-255); maximum loop comparison mean channel delta 0.000600/255. This is an image brightness sanity check, not a photometric luminance measurement.

## Screenshot paths

All paths are under `C:/Users/PandaPanda/Projects/loa-on-air-2026-10-16/reviews/shots/waterfall`.

- [landscape-full.png](shots/waterfall/landscape-full.png)
- [landscape-crop.png](shots/waterfall/landscape-crop.png)
- [landscape-zoom.png](shots/waterfall/landscape-zoom.png)
- [landscape-motion-0.37.png](shots/waterfall/landscape-motion-0.37.png)
- [landscape-motion-0.87.png](shots/waterfall/landscape-motion-0.87.png)
- [landscape-reduced.png](shots/waterfall/landscape-reduced.png)
- [landscape-css-background-1.png](shots/waterfall/landscape-css-background-1.png)
- [landscape-css-background-2.png](shots/waterfall/landscape-css-background-2.png)
- [landscape-css-reduced-startup.png](shots/waterfall/landscape-css-reduced-startup.png)
- [landscape-before.png](shots/waterfall/landscape-before.png)
- [vertical-full.png](shots/waterfall/vertical-full.png)
- [vertical-crop.png](shots/waterfall/vertical-crop.png)
- [vertical-zoom.png](shots/waterfall/vertical-zoom.png)
- [vertical-motion-0.37.png](shots/waterfall/vertical-motion-0.37.png)
- [vertical-motion-0.87.png](shots/waterfall/vertical-motion-0.87.png)
- [vertical-reduced.png](shots/waterfall/vertical-reduced.png)
- [vertical-css-background-1.png](shots/waterfall/vertical-css-background-1.png)
- [vertical-css-background-2.png](shots/waterfall/vertical-css-background-2.png)
- [vertical-css-reduced-startup.png](shots/waterfall/vertical-css-reduced-startup.png)
- [vertical-before.png](shots/waterfall/vertical-before.png)

Machine-readable evidence: `shots/waterfall/counts.json`, `shots/waterfall/render-results.json` and `shots/waterfall/reduced-startup-results.json`. The page-level emulation result intentionally records false; the startup-preference result records the successful CSS-image reduced-motion check.
