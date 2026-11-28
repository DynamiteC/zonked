# Skills

Four skills help agents build and run Zonked. The source lives in `skills-src/`.
See `skills-src/README.md` for install steps.

| Skill | Use it when | Used by |
|---|---|---|
| `kirocrew-app-builder` | Building, installing, trusting, updating or publishing the Kiro Crew app | App builder worker, integrator |
| `zonked-hearing-safety` | Any code or agent touches sound, gain, ramps, flashes or state files | Every worker, `acoustic-sequencer`, `dsp-verifier`, reviewers |
| `zonked-onboarding-ux` | Designing or reviewing first-run screens, daily card, streaks, copy | UX worker, UI workers |
| `zonked-app-architecture` | Starting work or splitting work across parallel workers | Every worker, conductor |

## Update a skill

1. Edit `skills-src/<name>/SKILL.md`. Keep `name` equal to the folder name.
2. Re-check any rule against its source (the Sources section of each skill).
3. Copy the folder to `app/skills/<name>/`.
4. Run the lint below, then `npm --prefix web run check:privacy` and `npm run check:chars`.

## Lint

```bash
python3 - <<'PY'
import pathlib, re, yaml
for p in sorted(pathlib.Path('skills-src').glob('*/SKILL.md')):
    t = p.read_text(encoding='utf-8')
    m = re.match(r'---\n(.*?)\n---\n', t, re.S)
    assert m, p
    fm = yaml.safe_load(m.group(1))
    assert fm['name'] == p.parent.name, p
    assert fm['description'], p
    print(p.parent.name, len(fm['description']), len(t.encode()))
PY
```

## Limits and unknowns

- The Kiro Crew skills doc gives no maximum for description or body size. Keep
  the description under 400 characters and the body under 12 KB.
- The CLI has no `skill` command. Use the Python lint above. `kirocrew agent validate` covers agents only.
