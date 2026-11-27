# Pre-publish checklist for a Kiro Crew app

Distilled from the publishing guide review checklist. Verify in publishing-guide.md.

- [ ] `app.json` valid: kebab-case `name` (not reserved), semver `version`, required fields non-empty
- [ ] No `..` or absolute path in `agents`, `skills`, `ui.entry`, `ui.pages[].entryPoint`, `backend.entryPoint`
- [ ] `permissions` minimal, each one used; no `network` unless needed
- [ ] `permissions.cron` is true if `crons` is non-empty
- [ ] Icon committed: square, 512x512, opaque, plain file
- [ ] At least one screenshot and one hero image (16:9) committed
- [ ] `description` plain text, reads well cut to two lines
- [ ] `tags` lowercase
- [ ] UI bundle built and committed (for example `ui/dist/index.mjs`); react and app-sdk are externals
- [ ] Agent JSON valid; each `SKILL.md` has frontmatter with `name` and `description`
- [ ] Backend, if any: small, input validated, no shell calls, health route answers 2xx unsigned
- [ ] Install script (if any) non-interactive, idempotent, exits 0
- [ ] README says what the app does and tells the user to trust the app on enable
- [ ] Installs and enables cleanly from a local clone; `kirocrew app info <name>` is clean
- [ ] Version bumped for the release
