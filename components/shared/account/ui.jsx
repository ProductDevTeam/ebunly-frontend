/*
 * Primitives shared by the account screens, measured from the 1440 exports.
 * The card column is ~460px wide inside the 894px content area — that is what
 * every account frame draws, not a full-bleed column.
 */
export const ACCOUNT_INK = "#24201C";
export const ACCOUNT_MUTED = "#6E6659";
export const ACCOUNT_HAIRLINE = "#F2EDE8";
export const ACCOUNT_PEACH = "#FAECE7";
export const ACCOUNT_PEACH_INK = "#712B13";
export const ACCOUNT_BRAND = "#D85A30";

/** Orange outlined pill — "+ Add new address", "Manage", "Call". */
export function OutlinePill({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex h-8 items-center gap-1.5 rounded-full border bg-white px-3.5 text-[13px] ${className}`}
      style={{ borderColor: ACCOUNT_BRAND, color: ACCOUNT_BRAND }}
      {...props}
    >
      {children}
    </button>
  );
}

/** Peach "Default" / status chip. */
export function StatusChip({ children }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] leading-none"
      style={{ backgroundColor: ACCOUNT_PEACH, color: ACCOUNT_PEACH_INK }}
    >
      {children}
    </span>
  );
}

/** White rounded card the list rows sit in. */
export function AccountCard({ children, className = "" }) {
  return (
    <div className={`rounded-xl bg-white p-4 ${className}`}>{children}</div>
  );
}

/** Constrains a screen's content to the width the exports draw. */
export function AccountColumn({ children }) {
  return <div className="max-w-115 space-y-3">{children}</div>;
}
