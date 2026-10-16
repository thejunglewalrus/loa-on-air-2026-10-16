# Plan: Lost Ark On Air 2026-10-16 stream-segment summary page

## Context

Source: the 2026-10-16 19:00 KST "[Live] 로스트아크 On Air" broadcast (https://www.youtube.com/live/wZ0rwJWBLec, 2h01m, 1080p, no chapters), transcript at `Downloads\[Live] 로스트아크 On Air l 2026.10.16 19 00.txt`. The first ~30 min is a waiting screen; the talk runs 00:29:57 to 01:56:50. The speaker is **Gold River (금강선)**, the former Lost Ark director and the best-known figure in the game's history to the Western audience, appearing at director **Jeon Jae-hak (전재학)**'s request to take over communication after the Mordum Extreme fallout. He is not CCO (he is making a single-player game) and the director stays in post. **Name convention for the whole page: "Gold River" on first mention with 금강선 in parentheses, "Gold River" thereafter; never the romanised "Geum Kang-sun".**

Deliverable: one English HTML page the user reads on stream as a segment, then leaves up for viewers. Decisions already made with the user:

| Decision | Choice |
|---|---|
| Format | **Stage sections**: one full-viewport stage per topic, scroll-snap + keyboard nav, 1080p-readable |
| Destination | **New Pages repo** `Projects\loa-on-air-2026-10-16` → `https://thejunglewalrus.github.io/loa-on-air-2026-10-16/`, jw-back only |
| Voice | **Faithful summary + separate talking-points box** per stage |
| Graphics | **Charts + Rasamoa screenshots + one hero shot** from the VOD (~10-14 frames) |
| Workflow | Fable authors content + design (per memory `fable-designs-subagents-build`); Codex Astra + Claude creative review **before** build; Opus builds with zero creative latitude; Astra + Claude review **after**; Fable triages fixes |

Standing conventions that apply: commit as `thejunglewalrus <thejunglewalrus@gmail.com>`; commit/push only on the user's go; official Western class/raid names (check `kr-patch-digest/reference/translation-conventions.md` and memory `reference_lostark_*`); jw-back snippet from `Projects\thejunglewalrus.github.io\snippets\jw-back.html` verbatim; no jw-badge (page ends with the standard footer link row).

---

## Phase 0: Workspace

1. Create `C:\Users\PandaPanda\Projects\loa-on-air-2026-10-16\` and call `mcp__ccd_directory__change_directory` on it (session currently sits in an app scratch folder). Do not `git init` until the page is verified; `main` only, no branch prompt.
2. Layout:
```
index.html  style.css  app.js
images/            VOD frames (jpg, 1920w) + manifest.json {file, timecode, caption}
assets/            walrus.png, palm.png (copy from kr-patch-digest/assets/brand/)
content/outline.md design/spec.md      ← Fable-authored inputs to the builder
reviews/           astra-pre.md claude-pre.md astra-post.md claude-post.md triage.md
scripts/grab-frames.ps1
README.md
```

---

## Phase 1: Content outline (Fable writes `content/outline.md`)

Twelve stages plus a glossary. Every bullet below maps to a transcript timestamp; the builder copies this text, it does not rewrite it. Numbers are the speaker's own. Items marked **[verify]** are names the auto-transcript garbled; resolve against memory/conventions before build, and if unresolvable render the Korean with "(name unclear in audio)".

**S0 Title** — "Gold River returns: the Mordum emergency broadcast". Kicker line: the stream title, 2026-10-16 19:00 KST, link to VOD, "Summary, not a transcript. Timestamps link to the VOD."

**S1 Why he is on camera** (00:29:57-00:34:05)
- Apologises for the Mordum Extreme disappointment. Director Jeon came to him this week: hard to set direction, and every broadcast piles up new misunderstandings. Gold River offered to front communication; director remains, Gold River is not CCO and is building a single-player package game.
- Planned 2-3 weeks of prep, but reading the community he saw resignation rather than anger and judged the week could not be allowed to pass ("my rock-bottom antenna went off"). Lost sleep over the materials the night before.

**S2 Mordum Extreme: what went wrong** (00:34:25-00:42:00) — frame: DPS-gap-by-raid chart
- Purpose: defend the off-season between Act 3 and the Finale with an Extreme release.
- The raid is a fixed-form fight where some classes land DPS far more easily; class disparity (유불리) was known to the dev staff, not a surprise.
- Chart shown: DPS gap spiked at Act 3 (he cites "over 20%", exact figures to be brought later), narrowed through Act 4, the Finale, Serca **[verify]** and Belgardin **[verify]**; Belgardin is the closest to the devs' intent.
- The director meant to "draw a line" at one level; it was drawn higher, so with disparity some classes could not clear at all. "Wrong from the first button."
- Then the dilemma: nerf and you wound those who already cleared; don't and you abandon the intent. Golden time passed before the late nerf. Balancing just Mordum felt petty, so they shipped on the stated line instead.
- Next week's Finale is the open worry: it should sit above Mordum but tuning it is now a no-win.

**S3 Mordum: the decisions** (00:42:50-00:48:20) — stat tile: clear rate 3.47% → 33.09%
- **No extension.** His call, he will take the heat; extend-then-nerf-again is "playing games with live ops".
- **No further nerfs.** Pre-nerf clear rate 3.47%; post-nerf 33.09% as of last night (~10x). Still not what the director wanted, but nerfing again "wounds the first-wave players twice".
- The current event continues as is.
- Finale next week: similar to or slightly above Mordum; structure should produce less disparity; first-wave veterans may clear faster.
- "Draw a line" was the wrong wording. The purpose and the exact difficulty target should have been said plainly. Apology for the loss players felt.

**S4 Balance, Ark Grid, synergy, supports** (00:48:19-00:55:55)
- Balance has been a problem for 8 years; he shares responsibility.
- Ark Grid made balancing harder; the "free setups" it promised are not really happening. Whether balancing through Ark Grid even works needs review, with a clear direction this winter.
- Synergy will be sorted. Crit overcap (과치적 — crit rate past 100% going to waste) to be fixed quickly; already being looked at; "won't make you wait long".
- Supports: first pick a direction. Either lower raid dependence on supports, or, if raids keep this design, raise the support floor (easier buff and brand upkeep). Support fatigue and dependence are high; an adjustment is likely.
- If balance cannot be fixed, consider a system-level safety net for disadvantaged classes. Explicitly **not** class-change tickets; something adjustable at roster level.
- No balance patch before the Finale (01:37:18).

**S5 Raid direction** (00:56:00-01:02:15)
- Chat sentiment he read back: "raids are fun, fatigue is too high", "good up to Bel/Namhae" **[verify]**.
- Dev raid craft has improved: more DPS windows, far less of the old unpleasantness.
- Act 2 (both gates of Narok **[verify]** and Abrelshud) was where many mid players broke off; the data showed it.
- "Honest opinion": maybe Mordum Extreme should not have been released at all, only the Finale. But Mordum/Armoche-style challenge raids are still a direction worth pursuing, with Ark Grid-valid setups prepared alongside, not raid and systems built in isolation. Rehashed content is a problem; winter will not be a rehash.
- Legion-style raids continue: more DPS time, fewer self-copy mechanics, fixed-form and scroll-type experiments, unpleasantness removed.

**S6 Communication plan** (01:02:18-01:08:15, 01:33:51-01:35:00, 01:38:50-01:39:40)
- Official broadcast "Is Lost Ark OK as it is?" (로아 이대로 괜찮은가, 로이겐) in about two weeks (~Oct 30), before the Nov 7 8th anniversary. Gold River as MC asking questions; director Jeon, math team lead Kim Sang-bok and a third lead **[verify: "병탁"]** answer for what is being built and why.
- A "communication parade" from today through LOA ON Winter, not one big reveal. Next time the actual developers answer directly, "no evasive moves".
- The director fears live talk because phrases get misread ("the line", "Aldebaran is side content"); Gold River speaks for him until then.
- Not hiding behind winter; live service means changes land while running.
- Leadership: changes may come. Not looking for a new director, but an area adjusting leadership may appear.

**S7 Economy** (01:17:00-01:26:00, 01:52:12) — frames: gold-value chart, population-split chart; stat tile: package gold share 2.65%
- Gold value is falling in sharp steps, not a gentle slope (chart).
- Root cause is content supply cadence: each new raid has to pay more than the last (100 → 150/200), so with raids every 3 months the supply standard scales fast while sinks lag, because adding sinks when the game already feels expensive is frightening.
- The economy breaks one beat later: when a scaled-up supply becomes easy to farm at a low cut-line.
- Packages matter less than people think: package-sourced gold peaked at 2.65% of all gold produced (he will bring the data).
- Plan: raids on roughly a 6-month cadence (Kazeros line, the next Shadow raid, another raid type), finer reward scaling, horizontal non-raid content between. Raid and non-raid populations used to be about half and half; mid-tier players have fallen off under cost, difficulty and pace (chart shown).

**S8 Nice-dan (same-class alt rosters)** (01:09:36-01:16:56) — frame: nice-dan share chart; stat steps 1% → 6% → 17.8%
- In his era around 1%, people who genuinely wanted several of the same class. Summer 2024 (Season 3 start) about 6%, triple; now 17.8%.
- Should have acted when it climbed 2.1 → 6 → 10%; that was the golden time.
- Root cause: gem cost. An RPG that effectively tells you to play the same character many times is odd; not a play they want to encourage.
- Winter: a clear company stance, then adjustment. Not a hard reset, not "eradication"; flexible, value-protecting, mainly through gem-related changes that stop rewarding nice-dan going forward.

**S9 Aldebaran Sea and Rasamoa** (01:26:03-01:31:30) — frames: 3-5 Rasamoa screenshots
- The delay was not because it is "side"; the director was separating end from non-end content and the word landed badly. Apology to story players.
- Real reason: scale-up. Rasamoa is the last and largest major city in the setting, interiors fully dressed, visual upgrades, Sergaton content attached, more islands than a summer release could have had.
- Screenshots shown, exterior and interior. "No AI was used."

**S10 Six-character gold limit, new class, engine** (01:31:36-01:33:05, 01:43:39-01:44:20, 01:49:36-01:51:08)
- The 6-character limit was valid for economy and mid-tier gaps, but now throttles the momentum of raising new classes. Winter: a definite adjustment, not a simple lift; tied to economy checks and new-character growth incentives.
- New class: December, on schedule, "one many of you asked for". He suggests the summer/winter new-class cadence itself should be reconsidered so the broken things get fixed first.
- Engine and QoL in winter: deferred lighting, DLSS, party finder work; the team is saying too little before "ta-da".

**S11 Rapid-fire from chat** (01:37:40-01:53:30)
- QA team exists and is sizeable; testing this time was clearly insufficient.
- Headcount: OBT 2018-11-07; +15 by his exit (~Jun 2021); +57 by Dec 2025; 3-4 fewer this year, flat. Investment is not being withheld; direction is the issue, not people. Staff are working long hours.
- Server transfer: could not verify, will answer next time. Guild content requests noted.
- "In-game is a party" meme: devs cannot laugh at it; make it true.
- MMO traffic should be a wave, not a cliff; a wave needs off-ramps and on-ramps.

**S12 Closing** (01:53:37-01:56:50)
- All dev leads next time; broadcasts continue through LOA ON Winter, good news or bad. Finale is the next anxiety. Ends on the Rasamoa BGM.

**Glossary stage** — 금강선 (Gold River), 나이스단, 로이겐, 육회제한, 유불리, 선 긋기, 과치적, 종막, 고봉밥, 인게임이스파티, 재탕. KR term, romanisation, one-line gloss.

After approval, save a memory (`reference_lostark_gold_river`): 금강선 = "Gold River" to the Western community; never romanise.

**Talking points** (one box per stage, 2-3 prompts, written for the streamer's EN audience): e.g. S3 "Would you have taken an extension over a third nerf?"; S7 "Does a 6-month raid cadence fix the economy or just slow the bleed?"; S8 "17.8% nice-dan: is that a player problem or a gem-price problem?". Fable writes all of them in the outline.

---

## Phase 2: Design spec (Fable writes `design/spec.md`, builder follows it exactly)

**Concept** — a broadcast control room. The memorable element is the **timecode spine**: a fixed left rail showing the live VOD timecode that rolls to each stage's timestamp as the user advances, with a red on-air lamp. Everything else stays quiet. Summary text sits on light **cue cards** on the dark stage so it reads from across a room at 1080p.

**Tokens**
- Colour: stage `#131B30` (night navy, deliberately blue, not tinted black); stage-deep `#0C1222` (vignette edge); card `#F4EEE1` (warm cue-card paper); card-ink `#1A1F2B`; muted-ink `#5B6274`; on-air red `#E2473F` (lamp + timecode only); walrus gold `#C8A45C` (hairlines, stage marks, matches jw-back); link `#6EA8FF`.
- Type: **Barlow Condensed** 600/700 for timecodes, stage titles, stat numerals (tabular-nums); **Source Serif 4** 400/600 for card body and talking points, 1.5 line-height, ≤72ch; **Noto Sans KR** fallback for Korean glyphs. Google Fonts, exact versions in `<link>`. Scale at 1080p: title 64px, body 26px, talking points 22px, timecode 48px.
- Layout per stage (100vh, scroll-snap `y mandatory` on the scroller):
```
┌─────────────────────────────────────────────────────────────────────┐
│ ● ON AIR  00:44:11            [jw-back top-left]        03 / 13    │
│ ┃                                                                   │
│ ┃   ┌──── cue card (max 72ch) ────────┐   ┌──── monitor ─────────┐ │
│ ┃   │ Mordum: the decisions           │   │  VOD frame           │ │
│ ┃   │ • No extension                  │   │  caption · 00:36:58 ↗│ │
│ ┃   │ • No further nerfs              │   └──────────────────────┘ │
│ ┃   │ [3.47% → 33.09%] stat           │   ┌ talking points ─────┐ │
│ ┃   └─────────────────────────────────┘   │ • …  • …            │ │
│ ┃                                         └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```
  Left-aligned text throughout. Stages with no frame: card widens to ~84ch, talking points sit below it. Glossary stage: two-column definition list on one wide card. Below 1100px: single column, rail collapses to a top strip.
- Stat tiles (S3, S7, S8, S11 headcount): inline SVG bars per the `dataviz` skill; gold for the emphasised value, `#3A4460` for the rest; labels in Barlow Condensed; no gradients, no donuts.
- Monitor: the frame image inside a 2px gold hairline with a 4px dark bezel; caption shows the timecode as a link to `?t=<sec>` on the VOD.

**Motion (the one orchestrated moment plus state changes)**
- Load: lamp turns on (opacity 0→1, 180ms), then the timecode counts from 00:00:00 to the first stage's time over 700ms `cubic-bezier(.2,.7,.2,1)`. Nothing else animates on load.
- Stage change (IntersectionObserver ≥0.6): timecode digits roll to the new time, 420ms same curve; the stage's monitor un-dims (opacity .55→1, 260ms). Cards never fade or slide.
- Stat tiles count up once on first view, 600ms, then stay.
- `prefers-reduced-motion`: all of the above become instant.
- Keyboard: ArrowDown/Right/PageDown/Space = next stage; ArrowUp/Left/PageUp = prev; Home/End; `T` toggles talking points; `P` presenter mode hides jw-back, progress dots and the lamp caption. A dot rail (13 dots, right edge) is clickable and keyboard-focusable; visible focus rings everywhere.
- Explicit instruction to the builder: no other animations, hover effects, gradients, numbered "01/02" eyebrows (stage numbers appear only in the "03 / 13" counter), all-caps labels, or middle-dot meta strings.

---

## Phase 3: Frame capture (scripted by Fable; `scripts/grab-frames.ps1`)

Tools present: `C:\Bin\yt-dlp.exe`, `ffmpeg`, Deno (needed for 1080p). Section downloads avoid pulling the 2h VOD:
```
yt-dlp -f "bv*[height<=1080][ext=mp4]" --download-sections "*00:36:35-00:37:45" --force-keyframes-at-cuts -o "clips/dps.%(ext)s" "https://www.youtube.com/watch?v=wZ0rwJWBLec"
ffmpeg -i clips/dps.mp4 -vf fps=1/4 -q:v 2 frames/dps_%02d.jpg
```
Windows (from transcript cues, ±15s padding): hero 00:29:55-00:30:20; DPS gap 00:36:35-00:37:45; nice-dan 01:10:05-01:10:50; gold value 01:17:45-01:18:45; population 01:24:15-01:24:45; Rasamoa 01:29:35-01:31:10 (sample every 6s); package share 01:52:00-01:52:35. Fable (or Opus) `Read`s the frames, picks the cleanest of each, crops webcam/overlay if the graphic is a slide, writes `images/manifest.json`. If YouTube demands sign-in, fall back to `--cookies-from-browser firefox` (memory `reference_yt_dlp_browser_cookies`). Any graphic that turns out not to be on screen becomes a rebuilt SVG stat instead; never fabricate a frame.

---

## Phase 4: Pre-build creative review (in parallel)

- **Astra**: `codex exec --sandbox read-only -C <repo> "Creative review…" > reviews/astra-pre.md` (codex-cli 0.155.1 on PATH, model gpt-6-astra). Prompt: the brief above, `design/spec.md`, `content/outline.md`; ask for a studio-style critique of concept, hierarchy, 1080p legibility on stream, motion restraint, anything that reads as a template; return numbered findings with a keep/change verdict each. Fallback if the runner breaks: pipe a bundle on stdin per memory `codex-exec-review-inline-bundle`.
- **Claude**: `Agent` (opus, fresh) with the same brief and files, independent of Astra's output.
- Fable writes `reviews/triage.md`: accept/reject per finding with one-line reasons, updates spec/outline. Spec edits here are the only place the design changes before build.

## Phase 5: Build (delegated)

- **Opus** builds `index.html`, `style.css`, `app.js` from `design/spec.md` + `content/outline.md` + `images/manifest.json`. Brief states: zero creative latitude, every token and timing is pinned, load `dataviz` for the SVG stat tiles, paste jw-back verbatim after `<body>`, standard footer from `kr-patch-digest/assets/patch.template.html` (source line points at the VOD), copy brand PNGs into `assets/`. No frameworks, no build step, vanilla JS.
- **Sonnet** (parallel, read-only on content): verify every KR→EN name in the outline against `translation-conventions.md` and the `reference_lostark_*` memories; return a table of confirmed/unresolved terms for the glossary and the **[verify]** items.
- **Haiku** (after build): HTML validity pass, broken-link/asset check, confirm every `?t=` link matches its stage timestamp, write `README.md` (live URL, what the page is, keyboard keys).

## Phase 6: Post-build review and fixes

- Serve `python -m http.server 8765 --bind 127.0.0.1` from the repo, open in the built-in browser at 1920×1080, screenshot each stage into `reviews/shots/`.
- **Astra** post-review: same codex invocation, now over `index.html`/`style.css`/`app.js` plus the screenshots (list paths; it can read images) — critique against the spec and for stream legibility. **Claude** (opus) does the same independently.
- Fable triages into `reviews/triage.md`; one-line fixes applied inline by Fable (memory `inline-small-fixes`), larger ones sent back to the Opus builder.

## Verification (before telling the user it is done)

1. At 1920×1080: all 13 stages snap cleanly; timecode rolls on each change; `T`, `P`, arrows, Home/End, dot rail all work; focus rings visible.
2. `prefers-reduced-motion` emulation: no animation, timecode jumps.
3. 1100px and 390px widths: single column, no horizontal scroll, images contained.
4. Every VOD timestamp link opens the right moment (spot-check 5).
5. Every number on the page traces to a transcript line (Fable re-reads the outline against the transcript once).
6. Fonts load (network tab), no console errors.
7. Then `git init`, commit as thejunglewalrus (one commit), and stop: push + GitHub Pages enable only when the user says go.
