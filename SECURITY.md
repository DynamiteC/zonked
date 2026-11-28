# Security

## How to report a problem

Use the private vulnerability report feature of the project repository (Security tab, "Report a vulnerability") if it is enabled. If it is not, open a normal issue titled "Security: please contact me" with no details, and a maintainer will arrange a private route. Please do not post exploit details in a public issue.

Include: what you found, the steps to repeat it, the version or commit, and what you think the impact is. We will reply as soon as a maintainer is free. This is a volunteer project with no paid support and no bug bounty.

Hearing safety counts. A way to make Zonked play louder than its limits, or to skip the safety notice, is a security report.

## Supported versions

Only the latest release on the default branch gets fixes. Older builds are not patched.

## Trust model

- The web app is static. Its Content Security Policy allows scripts only from its own origin (plus `wasm-unsafe-eval` for the sound engine), with cross-origin isolation headers. There is no `eval`, no inline script and no run-time network except the optional loopback bridge.
- The crew bridge is a Node program with no runtime dependencies. It binds `127.0.0.1` only, checks the `Host` header (DNS rebinding) and allow-lists the `Origin`. It reads the state file and never writes it or runs commands. The state file is untrusted: it is size capped, schema checked and clamped.
- Imported files (`.sbg` text, saved mixes, backups) are untrusted. They are size and count capped, validated, and clamped to the hearing-safety limits. Input is never executed.
- The Kiro Crew app backend listens on loopback only. Requests from the app proxy carry a signed header (HMAC over method, target, body hash and a nonce, with a 60 second window). An empty secret denies everything.
- The app's MCP stdio server has no authentication, by design. It is started by Kiro Crew as the local user, speaks only over standard input and output, and only reads and writes the app's own small memory file with every value clamped. Anyone who can already run code as that user could edit that file directly, so it adds no new privilege. Do not expose it on a network.
- The optional burnout sentinel agent can run shell commands in a Kiro Crew host, and the host cannot limit them. Its scheduled check ships switched off. Turn it on only if you accept that.
- Sound output is limited in three places (parser, worklet message layer and the DSP core): carrier 20 to 1500 Hz, beat 0.5 to 40 Hz, master gain at most 0.85, output within -0.95 and 0.95.

## What has not been checked

No outside security audit has been done. The Kiro Crew app has not been run on a real host. See `docs/AUDIT-SECURITY.md` and `docs/READINESS.md` for the current list.
