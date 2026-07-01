import Link from "next/link";

// UI test harness — renders real components with mock data so screens can be
// previewed without auth or a live backend. Add new entries as you build.
const SCREENS = [
  { href: "/test/ui/profile", label: "Profile page" },
  { href: "/test/ui/personalization", label: "Personalization (product detail)" },
];

export const metadata = {
  title: "UI Tests | Ebunly",
};

export default function UiTestIndex() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 font-sans">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">UI Tests</h1>
      <p className="text-sm text-gray-500 mb-8">
        Preview screens with mock data — no login required.
      </p>
      <ul className="space-y-2">
        {SCREENS.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 hover:border-gray-400 transition-colors"
            >
              <span className="text-gray-900 font-medium">{s.label}</span>
              <span className="text-gray-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
