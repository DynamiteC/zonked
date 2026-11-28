---
name: kirocrew-app-builder
description: "Use when building, installing, trusting, updating or publishing a Kiro Crew app: writing app.json, a dashboard page or side-panel tab, permissions, a backend, bundled agents and skills, the store icon, and the review checklist. Not for the app's own product logic."
---

# Kiro Crew app builder

An app is a folder with an `app.json` manifest. It can bring a dashboard page,
a chat side-panel tab, agents, skills, cron jobs and a small backend. This skill
is a working summary. For any field not listed here, verify in
manifest-reference.md (see Sources). Never guess a field.

## Workflow

1. Scaffold: `kirocrew app init my-app --ui`. It writes `app.json`, an opaque
   512x512 placeholder icon, a sample agent, a sample skill and a `ui/` Vite project.
2. Edit `app.json`, `agents/*.json`, `skills/<name>/SKILL.md`, `ui/src/*`.
3. Build the UI: `npm install && npm run build` inside `ui/`. The output
   (for example `ui/dist/index.mjs`) is committed.
4. Install: `kirocrew app install <absolute path or git URL>`.
5. Trust, then enable: `kirocrew app enable my-app`. Enable refuses every app
   that is not built in until the operator trusts it (App Store asks per app;
   Settings, Security, Third-party apps lists and revokes grants).
6. Iterate: rebuild `ui/`, then use the installed app's Update action or
   `kirocrew app update <name> [--source <dir>]`. `kirocrew app dev <name>`
   gives no-store UI serving and live reload. Agent and skill edits apply on the
   next agent run, but the installed copy still has to be updated.
7. Debug: `kirocrew app info <name>` (install also names the bad field).

Other `kirocrew app` subcommands: list, disable, uninstall (keeps data), import.

## Manifest fields we use

Required: `name`, `version`, `displayName`, `description` (non-empty strings).

| Field | Rule |
|---|---|
| `name` | kebab-case `^[a-z0-9]+(?:-[a-z0-9]+)*$`, at most 128 chars. Reserved: `system`, `library`, `registry`, `registries`, `blob`, `install`, `register`, `market`, and Windows device names (`con`, `prn`, `aux`, `nul`, `com1`-`com9`, `lpt1`-`lpt9`). |
| `version` | starts with `MAJOR.MINOR.PATCH`; suffix allowed. |
| `iconPath` | top level, not under `ui`. Square 512x512 and opaque (no transparency). `iconPathDark` optional. |
| `agents`, `skills` | arrays of relative paths: agent JSON files, skill folders. No absolute path, no `..`. |
| `ui.entry` | ESM bundle, relative to `ui/` (for example `dist/index.mjs`). |
| `ui.pages[]` | `route` and `label` required. `icon` (Lucide name) works for built-in apps only; an installed app ships an image (`iconPath` or `iconUrl`). |
| `contributes.panelTabs[]` | `id` (`[a-z][a-z0-9_-]{0,63}`), `title`, `menuLabel`, `icon` from a fixed list, `entry` relative to `ui/` (not the app root). At most 8. The tab stays mounted while hidden, so stop timers when `useAppInfo().active` is false. |
| `contributes.sessionControls[]` | `id`, `entryPoint`, `label`, `icon`, optional `statusPath`. Only a fixed icon set renders. |
| `crons[]` | `name`, `every` or `cron_expr`, and one of `agent`, `agent_sequence`, `message`, `command`, `script` (`command` and `script` exclusive). Needs `permissions.cron: true`. |
| `backend` | `entryPoint`, `port` (default auto), `healthCheck` (default `/health`, must answer an unsigned loopback GET with 2xx and no redirect), `type`. Or `backend.hooks` with `routes`, `on_startup`, `on_shutdown` as `module.path:callable`, run inside the gateway. |
| `platform` | `os` from `macos`, `linux`, `windows` (default excludes windows); `installMode` `server` or `client`. |
| store text | `tags` (lowercase), `highlights`, `useCases`, `screenshots` (about 1200 px wide), `heroImage` 16:9. |

## Permissions

Declare every capability under `permissions`. The SDK rejects an API path or
event the manifest does not declare.

| Key | Meaning |
|---|---|
| `api` | allowed API path prefixes; `=/api/x` means that exact path only |
| `events` | allowed WebSocket event types |
| `mcpTools` | allowed MCP tool names |
| `storage` | app-scoped storage |
| `cron` | runtime cron jobs; required when `crons` is non-empty |
| `network` | external network requests |
| `memory` | `""`, `"app-scoped"` or `"shared"` |

Many other grants exist (spawn, sessionApproval, chatSlots, browser and more).
Each is shown at the trust prompt. Ask for the least; every permission must be used.

## Pitfalls

- Do not `npm install` `@kirocrew/app-sdk`. The host provides it, plus React,
  ReactDOM and lucide-react. Mark them as externals so the bundle stays small and
  shares the host's React.
- Declared permissions or the SDK throws. Add `permissions.api` for each route
  your page calls and `permissions.events` for each event it hears.
- Opaque 512x512 icon, committed as a plain file (not Git LFS), under 8 MiB.
- Install copies the tree without `node_modules`, `.git`, `__pycache__`, `.venv`.
  Commit the built UI bundle. Symlinks that point outside the tree are dropped.
- Third-party trust is the user's grant, never the app's. Untrusted means no
  agents, skills, MCP declarations or crons register, and the user sees
  `app_execution_denied`. Say "trust the app when you enable it" in the README.
- App backend and hook code run with gateway privileges. Keep backends small,
  validate every input, never shell out, never read paths from a request.
  Do not add a backend unless the page truly cannot work without one.
- `data/` survives updates and uninstall by default. Put user state there.
- Bump `version` for every release (patch fix, minor feature, major break).
  A catalog entry updates only when the catalog republishes with a new pin.

## Publish

Commit everything (including `ui/dist`, icon, screenshots, hero). Then use the
route the publishing guide names for your case (store listing request, or a
registry entry). Verify the current route in publishing-guide.md before you
promise one. Run the checklist in `references/checklist.md`.

## References

- `references/checklist.md`: pre-publish review checklist.
- `references/app.annotated.json`: minimal annotated manifest.

## Sources

- https://raw.githubusercontent.com/kirodotdev/KiroCrew/main/docs/app-kit/getting-started.md
- https://raw.githubusercontent.com/kirodotdev/KiroCrew/main/docs/app-kit/manifest-reference.md (name rules, permissions, ui, panelTabs, backend, platform, validation rules)
- https://raw.githubusercontent.com/kirodotdev/KiroCrew/main/docs/app-kit/publishing-guide.md (assets, trust, review checklist)
- https://raw.githubusercontent.com/kirodotdev/KiroCrew/main/docs/app-kit/api-reference.md (SDK hooks; not summarised here, verify in api-reference.md)
- Bundled Kiro Crew docs `apps.md` and `skills.md`.
