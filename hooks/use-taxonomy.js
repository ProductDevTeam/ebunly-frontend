"use client";

import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/utils/api-fetch";

/*
 * GET /products/taxonomy — the vocabulary behind every product facet:
 * `categories` (with subcategories and types), plus flat lists for
 * `recipients`, `occasions`, `styleTags` and `budgetTiers`.
 *
 * The filter UI reads its options from here rather than a hardcoded list, so a
 * tag the backend adds shows up without a deploy. FALLBACK_TAXONOMY is what the
 * endpoint returned on 2026-07-29 and only stands in if the call fails — the
 * filters stay usable offline instead of collapsing to empty dropdowns.
 */
export const FALLBACK_TAXONOMY = {
  categories: [],
  recipients: [
    "Women",
    "Men",
    "Couples",
    "Kids",
    "Babies",
    "Mothers",
    "Fathers",
    "Friends",
    "Colleagues",
  ],
  occasions: [
    "Birthday",
    "Proposal",
    "Engagement",
    "Bridal Shower",
    "Wedding",
    "Bridesmaid",
    "Groomsmen",
    "Wedding Souvenir",
    "Honeymoon",
    "Conference",
    "Employee Appreciation",
    "Client Appreciation",
    "Onboarding",
    "Retirement",
    "Baby Shower",
    "Naming Ceremony",
    "Newborn Welcome",
    "Graduation",
    "Promotion",
    "Housewarming",
    "New Job",
    "Anniversary",
    "Valentine",
    "Mother's Day",
    "Father's Day",
    "Christmas",
    "Easter",
    "Eid",
  ],
  styleTags: [
    "Luxury",
    "Budget-Friendly",
    "Wellness",
    "Eco-Friendly",
    "Funny",
    "Romantic",
    "Minimalist",
    "Bold",
    "Traditional",
    "Modern",
  ],
  budgetTiers: [
    "₦3k & Under",
    "₦5k & Under",
    "₦10k & Under",
    "₦20k & Under",
    "₦50k & Under",
    "₦50k+",
  ],
};

export const taxonomyKeys = { all: ["taxonomy"] };

export function useTaxonomy() {
  const { data } = useQuery({
    queryKey: taxonomyKeys.all,
    queryFn: async () => {
      const res = await apiGet("products/taxonomy");
      return res?.data ?? res;
    },
    // The vocabulary changes about as often as a deploy does.
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });

  const taxonomy = data ?? FALLBACK_TAXONOMY;

  return {
    categories: taxonomy.categories ?? [],
    recipients: taxonomy.recipients ?? FALLBACK_TAXONOMY.recipients,
    occasions: taxonomy.occasions ?? FALLBACK_TAXONOMY.occasions,
    styleTags: taxonomy.styleTags ?? FALLBACK_TAXONOMY.styleTags,
    budgetTiers: taxonomy.budgetTiers ?? FALLBACK_TAXONOMY.budgetTiers,
  };
}
