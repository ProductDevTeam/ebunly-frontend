#!/usr/bin/env node
/**
 * Reconcile design/screenshots/ against the table in design/STATUS.md.
 *
 *   node .claude/skills/figma-replicate/scripts/design-status.mjs [--sync] [--json]
 *
 *   --sync   append new files as `todo` rows, and flip a `done` row to
 *            `needs-update` when its file's hash changed (the designer
 *            re-exported it after it was built). Never deletes a row and
 *            never marks anything done.
 *   --json   machine-readable output
 *
 * Exit code is 0 on a clean reconcile, 1 when anything needs attention, so
 * this can gate a check if you ever want it to.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = process.cwd();
const SHOTS_DIR = resolve(ROOT, "design/screenshots");
const STATUS_FILE = resolve(ROOT, "design/STATUS.md");

const sync = process.argv.includes("--sync");
const asJson = process.argv.includes("--json");

const IMAGE_RE = /\.(png|jpe?g|webp)$/i;
const COLS = 8; // Screen | Design file | Kind | Target | Verify | Status | Hash | Notes

// ── read the folder ────────────────────────────────────────────────────────

function walk(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out; // folder does not exist yet
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(full));
    else if (IMAGE_RE.test(e.name)) out.push(full);
  }
  return out;
}

const hashOf = (file) =>
  createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 8);

const files = new Map(); // key: path relative to design/screenshots
for (const full of walk(SHOTS_DIR)) {
  files.set(relative(SHOTS_DIR, full).split("\\").join("/"), {
    hash: hashOf(full),
    size: statSync(full).size,
  });
}

// ── read the table ─────────────────────────────────────────────────────────

let md;
try {
  md = readFileSync(STATUS_FILE, "utf8");
} catch {
  console.error(`✗ No design/STATUS.md found at ${STATUS_FILE}`);
  process.exit(1);
}

const lines = md.split("\n");

/** Data rows of the first markdown table that has the expected header. */
const rows = [];
let headerIdx = -1;
let lastRowIdx = -1;

let inComment = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Skip HTML comment blocks — STATUS.md keeps example rows in one, and they
  // must never be mistaken for real entries.
  if (inComment) {
    if (line.includes("-->")) inComment = false;
    continue;
  }
  if (line.includes("<!--") && !line.includes("-->")) {
    inComment = true;
    continue;
  }
  if (line.includes("<!--") && line.includes("-->")) continue;

  if (headerIdx === -1) {
    if (/^\|\s*Screen\s*\|\s*Design file\s*\|/i.test(line)) headerIdx = i;
    continue;
  }
  // The table body is the contiguous run of pipe lines after the header.
  // The first line that is not one ends it — including on an empty table,
  // otherwise scanning runs on into the documentation tables further down.
  if (!line.trim().startsWith("|")) break;
  if (/^\|[\s:|-]+\|$/.test(line.trim())) continue; // separator
  const cells = line.split("|").slice(1, -1).map((c) => c.trim());
  if (cells.length < COLS) continue;
  rows.push({ idx: i, cells });
  lastRowIdx = i;
}

if (headerIdx === -1) {
  console.error("✗ Could not find the status table header in design/STATUS.md");
  process.exit(1);
}
if (lastRowIdx === -1) lastRowIdx = headerIdx + 1; // header + separator only

const F = { FILE: 1, STATUS: 5, HASH: 6 };

// ── reconcile ──────────────────────────────────────────────────────────────

const logged = new Map(rows.map((r) => [r.cells[F.FILE], r]));

const isNew = [...files.keys()].filter((f) => !logged.has(f)).sort();
const missing = rows
  .filter((r) => !files.has(r.cells[F.FILE]))
  .map((r) => r.cells[F.FILE]);
const changed = rows
  .filter((r) => {
    const f = files.get(r.cells[F.FILE]);
    const recorded = r.cells[F.HASH];
    return f && recorded && recorded !== "-" && recorded !== f.hash;
  })
  .map((r) => ({
    file: r.cells[F.FILE],
    status: r.cells[F.STATUS],
    was: r.cells[F.HASH],
    now: files.get(r.cells[F.FILE]).hash,
  }));

const counts = {};
for (const r of rows) {
  const s = r.cells[F.STATUS] || "(blank)";
  counts[s] = (counts[s] || 0) + 1;
}

// ── apply --sync ───────────────────────────────────────────────────────────

const applied = { added: [], flagged: [], hashed: [] };

if (sync) {
  const out = [...lines];

  // Flip changed `done` rows to needs-update; record the new hash either way.
  for (const r of rows) {
    const f = files.get(r.cells[F.FILE]);
    if (!f) continue;
    const recorded = r.cells[F.HASH];
    if (recorded === f.hash) continue;

    const cells = [...r.cells];
    if (recorded && recorded !== "-" && r.cells[F.STATUS] === "done") {
      cells[F.STATUS] = "needs-update";
      applied.flagged.push(r.cells[F.FILE]);
    }
    if (!recorded || recorded === "-" || recorded !== f.hash) {
      cells[F.HASH] = f.hash;
      applied.hashed.push(r.cells[F.FILE]);
    }
    out[r.idx] = `| ${cells.join(" | ")} |`;
  }

  // Append unlogged files as todo rows for a human to fill in.
  if (isNew.length) {
    const newRows = isNew.map((f) => {
      const name = f
        .replace(IMAGE_RE, "")
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      applied.added.push(f);
      return `| ${name} | ${f} |  |  |  | todo | ${files.get(f).hash} |  |`;
    });
    out.splice(lastRowIdx + 1, 0, ...newRows);
  }

  writeFileSync(STATUS_FILE, out.join("\n"));
}

// ── output ─────────────────────────────────────────────────────────────────

if (asJson) {
  console.log(
    JSON.stringify(
      { counts, new: isNew, changed, missing, tracked: rows.length, applied },
      null,
      2,
    ),
  );
  process.exit(isNew.length || changed.length || missing.length ? 1 : 0);
}

const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

console.log(
  `design/screenshots: ${plural(files.size, "file")} · STATUS.md: ${plural(rows.length, "row")}\n`,
);

if (isNew.length) {
  console.log(`▲ NEW — on disk, not in STATUS.md (${isNew.length})`);
  isNew.forEach((f) => console.log(`    ${f}  ${files.get(f).hash}`));
  console.log(
    sync ? "  → appended as todo\n" : "  → run with --sync to append as todo\n",
  );
}

if (changed.length) {
  console.log(`▲ CHANGED — re-exported since it was logged (${changed.length})`);
  changed.forEach((c) =>
    console.log(`    ${c.file}  ${c.was} → ${c.now}  [${c.status}]`),
  );
  console.log(
    sync
      ? "  → done rows flipped to needs-update\n"
      : "  → run with --sync to flag done rows as needs-update\n",
  );
}

if (missing.length) {
  console.log(`▲ MISSING — in STATUS.md, not on disk (${missing.length})`);
  missing.forEach((f) => console.log(`    ${f}`));
  console.log("  → the export was deleted or renamed; fix the row by hand\n");
}

const order = ["todo", "wip", "needs-update", "done", "skip"];
const keys = Object.keys(counts).sort(
  (a, b) => (order.indexOf(a) + 99) % 99 || 0 - ((order.indexOf(b) + 99) % 99),
);
if (keys.length) {
  console.log("Status");
  for (const k of order.filter((k) => counts[k])) {
    console.log(`    ${k.padEnd(13)} ${counts[k]}`);
  }
  for (const k of keys.filter((k) => !order.includes(k))) {
    console.log(`    ${k.padEnd(13)} ${counts[k]}`);
  }
}

const dirty = isNew.length || changed.length || missing.length;
if (!dirty) console.log("✓ in sync");

process.exit(dirty && !sync ? 1 : 0);
