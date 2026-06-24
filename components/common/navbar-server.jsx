import { getNavCategories } from "@/lib/api/categories";
import Navbar from "./navbar";

// Server component — fetches categories server-side (cached, no client waterfall)
// and passes them to the client Navbar. The user never sees a loading state.
export default async function NavbarServer({ showMobileSearch = true }) {
  const categories = await getNavCategories();
  return (
    <Navbar categories={categories} showMobileSearch={showMobileSearch} />
  );
}
