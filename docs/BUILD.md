# Build, pinning and trust

How a build is made the same way every time, and what `npm run verify:all` proves.

## Pins

| What | Where | Rule |
|---|---|---|
| Rust version and wasm target | `rust-toolchain.toml` | Pinned to 1.81.0. `rustup` installs it on first use. |
| Rust crates | `crates/dsp-core/Cargo.lock` | The crate has no dependencies. Every cargo call uses `--locked`. |
| npm packages | `web/package-lock.json`, `crew-bridge/package-lock.json`, `app/ui/package-lock.json` | Install with `npm ci`, never `npm install`. |
| The built wasm | `web/src/wasm/dsp_core.wasm.sha256` | `verify:all` fails loudly when the built wasm does not match. |
| The Kiro Crew app page | `app/ui/dist` | `verify:all` rebuilds into a temp folder and fails when the committed files differ. |
| The `glob` override | `web/package.json` (`overrides`) | `verify:all` builds a fresh clone of HEAD with `npm ci` to prove the override still builds. |

Change the wasm pin on purpose with `node scripts/verify-all.mjs --write-wasm-hash`, and commit it with the DSP change.

## Install scripts

Dependency install scripts do not run. Each package folder has an `.npmrc` with `ignore-scripts=true`, and `web/package.json` records `allowScripts` as `false` for the three packages that have one (`esbuild`, `workerd`, `fsevents`). The build and every check pass with them off: `esbuild` and `workerd` ship their binaries in platform packages, and `fsevents` is an optional file watcher. `wasm-pack` was removed: the crate has no `wasm-bindgen`, so it never built anything. If a new dependency needs a script, run `npm install-scripts ls`, read the script, and approve it by name and version in the pull request.

## What verify:all does

Run `npm run verify:all` on a committed tree. It stops at the first failure.

1. `commit-stamp`: prints the commit and refuses a dirty tree (`VERIFY_ALLOW_DIRTY=1` for local work, printed in the output).
2. `install`: `npm ci` in `web`, `crew-bridge` and `app/ui`.
3. Rust tests and clippy, bridge tests, app backend tests.
4. Web build, type check, unit tests, bundle budget, security audit, privacy, character and size checks, sample licences.
5. `wasm-pinned`, `clean-clone-build`, `app-dist-fresh`, `wasm-drift`.
6. `npm-audit` in all three folders.
7. `verify-e2e`: a real Chromium with the real audio engine, on the build made in this run. It reads the output peak at the hottest settings, the soft start, the stop ramp and every request the page makes.
8. `browser-matrix`: Chromium, Firefox and WebKit builds from Playwright at three sizes.

On success it writes `.work/verify-results.json`. `node scripts/update-counts.mjs` turns that into `docs/RUN-RESULTS.md` and the counts block in `README.md`.

## Mocked and real tests

Web unit tests that stub the audio engine start with a `// MOCKED:` line, and a script test fails when one forgets it. They prove the logic around the engine. Only `verify-e2e` and the browser matrix read real output.

## CI

`.github/workflows/ci.yml` runs the checks that need no browser: `npm ci`, cargo test and clippy, wasm hash, type check, Vitest, bridge tests, script tests, build, bundle budget, sample licences, privacy and character checks, app page freshness and `npm audit`. It has read-only permissions, no secrets and nothing is published. Actions are pinned by tag, not by commit hash (shortcut: pin to full hashes when the repository goes public).
