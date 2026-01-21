import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
        <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
          <NotFoundContent />
        </Suspense>
      </div>
    </div>
  );
}

function NotFoundContent() {
  const searchParams = useSearchParams();
  const attempted = searchParams.get("path");

  return (
    <div className="space-y-4">
      {attempted && (
        <p className="text-sm text-gray-500">
          The page &quot;{attempted}&quot; could not be found.
        </p>
      )}
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
