"use client";

export default function ProductKeyInfo({ keyInfo }) {
  return (
    <div className="px-4 py-4 ">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Key Info</h2>
      <div className="space-y-2">
        {Object.entries(keyInfo).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center border-b border-gray-200 py-1.5"
          >
            <span className="text-sm text-gray-600 capitalize">{key}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
