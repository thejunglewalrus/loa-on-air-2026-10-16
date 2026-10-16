# Gold River returns: Lost Ark On Air, 2026-10-16

This page is an English, stage-by-stage summary of the 2026-10-16 Lost Ark On Air broadcast, with VOD timecodes. It was built for reading aloud on stream and is left up for viewers. It is a summary, not a transcript. The boxed talking points are the streamer's prompts, not Gold River's words.

## Live

https://thejunglewalrus.github.io/loa-on-air-2026-10-16/

## Keys

- ↓ → PageDown Space: next stage
- ↑ ← PageUp: previous stage
- Home / End: first / last stage
- T: talking points
- P: presenter mode
- N / B: next / previous Rasamoa screenshot

## URL parameters

- `stage=<n>` (or `#s<n>`): open at stage n
- `presenter=1`: presenter mode
- `tp=0|1`: talking points off or on
- `layout=landscape|vertical`: layout to use
- `auto=1`: autoplay the Rasamoa screenshots
- `sync=0`: do not share state with other open copies of the page

## OBS

`obs-landscape.html` and `obs-vertical.html` are the local-file entry points for the two browser sources. Each one redirects to `index.html` with the matching `layout` and `presenter=1`. The landscape and vertical instances stay in sync through shared browser storage, so either source's Interact window drives both.

After the Pages push, switch a source to the live URL from the walrus-station repo root with:

```
op run --env-file .env.op.template -- node scripts/obs-eval.mjs SetInputSettings '{"inputName":"loa-on-air-summary","inputSettings":{"is_local_file":false,"url":"https://thejunglewalrus.github.io/loa-on-air-2026-10-16/?presenter=1&layout=landscape"}}' --write
```

Do the same for the vertical source (`loa-on-air-summary-v`) with `layout=vertical`.

## Source

VOD: https://www.youtube.com/live/wZ0rwJWBLec

The frames in `images/` are stills from this VOD, extracted with `scripts/grab-frames.ps1`. No frame was fabricated.

## Credits

Made by junglewalrus (https://www.twitch.tv/thejunglewalrus).
