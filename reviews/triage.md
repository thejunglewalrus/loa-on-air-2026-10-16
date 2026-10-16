# Triage and rulings ledger

Plan: `design/plan.md` (copied from `~/.claude/plans/c-users-pandapanda-downloads-live-on-ai-functional-pretzel.md`). This file records every decision taken while executing it, and the accept/reject verdict on every reviewer finding.

## Rulings made while executing the plan

1. **Ruling: 종막 is rendered "Denouement", not "Finale"** — the game's English string table (`GameMsg_English`: "Denouement: Final Day", "Kazeros Raid Denouement") and the 2026-09-18 convention both say Denouement; the plan's "Finale" was the older house term. Cost if wrong: a word swap.
2. **Ruling: 아브렐슈드 is rendered "Brelshaza"** — the string table has "Act 2: Brelshaza" (`sys.contentstatus.kazeroth_awake_abrelshud`); the conventions file's "Avrelshud" example is an older working spelling. Cost if wrong: a word swap.
3. **Ruling: stage order follows the VOD** (nice-dan at 01:09 before economy at 01:17), so the timecode spine never rolls backwards. The plan listed economy first. Cost if wrong: none (content identical).
4. **Ruling: long topics are split into "(1)" and "(2)" stages, 21 stages total instead of 13** — a 300-word card does not fit one 1080p viewport at 25px, and certainly not 1080x1920 at 36px. Cards are capped at ~150 words. Cost if wrong: more stages to step through on stream.
5. **Ruling: the package-gold share (2.65%) is a stat tile only** — the VOD shows no slide at 01:52 (he reads it off the laptop; frames checked). Never fabricate a frame. Cost: none.
6. **Ruling: nice-dan tile uses the chart's figures (2.1 / 6.0 / 16.0 / 17.8)** — his spoken "2.1 → 6 → 10%" is kept as his words in the bullet; the chart on screen says 16.0% for summer 2025. Cost if wrong: the bullet already carries his wording.
7. **Ruling: "team lead Kim Sang-bok (김상복)"** — the captions say "수학팀장" (literally "math team lead"), which is probably a mis-hearing of a division name; rendered as the neutral "team lead". The third lead "병탁" is unresolved and rendered as "(병탁, name unclear in audio)". Cost if wrong: a title.
8. **Ruling: "벨" in the chat quote = Belgardin.** The second half of that read-back ("벨과 남해까지는 좋았는데", 00:56:38) has a name the captions garbled and is dropped rather than guessed. Cost: one chat quote fewer.
9. **Ruling: a vertical layout lives in the same page** — `html[data-layout]` driven by `?layout=` or portrait orientation; the user asked for the summary to take more of the screen in vertical and for it to "render different", which this does without a second content copy. Cost if wrong: one CSS mode to maintain.
10. **Ruling: OBS browser sources use local-file mode through two redirect shims** (`obs-landscape.html`, `obs-vertical.html`) because local-file mode cannot carry the `?presenter=1&layout=` query. After the push they can be switched to the Pages URL (command in README). Cost if wrong: swap two settings.
11. **Ruling: the main OBS scene "LoA On Air" was built before the page existed** (stream offline, program on "Starting", verified via GetStreamStatus): browser source full canvas, `Main Webcam-uncropped` bottom-right 640x360, the three app-audio captures, alerts, Tangia; no chat overlay, no video boxes, no station.yaml entry. The vertical twin "V-LoAOnAir" needs the user to create the empty scene in Aitum's dock first (lab study: websocket-created V-scenes stay out of the picker until an OBS restart). Cost if wrong: one scene to delete.
12. **Ruling: the glossary card is 1240px wide and the stream webcam sits bottom-right** so the cam never covers card text in landscape presenter mode. Cost: 584px of empty stage on that one screen.

## Name resolutions (string table `GameMsg_English`, queried 2026-10-16)

| KR | EN | evidence |
|---|---|---|
| 모르둠 | Mordum | `sys.contentstatus.kazeroth_mordoom` "Act 3: Mordum"; "Mordum, the Abyssal Punisher" |
| 나르크 | Narok | `tip.name.npc_gamenote_narok`; "Frozen Fear, Narok" |
| 아브렐슈드 | Brelshaza | "Act 2: Brelshaza" |
| 세르카 | Serca | "Witch of Agony, Serca" |
| 벨가르딘 | Belgardin | `cin.12301_06_03` "Belgardin..." + conventions |
| 아르모체 | Armoche | "Armoche, Sentinel of the Abyss" |
| 종막 | Denouement | "Denouement: Final Day" |
| 라사모아 | Rasamoa | "Twilight Rasamoa", "Light of Rasamoa" |
| 세르가톤 | Sergaton | `cin.12325_06_02` |
| 알데바란 | Aldebaran | many; "Aldebaran's Garden" etc. |

## Term verification (Sonnet, string table + conventions)

- One correction, applied: 알데바란의 바다 → **Sea of Aldebaran** (`sys.contentslist.guide_story_title_2`), in the header rule, the S16 title and the S16 body.
- Confirmed: Mordum Extreme, Act 3/4, Denouement, Serca, Belgardin, Narok, Brelshaza, Armoche, Ark Grid, Kazeros Raid, Shadow Raid, Legion Raid, Rasamoa, Sergaton, Support, Brand. 보석 in the nice-dan context is the classic skill **Gem** (client string), not Ark Grid Astrogem; a parenthetical was added to S12.
- Acceptable descriptive renderings (no client string): crit overcap, six-character gold limit, first wave, class-change ticket, nice-dan, ROIGEN, LOA ON Winter.
- Unresolved and kept as hedged: "Bel" (= Belgardin; the only reading that fits the raid sequence), 병탁 ("name unclear in audio"), 김상복 수학팀장 ("team lead Kim Sang-bok", the name itself is auto-caption only). The caption's "제약 디렉터님" at 01:03:52 is a garble of 전재학 디렉터님, which supports S10's "director Jeon plus two leads".

## Pre-build review findings

Astra (`reviews/astra-pre.md`) and Claude Opus (its report, pasted into `reviews/claude-pre.md`) reviewed the outline and spec independently. Verdicts (A = Astra, C = Claude):

| # | finding | verdict | what changed |
|---|---|---|---|
| A1, C5 | Glossary overflows one viewport | accept | glossary split into S20 (6 rows) and S21 (5 rows + footer); rows for 금강선, 유불리, 고봉밥 cut (not used on the page / duplicate of the title); `is-tight` rules for the glossary |
| A2, C3 | 10px font floor breaks small viewports | accept | new `narrow` layout mode whenever the scale would hit the floor: flowing stages, no snap, single column; verifier checks 390x844, 844x390, 1100x800 |
| A3, C4 | Landscape body text too small | accept | body 28px/1.42 (25px as `is-tight`), talking points 24px, no-frame card 1080px; timecode 44px |
| A4, C6 | Attribution: paraphrases in quotes, subjectless opinion bullets | accept | box renamed "Our talking points"; quotes removed from paraphrased prompts; "He says / In his view / He argues" added to S6, S9, S14, S15; standfirst explains stages gather related remarks |
| A5, C8, C9 | Headcount tile mixes cumulative and yearly; S4 label overruns | accept | two cumulative bars + a text note for 2026; S4 label shortened to "After the nerf" |
| A6 | Vertical frames too small | accept (partly) | vertical monitor 100% width (800 under `is-tight`); translated chart labels inside the images: rejected (would mean editing his slides; captions carry the title translation) |
| A7, C7 | Bottom sheet covers content; phones have no control | accept | sheet dropped: in vertical, talking points replace the monitor while on; visible "Our talking points (T)" button outside presenter mode; prompts 36px |
| A8 | Stage emphasis (S1 role, S15 plan first, S17 split) | accept S1, S15; reject S17 split | S1 leads with "not back as director, not CCO"; S15 leads with the six-month plan; S17 stays one stage (three short announcements) |
| A9 | Timecode promise too literal | accept | "VOD" label before the timecode; standfirst says each stage gathers related remarks |
| A10, C15 | Translationese / unclear phrasing | accept | "cheap patch", "difficulty the director had announced", "build freedom", "some part of the team may get new leadership", "the window", "fixed-pattern (scripted) fight", "clone mechanics", "scrolling-stage", "low item-level bar"; October 30 → "in about two weeks" |
| A11, C17 | Loaded or duplicate prompts | accept | S2, S4, S6, S8, S11, S14, S15, S17, S19 prompts rewritten as choices or outcome questions; S19 b2 now distinct from S10 b2 |
| A12, C13, C14 | Motion: count-ups are decoration; Rasamoa cycle runs away | accept (partly) | stat tiles render static; Rasamoa advance is presenter-driven (`N`/`B`), autoplay only with `?auto=1` at 6s with caption swap at mid-fade; the timecode roll stays (it is the concept, and it rolls to real values) |
| A14, C2 | Builder gaps: box-sizing, label wrap, webcam safe area | accept | global border-box; label widths asserted; safe area x≥1440,y≥810 with "nothing in `.side` below y 800", verified per stage |
| C1 | Two OBS instances cannot stay in sync | accept | localStorage state `{stage, tp, rasamoa}` written on every action, followed by every instance via `storage` event + 250ms poll; `?sync=0` opts out |
| C10 | S12 shows the same numbers twice; "10%" not on the chart | accept | S12 is a no-frame stage with the stat tile; bullet says "(his words; his chart shows 16.0% by summer 2025)" |
| C11 | Red caption links fail contrast and smear on stream | accept | caption links `--on-stage` with a gold underline; red only for lamp + timecode |
| C12 | Lamp not beside the timecode | accept | one lamp, in the header, immediately left of "VOD" and the timecode in both layouts |
| C16 | Spec/manifest/outline disagree on small facts | accept | manifest declared authoritative; example fixed to 1400x784 and "His slide:"; hero caption "Gold River at the desk"; outline hero time 00:30:15 |
| C7 (part) | Vertical platform safe area (right rail, bottom 15%) | reject for now | target platform overlay unknown; the user's other vertical scenes reserve nothing either |
| A13, C18 | Concept, palette, hierarchy | keep | — |

## Post-build review findings

Claude Opus (`reviews/claude-post.md`) and Astra (`reviews/astra-post.md`, which ran while the Opus fixes were landing, so some of its items describe the in-between state). Verdicts:

| # | finding | verdict | what changed |
|---|---|---|---|
| C1 | Talking-points sync forced the vertical canvas on after the first landscape navigation | fix | `tpSeq` counter bumped only by an explicit T; followers apply `tp` only when it changes; load adopts the sequence but keeps the layout's own default (spec §9 amended) |
| C2 | S21 footer floated 200px below the glossary card | fix | `.stage--glossary { align-content: start }` |
| C3 | Vertical stat text too small | fix | vertical figcaption/note 28px, svg text 30 units (spec §6 amended) |
| C4 | Narrow follower could write a wrong stage back | fix | scroll-derived stage changes never write state; clamp to the last stage at the bottom |
| C5 | tabular-nums gaps in "(1)/(2)" titles | fix | dropped from card titles, title name and subtitle |
| C9 | Autoplay double-advance with two `?auto=1` instances | fix | a tick is skipped within 5.5s of a remote change |
| C10 | Narrow mode dimmed monitors; head padding deviation | fix / accept | narrow monitors never dimmed; 104px head padding recorded in the spec |
| C12 | Card-link focus ring invisible; glossary has no table semantics | fix | `.card a:focus-visible` in ink; `role="table/row/cell/columnheader"` on the glossary |
| A1 | `tpSeq` departs from the literal spec | reject | it is the fix for C1; the spec was amended instead |
| A2 | Reversing navigation mid-scroll did not cancel the scroll (and the follower kept the abandoned target) | fix | `goTo(current)` while moving re-scrolls to the current stage and writes state |
| A3 | Stale storage events and fractional indices accepted | fix | states older than the last applied `at` are ignored; `stage`/`rasamoa` must be in-range integers |
| A4 | Narrow scrolling no longer writes sync; finished nav target not cleared | reject / fix | narrow is a reading layout, never an OBS instance (C4 stands); a finished keyboard target is now cleared in narrow too |
| A5 | Korean chart labels small; narrow stat text tiny | reject / fix | his slides are not re-labelled (captions translate the titles); narrow svg text 36 units |
| A6 | S1 lacks "Gold River (금강선)" | reject | the title-stage standfirst is the first mention; outline rule reworded |
| A7 | Inactive Rasamoa images exposed to screen readers | fix | `aria-hidden` toggled with the shown image |
| A8 | Spec vs files; footer "All tools" lacks `target=_blank` | fix / reject | spec amended for the sizes and padding; the footer is the template's markup verbatim (that link has no target there) |
| A11 | Screenshots predate the fixes | fix | full pass regenerated after every change (`reviews/verify.json`) |
| C6, C7, C8, C11, C13, A9, A10 | safe area, overflow, text fidelity, keys/storage, title proportions | ok | — |

Final verification (`scripts/_tmp-shots.py`, deleted after use; results in `reviews/verify.json`): 22 stages at 1920x1080 and 1080x1920 (plus the vertical talking-points state) with no overflow and no `is-tight`; no console errors; 390x844, 844x390 and 1100x800 in narrow mode with no horizontal scroll and every image contained; keys, dots, hash, `T`, `P`, `N`; reduced motion renders the final timecode immediately; two instances stay in sync over http and over `file://` (the OBS case); the OBS "LoA On Air" scene renders the page through the local-file shim (`reviews/shots/obs-main-scene.png`).
