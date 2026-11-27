# Publish checklist: Kiro Crew App Kit

This walks the App Kit publishing guide (`docs/app-kit/publishing-guide.md` in the Kiro Crew repo, section 14 review checklist plus the asset and trust rules) against `app/`. It lists facts only. It has no steps for putting the app online.

Guide read on 2026-11-28 against `app/app.json` at the commit that adds this file.

## Warnings

- Three older commits carry a personal name and email as author. History is not rewritten here. That is the owner's call and cannot be undone for anyone who cloned.
- The gateway validator is copied by hand into `app/backend/test/manifest-rules.test.mjs` (version 0.13.1 rules). It was never run against a real Kiro Crew host in this repo. Install and enable on a real host are todo (see `docs/OWNER-TEST.md`, part B).
- Panel tab field names and the live dashboard run are unverified on a real host.
- The sentinel agent has the `execute_bash` tool. The kit has no way to limit shell commands for an app agent, so its cron ships off.

## Items

| # | Guide item | State | Evidence |
|---|---|---|---|
| 1 | `app.json` valid: kebab-case `name`, semver `version`, required fields set | pass | `name` is `zonked`, `version` is `0.1.0`. Checked by `app/backend/test/manifest.test.mjs` and `manifest-rules.test.mjs` |
| 2 | Name is not reserved | pass | `zonked` is not in the reserved list |
| 3 | No `..` or absolute paths in agents, skills, `ui.entry`, `backend.entryPoint` | pass | Path rules in `manifest-rules.test.mjs` |
| 4 | `permissions` minimal and each one used | pass | Only `api` (`/apps/zonked/api`, used by the page and panel) and `cron` (the off-by-default sentinel job). Exact set is asserted in the manifest tests |
| 5 | Icon committed, square, opaque, 512x512 | pass | `app/assets/icon.png`, PNG 512x512, RGB with no alpha channel |
| 6 | At least one screenshot | pass | Three files in `app/assets/screenshots/`, each 1280x720 |
| 7 | Hero image, 16:9 | pass | `app/assets/hero.png`, 1200x675 |
| 8 | Art is plain committed files, not Git LFS pointers | pass | No LFS config in the repo. Each file is a real PNG under 8 MiB |
| 9 | Dark art variants | todo, optional | Not needed because the icon is opaque. Add `iconPathDark` and `heroImageDark` only if the owner wants them |
| 10 | Detail banner `heroImageDetail`, 25:6 | todo, optional | The detail page falls back to `heroImage` |
| 11 | `description` is plain text and reads well in two lines | pass | One paragraph, no markdown |
| 12 | `tags` lowercase and in the right category | todo | Tags are `audio`, `focus`, `recovery`. None of them is in the guide's category table, so Discover shows Other. Add one that fits (for example `productivity`) if a category matters |
| 13 | `highlights` bullets | todo, optional | Not set. Recommended for the detail page |
| 14 | `license` set, license file present | pass | `"license": "MIT"` in `app/app.json`. `LICENSE` at the repo root |
| 15 | `minKiroCrewVersion` set | pass | `0.13.1` |
| 16 | `author` set | pass | `Zonked contributors` |
| 17 | UI bundle built and committed | pass | `app/ui/dist/` is tracked. `npm run check:dist` in `app/ui` fails when it is stale |
| 18 | Symlinks: none leave the app tree | pass | No symlinks under `app/` |
| 19 | Nothing needed at run time under `node_modules`, `.git` | pass | The page and panel load only from `app/ui/dist/` |
| 20 | Agent JSON files valid, skill `SKILL.md` has frontmatter | pass | Three agents in `app/agents/`, checked by the manifest tests. The app declares no skills, so there is no `SKILL.md` to check |
| 21 | Install script non-interactive and idempotent | pass | The app declares no setup or lifecycle script |
| 22 | `onUninstall` cleans outside the app folder | pass | Nothing is created outside `~/.kiro/crew/apps/zonked/`. The backend memory file lives in the app data folder, which the platform keeps by default |
| 23 | README explains the app, how to use it, and the trust step | pass | `app/README.md`, section "Turn it on": trust the app when you enable it |
| 24 | Manifest rules test | pass | `node --test app/backend/test` (see the gate numbers in `README.md`) |
| 25 | No remote calls at run time | pass | `npm --prefix web run audit:security` and `check:privacy` in the gates. The backend binds the loopback address only. The page CSP allows only its own origin |
| 26 | Third-party code is off by default: app tells users to trust it | pass | Same README section. Without trust the sound player works and the agents and tools stay off |
| 27 | Installs and enables cleanly from a local clone | todo | Needs a real Kiro Crew host. Steps are in `docs/OWNER-TEST.md`, part B |
| 28 | Author identity on all commits | todo | Three early commits show a personal name and email. Rewriting history is the owner's decision |
| 29 | Registry listing | todo, owner | Listing is a request to the Kiro Crew maintainers or a registry entry. Not done here |

## Summary

- Pass: 22 of 29 items.
- Todo, needs a real host: item 27.
- Todo, owner decision: items 28 and 29.
- Todo, small and optional: items 9, 10, 12 and 13.
