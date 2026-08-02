"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";

/*
 * The search suggestion panel, from "Components - Search.png" and the two
 * 1x mobile frames. Two states:
 *
 *   empty  — RECENT SEARCHES, a rule, then POPULAR pills
 *   typing — "See all results for …", a rule, RELATED CATEGORIES pills,
 *            a rule, then RELATED PRODUCTS rows
 *
 * The mobile frames drop it straight onto the page; the desktop navbar wraps
 * it in a bordered card. That is the only difference, so it is a prop rather
 * than two components.
 */
const INK = "#24201C";
const MUTED = "#6E6659";
const HAIRLINE = "#F2EDE8";
const SEE_ALL = "#712B13";

function Label({ children }) {
  return (
    <p
      className="text-[11px] leading-4 font-medium tracking-[0.04em]"
      style={{ color: INK }}
    >
      {children}
    </p>
  );
}

function Rule() {
  return <div className="my-3 h-px" style={{ backgroundColor: HAIRLINE }} />;
}

function Pill({ children, href, onClick }) {
  const className =
    "inline-flex h-7 items-center rounded-full border px-3.5 text-[13px]";
  const style = { borderColor: HAIRLINE, color: INK };

  return href ? (
    <Link href={href} onClick={onClick} className={className} style={style}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className} style={style}>
      {children}
    </button>
  );
}

export default function SearchPanel({
  query = "",
  recent = [],
  popular = [],
  categories = [],
  products = [],
  onPick,
  onRemoveRecent,
  onNavigate,
}) {
  const typing = query.trim().length > 0;

  if (typing) {
    return (
      <div>
        <Link
          href={`/shop/categories/all?q=${encodeURIComponent(query.trim())}`}
          onClick={onNavigate}
          className="flex items-center gap-2 text-[14px] leading-5 font-medium"
          style={{ color: SEE_ALL }}
        >
          <Search size={16} strokeWidth={1.75} className="shrink-0" />
          See all results for &quot;{query.trim()}&quot;
        </Link>

        {categories.length > 0 && (
          <>
            <Rule />
            <Label>RELATED CATEGORIES</Label>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Pill
                  key={category.id}
                  // Related categories come from the search index and are named,
                  // not ids, so the caller supplies where they point.
                  href={category.href ?? `/shop/categories/${category.id}`}
                  onClick={onNavigate}
                >
                  {category.label}
                </Pill>
              ))}
            </div>
          </>
        )}

        {products.length > 0 && (
          <>
            <Rule />
            <Label>RELATED PRODUCTS</Label>
            <div className="mt-2">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onNavigate}
                  className="flex items-center gap-4 py-4"
                  style={{ borderBottom: `1px solid ${HAIRLINE}` }}
                >
                  <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded bg-[#FAECE7]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </span>
                  <span
                    className="min-w-0 flex-1 truncate text-[14px] leading-5"
                    style={{ color: INK }}
                  >
                    {product.name}
                  </span>
                  <span
                    className="shrink-0 text-[14px] leading-5"
                    style={{ color: MUTED }}
                  >
                    ₦{Number(product.price).toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {recent.length > 0 && (
        <>
          <Label>RECENT SEARCHES</Label>
          <ul className="mt-2">
            {recent.map((entry) => (
              <li key={entry} className="flex items-center gap-3 py-2.5">
                <button
                  type="button"
                  onClick={() => onPick?.(entry)}
                  className="min-w-0 flex-1 truncate text-left text-[14px] leading-5"
                  style={{ color: MUTED }}
                >
                  {entry}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveRecent?.(entry)}
                  aria-label={`Remove ${entry}`}
                  className="shrink-0"
                >
                  <X size={14} strokeWidth={2} style={{ color: INK }} />
                </button>
              </li>
            ))}
          </ul>
          <Rule />
        </>
      )}

      <Label>POPULAR</Label>
      <div className="mt-4 flex flex-wrap gap-2">
        {popular.map((category) => (
          <Pill
            key={category.id}
            href={`/shop/categories/${category.id}`}
            onClick={onNavigate}
          >
            {category.label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
