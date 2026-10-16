# Claude (Opus) pre-build review, 2026-10-16

Independent of Astra's. Eighteen findings; the verdicts and what changed are in `triage.md`. Headline items:

1. CHANGE — the landscape and vertical OBS sources are two page instances with no sync; add one control path both follow (shared storage / broadcast) and define what the streamer presses.
2. CHANGE — the bottom-right stream webcam covers the side column on every landscape stage, not only the glossary; define a safe rectangle and keep `.side` out of it.
3. CHANGE — the 10px font floor breaks small viewports (landscape phone, 390x844 vertical); add a flow-mode breakpoint with auto-height stages and no snap.
4. CHANGE — body text 25px is too small for a stream; 28px fits every stage; talking points 24px; cap no-frame cards at 1080px.
5. CHANGE — the glossary overflows (≈1130px vs 912px budget) and `is-tight` cannot rescue it; cut unused rows (고봉밥, 유불리, 금강선), add glossary tight rules, let the footer sit outside the budget.
6. CHANGE — subjectless bullets read as our claims (S6, S9, S14, S15); talking points quote paraphrases (S2, S8). Prefix with "He says"; quotes only around his verbatim words.
7. CHANGE — vertical: card-first is right, the overlay sheet is wrong (covers content, sits under phone UI, defaults off). Render talking points inline in place of the monitor.
8. CHANGE — S18 tile puts a yearly change on a cumulative axis and its geometry overruns the track; two bars plus a text note.
9. CHANGE — S4's long label overruns the 260-unit column.
10. CHANGE — S12 shows the same four numbers twice; bullets cite 10% shown nowhere; make it a no-frame stage and annotate.
11. CHANGE — red caption links break the token rule, fail AA at 20px and smear under 4:2:0; use on-stage text with a gold underline.
12. CHANGE — the rail lamp is not beside the timecode; put the lamp immediately left of it.
13. CHANGE — count-up numerals are a template trope; only the timecode should roll digits.
14. CHANGE — the Rasamoa 4s cycle swaps caption text in the presenter's peripheral vision; 6s, caption at mid-fade.
15. CHANGE — translationese ("golden time", "fixed-form", "self-copy", "cut-line") will ship as is under zero latitude; resolve in the outline.
16. CHANGE — spec, manifest and outline disagree on image size, caption prefix, hero caption/time; make the manifest authoritative.
17. CHANGE — prompts: S10/S19 duplicate; bare "agree?" prompts invite yes-spam; S6 b2 is a sneer.
18. KEEP — concept, hierarchy and motion budget hold; the palette is close to a premium default but matches Lost Ark's own UI.

Overall: concept and content strong; the real risks were operational and spatial (unsynced instances, webcam over the talking points, small-viewport and glossary layouts).
