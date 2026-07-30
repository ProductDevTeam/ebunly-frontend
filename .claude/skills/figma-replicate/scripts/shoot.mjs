#!/usr/bin/env node
/**
 * Screenshot a route from the running dev server at an exact viewport width,
 * for pixel-comparison against a Figma screenshot.
 *
 * Requires a dev server already running (`npm run dev`) and chromium installed
 * (`npx playwright install chromium`).
 *
 *   node .claude/skills/figma-replicate/scripts/shoot.mjs <route> [flags]
 *
 *   --w <px>       viewport width (default 1440; use 390 for mobile designs)
 *   --h <px>       viewport height (default 900)
 *   --sel "<css>"  clip to the first matching element — far more sensitive
 *                  than a full-page diff for catching small spacing errors
 *   --body         clip to <main> — the content region between navbar and
 *                  footer. Use for page-level designs so an already-correct
 *                  header and footer do not dilute the diff. Shorthand for
 *                  --sel main, with a clearer error when the page has none.
 *   --full         full-page capture instead of viewport
 *   --motion       keep entry animations mid-flight; by default the page is
 *                  forced to its settled state, which is what a Figma frame shows
 *   --out <name>   output filename (default derived from route + width)
 *   --wait <ms>    extra settle time after network idle (default 400)
 *   --port <n>     dev server port (default 3000)
 *   --dsf <n>      device scale factor (default 2, retina)
 */

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const argv = process.argv.slice(2);

if (!argv.length || argv.includes("--help") || argv.includes("-h")) {
  console.log(
    "usage: shoot.mjs <route> [--w 1440] [--h 900] [--sel css] [--full] [--out name] [--wait ms] [--port 3000] [--dsf 2] [--cookie name=value,...]",
  );
  process.exit(argv.length ? 0 : 1);
}

const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const route = argv[0].startsWith("/") ? argv[0] : `/${argv[0]}`;
const width = Number(flag("w", 1440));
const height = Number(flag("h", 900));
const bodyOnly = argv.includes("--body");
const selector = flag("sel", bodyOnly ? "main" : null);
const fullPage = argv.includes("--full");
const keepMotion = argv.includes("--motion");
const waitMs = Number(flag("wait", 400));
const port = flag("port", "3000");
const scale = Number(flag("dsf", 2));

// Auth-gated routes (/profile, /cart, …) redirect to /login without a token
// cookie. --cookie "token=dev" seeds one so the real screen can be shot.
const cookieArg = flag("cookie", null);

// Scratchpad if the harness provided one, else a local gitignored folder.
const outDir =
  process.env.CLAUDE_SCRATCHPAD_DIR || resolve(process.cwd(), ".screenshots");
mkdirSync(outDir, { recursive: true });

const slug =
  flag("out", null) ||
  `${route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home"}-${width}`;
const outPath = resolve(outDir, `${slug}.png`);

const url = `http://localhost:${port}${route}`;

let browser;
try {
  browser = await chromium.launch();
} catch (err) {
  console.error(`✗ Could not launch chromium: ${err.message.split("\n")[0]}`);
  console.error("  Run: npx playwright install chromium");
  process.exit(1);
}

const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: scale,
  isMobile: width <= 768,
  hasTouch: width <= 768,
});

if (cookieArg) {
  await page.context().addCookies(
    cookieArg.split(",").map((pair) => {
      const idx = pair.indexOf("=");
      return {
        name: pair.slice(0, idx).trim(),
        value: pair.slice(idx + 1).trim(),
        domain: "localhost",
        path: "/",
      };
    }),
  );
}

let failed = false;
try {
  const res = await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 30_000,
  });
  if (res && res.status() >= 400) {
    console.error(`✗ ${url} returned HTTP ${res.status()}`);
    failed = true;
  }

  // A Figma frame shows the *settled* state. Unless --motion is passed, force
  // the page there: trigger the scroll-reveal observers, kill in-flight entry
  // animations, and wait for images. Without this you capture a half-faded
  // hero and diff against phantom differences.
  if (!keepMotion) {
    // Scroll the full page to fire IntersectionObserver reveals and lazy images.
    // Bounded: `.section-lazy` uses content-visibility, so scrollHeight grows as
    // sections render and an unbounded loop never terminates.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let i = 0; i < 40; i++) {
        const y = i * step;
        if (y > document.body.scrollHeight) break;
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
    });

    // Mark every reveal element visible. Adding the class (rather than
    // overriding transform) preserves rules like `.star-reveal.is-visible`,
    // whose settled state is a rotation, not `transform: none`.
    await page.evaluate(() => {
      document
        .querySelectorAll('[class*="reveal"]')
        .forEach((el) => el.classList.add("is-visible"));
    });

    await page.addStyleTag({
      content: `*, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }`,
    });

    // Images: `loading="lazy"` decodes after layout. Race each against a
    // deadline — an offscreen lazy image may never fire load or error at all.
    await page.evaluate(
      () =>
        Promise.all(
          [...document.images].map((img) =>
            img.complete
              ? null
              : Promise.race([
                  new Promise((r) => {
                    img.onload = img.onerror = r;
                  }),
                  new Promise((r) => setTimeout(r, 3000)),
                ]),
          ),
        ),
    );
  }

  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(waitMs);

  if (selector) {
    const el = page.locator(selector).first();
    if (bodyOnly && (await page.locator("main").count()) === 0) {
      throw new Error(
        `--body: ${route} has no <main> element.\n` +
          "  Not every page wraps its content — capture the full page instead,\n" +
          "  or pass --sel with this page's own content wrapper.",
      );
    }
    await el.waitFor({ state: "visible", timeout: 10_000 });
    await el.screenshot({ path: outPath });
  } else {
    await page.screenshot({ path: outPath, fullPage });
  }

  console.log(outPath);
  console.log(
    `${width}x${height} @${scale}x · ${route}${bodyOnly ? " · <main> only (no chrome)" : selector ? ` · clipped to ${selector}` : fullPage ? " · full page" : ""}`,
  );
} catch (err) {
  failed = true;
  console.error(`✗ ${err.message}`);
  if (/ECONNREFUSED|net::ERR_CONNECTION_REFUSED/.test(err.message)) {
    console.error(`  Is the dev server running on port ${port}? (npm run dev)`);
  }
} finally {
  await browser.close();
}

process.exit(failed ? 1 : 0);
