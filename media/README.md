# Zonked demo media

Files: `zonked-demo.mp4` (H.264 + AAC, yuv420p, faststart), `zonked-demo.webm` (VP9 + Opus), `poster.png`, `shot-1.png` to `shot-6.png`. Length 2:50 (170 s). Script: `docs/DEMO-SCRIPT.md`.

## Regenerate

Requirements: Node 20+, Rust (cargo), ffmpeg, Playwright chromium in `web/`.

```bash
npm --prefix crew-bridge install && npm --prefix crew-bridge run build
npm --prefix web install
npm --prefix web run record:demo                 # about 3 minutes real time plus encoding
DEMO_DRY=1 npm --prefix web run record:demo      # fast dry run, no encoding, frames to /tmp/zk-dry
ZONKED_SKIP_BUILD=1 npm --prefix web run record:demo   # reuse an existing web/dist
```

Port 43210 must be free. `web/scripts/record-demo.mjs` and `web/scripts/demo-lib.mjs` do the following:

1. Capture real text (`git log`, `cargo test`, `.kiro/crew/crew.yaml`, fake-crew, bridge) from the repo root. Redact the OS user, home, host name, git identity, session ids, absolute paths and temp paths. The run aborts if an email, home path, hosting word, session id or git remote remains.
2. Record the app in a headless 1280x660 page and the captions in a separate 1280x60 page. ffmpeg stacks them to 1280x720.
3. Sample the engine's live 32-slot parameter block every 0.25 s.
4. Render a stereo WAV from `web/src/wasm/dsp_core.wasm` from those samples (gain capped at 0.6), plus a soft lo-fi bed that fills every idle or near-silent moment. Fade in 2 s, fade out 5 s.
5. Encode with `-map_metadata -1` and bitexact flags, then reduce PNG colors.
