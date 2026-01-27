"use client";

export default function ProductKeyInfo({ keyInfo }) {
  if (!keyInfo || keyInfo.length === 0) return null;

  return (
    <div className="py-4">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Key Info</h2>
      <div className="space-y-2">
        {keyInfo.map((info, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b border-gray-200 py-1.5"
          >
            <span className="text-sm text-gray-600">{info.label}</span>
            <span className="text-sm font-medium text-gray-900">
              {info.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
