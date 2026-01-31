"use client";

import { Suspense } from "react";
import DashboardShellInner from "./inner";

export default function DashboardShell({ children }) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <div className="bg-white">
        <DashboardShellInner>{children}</DashboardShellInner>
      </div>
    </Suspense>
  );
}

function ShellFallback() {
  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading dashboard...</div>
    </div>
  );
}
