// Fails if crates/dsp-core could run build-time code: build.rs, a `build =` key,
// or proc-macro dependencies. Dependency free; runs before `cargo test`.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function check(crateDir) {
  const problems = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (name === "target") continue;
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name === "build.rs") problems.push(`build.rs present: ${p}`);
    }
  };
  walk(crateDir);
  const manifest = join(crateDir, "Cargo.toml");
  if (!existsSync(manifest)) return [...problems, "Cargo.toml missing"];
  const toml = readFileSync(manifest, "utf8");
  if (/^\s*build\s*=\s*(?!false\b)/m.test(toml)) problems.push("Cargo.toml sets a build script");
  if (/^\s*proc[-_]macro\s*=\s*true/m.test(toml)) problems.push("Cargo.toml declares a proc-macro crate");
  if (/^\s*\[(?:[\w.-]+\.)?(?:build-)?dependencies(?:\.[^\]]+)?\]/m.test(toml)) {
    const deps = toml.split(/^\s*\[/m).filter((sec) => /^(?:[\w.-]+\.)?(?:build-)?dependencies/.test(sec));
    for (const sec of deps) {
      if (/^build-dependencies/.test(sec) && /^\s*[\w-]+\s*=/m.test(sec.split("\n").slice(1).join("\n"))) {
        problems.push("build-dependencies declared");
      }
      if (/proc[-_]macro|\b(syn|quote|proc-macro2|serde_derive|thiserror)\b\s*=/.test(sec)) {
        problems.push("proc-macro dependency declared");
      }
    }
  }
  return problems;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(fileURLToPath(import.meta.url), "..", "..");
  const problems = check(join(root, "crates", "dsp-core"));
  if (problems.length > 0) {
    for (const p of problems) console.error(`check-no-buildrs: ${p}`);
    process.exit(1);
  }
  console.log("check-no-buildrs: ok");
}
