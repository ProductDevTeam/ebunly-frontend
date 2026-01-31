import "../globals.css";
import DashboardShell from "./client";
import QueryProvider from "@/components/providers/QueryProvider";

export default function RootLayout({ children }) {
  return (
    <QueryProvider>
      <DashboardShell>{children}</DashboardShell>
    </QueryProvider>
  );
}
