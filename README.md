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
- `control=1` — the remote-control view for an OBS browser dock (see OBS below)
- `sync=0`: do not share state with other open copies of the page

## OBS

The two OBS browser sources load the live page with `?presenter=1&stream=1&layout=landscape` (main canvas, 2560x1440) and `?presenter=1&stream=1&layout=vertical` (Aitum vertical canvas, 1080x1920). `stream=1` reserves space for the stream overlays: in landscape the left 640 px hold the webcam (640x360) and the chat column; in vertical the top 480 px band holds the webcam. The landscape and vertical instances stay in sync through shared browser storage, so either source's Interact window drives both.

**Driving it from OBS.** Add a custom browser dock (OBS: Docks → Custom Browser Docks) named `LoA control` with the URL `https://thejunglewalrus.github.io/loa-on-air-2026-10-16/?control=1`. The dock shares storage with the browser sources, so its Prev/Next buttons, the stage list, the talking-points toggle and the Rasamoa arrows move both canvases; arrow keys, Home, End, T, N and B work in the dock too. No Interact window needed. Scripted control is also possible through obs-browser custom events, from the walrus-station repo root:

```
op run --env-file .env.op.template -- node scripts/obs-eval.mjs CallVendorRequest '{"vendorName":"obs-browser","requestType":"emit_event","requestData":{"event_name":"loa-control","event_data":{"op":"next"}}}' --write
```

(`op`: next, prev, home, end, goto with `stage`, tp, rasamoaNext, rasamoaPrev.)

`obs-landscape.html` and `obs-vertical.html` are offline fallbacks: local-file entry points that redirect to `index.html` with the same parameters. The scenes are built and reconciled by `scripts/build-loa-on-air-scene.mjs` in the walrus-station repo (`--local` switches both sources to the shims).

## Source

VOD: https://www.youtube.com/live/wZ0rwJWBLec

The frames in `images/` are stills from this VOD, extracted with `scripts/grab-frames.ps1`. No frame was fabricated.

## Credits

Made by junglewalrus (https://www.twitch.tv/thejunglewalrus).
