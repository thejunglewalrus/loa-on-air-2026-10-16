1. **Talking-point sync no longer follows the specified contract.**  
   The latest `app.js` applies `tp` only when an extra `tpSeq` changes, and startup ignores the saved `tp` value. Consequently, instances can retain different talking-point states, and a valid state containing only the specified `{stage,tp,rasamoa,at}` fields cannot update talking points.  
   Verdict: FIX — apply the saved and incoming `tp` value as specified.

2. **Reversing navigation does not cancel an ongoing scroll.**  
   In `goTo()`, requesting `current` clears navigation bookkeeping but returns without stopping the previous smooth scroll. An in-memory reproduction of Down followed immediately by Up issued only the scroll toward S1; a remote request to remain on S0 likewise failed to cancel it.  
   Verdict: FIX — cancel or redirect pending scrolling even when the destination equals `current`.

3. **Sync accepts stale events and invalid indices.**  
   `onRaw()` compares serialized strings without checking `at`, so a delayed storage event can overwrite newer state; the harness reproduced S5 reverting to S2. Numeric validation also accepts fractional indices: `{stage:1.5}` throws when accessing `scrollIntoView`, and fractional Rasamoa indices have the same underlying problem.  
   Verdict: FIX — reject older states and validate finite integer indices before applying them.

4. **Phone scrolling no longer drives sync.**  
   The latest `onNarrowScroll()` calls `setActive(idx, true)`, explicitly suppressing writes for local scrolling, contrary to the requirement that navigation remains synchronized in narrow mode. It also bypasses the branch that clears a completed `navTarget`, leaving subsequent keyboard navigation based on that stale target until the timeout.  
   Verdict: FIX — distinguish remote scrolling from local scrolling and clear completed navigation targets.

5. **Chart details are substantially less legible than the prose.**  
   In S2, S14 and S15, the landscape monitors convey trends, but their embedded Korean labels, dates and legends are too small for comfortable stream reading. The supplied vertical S4/S12/S18 screenshots also show small stat captions and values; on a 390px phone, the unchanged 900-unit SVG scales its 22-unit labels to approximately 8px. These are largely limitations of the prescribed design.  
   Verdict: FIX — revise chart sizing or provide readable labels, including a narrow-layout stat treatment.

6. **S1 misses the outline’s first-mention naming rule.**  
   All 108 summary/talking-point bullets and both glossary tables match the outline, preserving wording, numbers and order after removing timestamp markers. However, the outline separately requires “Gold River (금강선)” at the first body mention in S1; the implementation contains only “Gold River.”  
   Verdict: FIX — add the required Korean name at S1’s first mention.

7. **Invisible carousel images remain exposed to assistive technology.**  
   All image alt text and dimensions match the manifest, but the four inactive Rasamoa images are hidden only with opacity, so screen readers can encounter all five descriptions. Heading order is correct, active dots receive `aria-current`, and focus-ring rules exist; the glossary nevertheless uses plain divs/spans without table or definition-list semantics.  
   Verdict: FIX — hide inactive images from accessibility APIs and give glossary relationships semantic markup.

8. **Several explicit style/link requirements differ in the latest files.**  
   Vertical stat captions/notes are now 28px rather than 20px, and stat text is 30 rather than 22 SVG units; these improve size but depart from the binding spec. Narrow header left padding is 104px rather than 16px, and “All tools & translations” lacks the required footer-link `target="_blank"`.  
   Verdict: FIX — reconcile the deliberate sizing/spacing changes with the spec and correct the footer target.

9. **The reviewed stage screenshots fit and respect the webcam area.**  
   Across the 22 landscape and 22 vertical stage captures, I found no visible viewport overflow, overlapping cards or clipped text. Landscape S14/S15 come closest to the webcam boundary: the recorded side-column bottom is y≈773, below the required 800px ceiling and above the webcam’s y=810 start; S1 and S18 are dense but readable.  
   Verdict: OK

10. **The remaining control and storage foundations are sound.**  
    The code implements the specified navigation keys, typing guard, URL layout selection, hash updates, presenter visibility and reduced-motion durations/scroll behavior. Storage reads/writes are guarded, detection observers/listeners are removed before replacement, and the Rasamoa interval is cleared when leaving S16; I found no accumulating listener leak.  
    Verdict: OK

11. **The screenshots and implementation no longer represent one fixed build.**  
    Files changed during this review: newer CSS enlarges vertical stats and adjusts glossary alignment, while supplied captures retain the earlier rendering. The visual fit assessment therefore applies to the inspected captures, not a freshly rendered verification of every latest state.  
    Verdict: FIX — regenerate the full screenshot/overflow checks from a stable final revision.

Visuals: readable main text, clear talking-point separation, no clipping in reviewed stage captures.  
Content: verbatim bullets and glossary; one missing first-mention name.  
Release: fix navigation/sync defects and verify fresh captures; no files were changed by this review.
