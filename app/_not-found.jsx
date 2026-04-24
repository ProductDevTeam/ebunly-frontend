import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}

function NotFoundContent() {
  // Example usage of useSearchParams (if needed)
  const searchParams = useSearchParams();
  // You can use searchParams here if required
  return <div>404 - Page Not Found</div>;
}
