You are doing a studio-style creative review of a web page BEFORE it is built. Nothing is implemented yet; you are reviewing the content outline and the design specification that a builder will follow with zero creative latitude.

Context: an English, stream-segment summary of the 2026-10-16 Lost Ark "On Air" broadcast in which Gold River (금강선), the game's former director, returned to take over communication after the Mordum Extreme fallout. The page is read aloud by a Twitch streamer, on stream, inside an OBS browser source at 2560x1440 (designed at 1920x1080 and scaled), and also rendered in a 1080x1920 vertical canvas for a phone-format simulcast. After the stream it stays up for viewers on GitHub Pages. Format: one full-viewport "stage" per topic, scroll-snap, keyboard navigation. Voice: faithful summary of what he said, plus a clearly separate "talking points" box per stage.

Read these files, in this order:
1. content/outline.md   (the content, verbatim for the builder)
2. design/spec.md       (the complete design: tokens, layout, motion, keys)
3. images/manifest.json (the VOD frames that will be shown)

Critique, as a senior design director would:
- Concept and hierarchy: does the "broadcast control room / timecode spine / cue card" idea hold, and does the hierarchy put the right thing first on every stage?
- Legibility on stream: type sizes, line lengths, contrast, card density at 1920x1080 and at 1080x1920. Flag any stage you expect to overflow or to read as a wall of text.
- The vertical layout: is "card first, frame at 60% width below, talking points as a toggled bottom sheet" the right call for a phone-format simulcast?
- Motion restraint: is the motion list right, too much, or too little? Anything that will look cheap or distracting on a stream?
- Anything that reads as a template, a default, or a cliché of "AI-made" pages.
- Content: anything unclear, misordered, or likely to be misread as the speaker's words when it is ours (or vice versa). Do NOT fact-check against the VOD; assume the outline is faithful.
- The talking points: are they good prompts for an English-speaking Twitch audience?

Output format: a numbered list of findings. Each finding: one-line title, 2–4 sentences of reasoning, then a verdict line `Verdict: KEEP` (the spec is right as is) or `Verdict: CHANGE — <the specific change you recommend>`. Order by importance. End with a 3-line overall assessment. Do not rewrite the spec; do not pad.
