# design/

Figma exports from the designer, plus the record of what has been built from them.

```
design/
  README.md      ← this file            (committed)
  STATUS.md      ← done / todo tracking (committed)
  screenshots/   ← the exports          (gitignored — local only)
```

## The exports are not committed

`design/screenshots/` is in `.gitignore`. The images live only on the machine they were exported to.

[STATUS.md](STATUS.md) **is** committed, so the state of the work is shared even though the images are not. The consequence, stated plainly: a teammate will see rows marked `done` for designs they cannot open, and cannot re-verify them. The `Hash` column at least means whoever *does* hold the files can tell when one was revised.

If you later want the images shared, drop the `design/screenshots/` lines from `.gitignore` — nothing else has to change.

## An export can be anything

A component, a section, a full page, a whole flow. Granularity is not fixed, and it is the first thing to establish about any export, because it decides where the code lands and how it gets verified. STATUS.md's `Kind` column records it.

Some exports will happen to include the site header and footer, because that is what was on the frame. Those are already built — they are context, not work. See the chrome rule in [SKILL.md](../.claude/skills/figma-replicate/SKILL.md).

## Naming

Whatever the designer exports is fine — the filename is not load-bearing, since STATUS.md maps each file to its `Kind` and `Target`. But a name that says what it is and how wide it was drawn saves a lookup:

```
home-1440.png
home-390.png
product-card-390.png
navbar-1440.png
checkout-flow-1440.png
```

Subfolders are fine; the reconcile script walks recursively.

## Workflow

```bash
# what's new, what changed, what's left
node .claude/skills/figma-replicate/scripts/design-status.mjs

# log new exports as todo, flag re-exported designs as needs-update
node .claude/skills/figma-replicate/scripts/design-status.mjs --sync
```

Then, to build one:

```
/figma home-1440.png
```

The `--sync` flag never marks anything `done` and never deletes a row. Promoting to `done` means the visual check actually passed, which no script can determine.

## Revisions

When the designer re-exports a file that was already built, its hash changes and `--sync` flips the row from `done` to `needs-update`. That is the whole point of the hash column — otherwise a revised design sits silently on disk next to an implementation that no longer matches it.
