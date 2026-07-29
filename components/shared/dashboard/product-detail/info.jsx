"use client";

/** KEY INFO — uppercase label over label/value rows split by a hairline. */
const HAIRLINE = "#EBE5E0";
const INK = "#24201C";
const MUTED = "#6E6659";

export default function ProductKeyInfo({ keyInfo }) {
  if (!keyInfo || keyInfo.length === 0) return null;

  return (
    <div>
      <p
        className="text-[11px] font-medium tracking-[0.04em]"
        style={{ color: MUTED }}
      >
        KEY INFO
      </p>

      <dl className="mt-3">
        {keyInfo.map((info, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 border-b py-2.5"
            style={{ borderColor: HAIRLINE }}
          >
            <dt className="text-[13px]" style={{ color: INK }}>
              {info.label}
            </dt>
            <dd className="text-right text-[13px]" style={{ color: INK }}>
              {info.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
