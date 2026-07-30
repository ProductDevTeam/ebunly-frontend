"use client";

import { useMe, useUpdateProfile } from "@/hooks/use-profile";

/*
 * The delivery address lives on the profile, not in a collection of its own:
 *
 *   GET /profile        → data.address, a single object
 *   PUT /profile        → address, a JSON string of
 *                         { street, city, state, zipCode, country }
 *
 * There is no address resource, so a customer has exactly ONE saved address and
 * it has no label — the Addresses screen's Home/Work naming and its list of
 * cards need a backend collection before they can mean anything. Everything
 * here is real and persisted; it is just singular.
 */

export const ADDRESS_FIELDS = [
  {
    name: "street",
    label: "Street address",
    placeholder: "12 Allen Avenue",
    required: true,
  },
  { name: "city", label: "City", placeholder: "Ikeja", required: true },
  { name: "state", label: "State", placeholder: "Lagos", required: true },
  {
    name: "zipCode",
    label: "Zip code",
    placeholder: "100001",
    required: false,
  },
  { name: "country", label: "Country", placeholder: "Nigeria", required: true },
];

export const EMPTY_ADDRESS = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

/** True when at least one field carries something worth saving. */
export function hasAddress(address) {
  if (!address || typeof address !== "object") return false;
  return ADDRESS_FIELDS.some((f) => String(address[f.name] ?? "").trim());
}

/** "12 Allen Avenue, Ikeja, Lagos 100001, Nigeria" */
export function formatAddress(address) {
  if (!hasAddress(address)) return "";
  const { street, city, state, zipCode, country } = address;
  const region = [state, zipCode].filter(Boolean).join(" ");
  return [street, city, region, country].filter(Boolean).join(", ");
}

export function useAddress() {
  const { data: me, isLoading } = useMe();
  const update = useUpdateProfile();

  // Older records may hold a plain string; treat that as the street line so it
  // is editable rather than invisible.
  const raw = me?.address;
  const address =
    typeof raw === "string"
      ? { ...EMPTY_ADDRESS, street: raw }
      : { ...EMPTY_ADDRESS, ...(raw ?? {}) };

  return {
    address,
    exists: hasAddress(address),
    isLoading,
    isSaving: update.isPending,
    save: (next) =>
      update.mutateAsync({ address: { ...EMPTY_ADDRESS, ...next } }),
    // PUT /profile ignores empty values, so clearing means sending blanks
    // explicitly rather than omitting the field.
    clear: () => update.mutateAsync({ address: { ...EMPTY_ADDRESS } }),
  };
}
