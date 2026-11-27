# skills-src

Source of truth for the skills that help agents build and run Zonked. Each
folder holds a `SKILL.md` with `name` and `description` frontmatter. The
`description` says when to use the skill. `name` equals the folder name.

| Skill | Folder |
|---|---|
| Build a Kiro Crew app | `kirocrew-app-builder/` (has `references/`) |
| Hearing safety rules | `zonked-hearing-safety/` |
| Onboarding and consumer UX | `zonked-onboarding-ux/` |
| Repo architecture | `zonked-app-architecture/` |

## How skills are used

Kiro Crew keeps a summary (name and description) of each skill in view and loads
the full file when it applies. Format rules are in the bundled Kiro Crew
`skills.md`: a folder with `SKILL.md`, optional `references/` and scripts,
UTF-8 text. The doc states no limit for description or body size; keep both short.
The bundled doc says a body over about 99,000 bytes is read in pages.

## Install

Pick one. Neither needs a config edit.

1. Inside the Kiro Crew app: copy each folder to `app/skills/` and list it under
   `skills` in `app/app.json` (for example `"skills": ["skills/zonked-hearing-safety"]`).
   The app installs them when the user trusts and enables it.
2. For your own use: copy a folder into the global skills folder
   (`~/.kiro/crew/skills/`), or add this folder in Settings, Skills, Extra skill
   paths (read-only extra directory).

Copy command (from the repo root):

```bash
cp -R skills-src/zonked-hearing-safety app/skills/
```

## Check a skill

Each skill must parse as YAML frontmatter, and `name` must equal its folder. The
CLI has `kirocrew app info <name>` for an installed app and `kirocrew agent validate`
for agents. There is no `skill` subcommand in the CLI help, so no
skill lint command was found. Run the lint in
`docs/SKILLS.md` (a short Python check) before you commit.

## Rules

- Edit here first, then copy to `app/skills/`. Never edit the copy.
- No personal names, local paths, live URLs, hosting steps, emoji or em-dashes.
- A rule you cannot source says "verify in" and names the document.
- `kirocrew-app-builder/references/app.annotated.json` holds `_comment_*` keys
  for teaching. Remove them before you use it as a real `app.json`.
