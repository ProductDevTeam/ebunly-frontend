import Link from "next/link";

/**
 * Reusable breadcrumb trail.
 * @param {Array<{label: string, href?: string}>} items - ordered crumbs;
 *        the last item is rendered as the current page (no link).
 * @param {string} [className] - extra classes (e.g. alignment / spacing).
 */
export default function Breadcrumb({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 font-sans font-normal text-[12px] text-[#0C0000] ${className}`}
      style={{ lineHeight: "140%", letterSpacing: "-0.01em" }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-x-1.5">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-medium truncate max-w-[200px]"
                    : undefined
                }
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-[#0C0000]/50">&gt;</span>}
          </span>
        );
      })}
    </nav>
  );
}
