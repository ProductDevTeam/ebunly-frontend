"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import AccountPage from "@/components/shared/account/account-page";
import {
  AccountCard,
  AccountColumn,
  OutlinePill,
  StatusChip,
  ACCOUNT_BRAND,
  ACCOUNT_HAIRLINE,
  ACCOUNT_INK,
  ACCOUNT_MUTED,
} from "@/components/shared/account/ui";
import { useNotification } from "@/components/common/notification-provider";
import ConfirmDialog from "@/components/common/confirm-dialog";
import {
  ADDRESS_FIELDS,
  EMPTY_ADDRESS,
  formatAddress,
  useAddress,
} from "@/hooks/use-address";
import { useHydrated } from "@/hooks/use-hydrated";

/*
 * Reads and writes the one address the API keeps, on the profile — see
 * use-address.js. The screen is drawn as a list because the design assumes a
 * collection; until the backend grows one, that list is a list of one and there
 * is no Home/Work label to show, so the street stands in as the heading.
 */

function AddressForm({ initial, saving, onCancel, onSubmit }) {
  const [draft, setDraft] = useState({ ...EMPTY_ADDRESS, ...initial });

  const change = (e) =>
    setDraft((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(draft);
      }}
      className="rounded-xl border p-4"
      style={{ borderColor: ACCOUNT_HAIRLINE }}
    >
      <div className="grid grid-cols-2 gap-3">
        {ADDRESS_FIELDS.map((field) => (
          <label
            key={field.name}
            className={field.name === "street" ? "col-span-2" : "col-span-1"}
          >
            <span
              className="mb-1 block text-[11px] font-medium tracking-[0.04em] uppercase"
              style={{ color: "#707070" }}
            >
              {field.label}
              {field.required && (
                <span style={{ color: ACCOUNT_BRAND }}> *</span>
              )}
            </span>
            {field.options ? (
              <select
                name={field.name}
                value={draft[field.name] ?? ""}
                onChange={change}
                className="h-11 w-full appearance-none rounded-lg border border-transparent bg-white px-3 text-[13px] focus:border-[#D85A30] focus:outline-none"
                style={{
                  color: draft[field.name] ? ACCOUNT_INK : ACCOUNT_MUTED,
                }}
              >
                <option value="">{field.placeholder}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                value={draft[field.name] ?? ""}
                onChange={change}
                placeholder={field.placeholder}
                className="h-11 w-full rounded-lg border border-transparent bg-white px-3 text-[13px] placeholder:text-[#6E6659] focus:border-[#D85A30] focus:outline-none"
                style={{ color: ACCOUNT_INK }}
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="h-11 flex-1 rounded-lg text-[13px] text-white"
          style={{ backgroundColor: ACCOUNT_BRAND }}
        >
          {saving ? "Saving…" : "Save address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-11 px-4 text-[13px]"
          style={{ color: ACCOUNT_MUTED }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AddressesClient() {
  const { address, exists, isLoading, isSaving, save, clear } = useAddress();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  // Whether there is a session is a browser-only fact, so hold the loading
  // state until hydration rather than render the signed-out branch first.
  const hydrated = useHydrated();
  const loading = !hydrated || isLoading;

  const required = ADDRESS_FIELDS.filter((f) => f.required);

  const handleSave = async (draft) => {
    const missing = required.filter((f) => !String(draft[f.name] ?? "").trim());
    if (missing.length) {
      notifyError(
        `Please fill in: ${missing.map((f) => f.label).join(", ")}.`,
        "Missing details",
      );
      return;
    }
    try {
      await save(draft);
      setEditing(false);
      notifySuccess("Address saved.", "Saved");
    } catch (err) {
      notifyError(err.message, "Could not save address");
    }
  };

  const handleDelete = async () => {
    try {
      await clear();
      setConfirmingDelete(false);
      notifySuccess("Address removed.", "Removed");
    } catch (err) {
      notifyError(err.message, "Could not remove address");
    }
  };

  return (
    <AccountPage title="Addresses">
      {!editing && (
        <OutlinePill className="mb-5" onClick={() => setEditing(true)}>
          {exists ? "+ Change address" : "+ Add new address"}
        </OutlinePill>
      )}

      {editing ? (
        <AddressForm
          initial={address}
          saving={isSaving}
          onCancel={() => setEditing(false)}
          onSubmit={handleSave}
        />
      ) : loading ? (
        <p className="text-[13px]" style={{ color: ACCOUNT_MUTED }}>
          Loading your address…
        </p>
      ) : !exists ? (
        <p className="text-[13px]" style={{ color: ACCOUNT_MUTED }}>
          You have no saved address yet.
        </p>
      ) : (
        <AccountColumn>
          <AccountCard>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {/* The only address there can be, so it is always the default. */}
                <div className="mb-2 flex">
                  <StatusChip>Default</StatusChip>
                </div>
                <p
                  className="text-[14px] leading-4.5 font-medium"
                  style={{ color: ACCOUNT_INK }}
                >
                  {address.street}
                </p>
                <p
                  className="mt-1 text-[13px] leading-4.5"
                  style={{ color: ACCOUNT_MUTED }}
                >
                  {formatAddress({ ...address, street: "" }).replace(
                    /^,\s*/,
                    "",
                  )}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  aria-label="Edit address"
                >
                  <Pencil
                    size={16}
                    strokeWidth={1.5}
                    style={{ color: ACCOUNT_INK }}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  disabled={isSaving}
                  aria-label="Delete address"
                >
                  <Trash2
                    size={16}
                    strokeWidth={1.5}
                    style={{ color: ACCOUNT_INK }}
                  />
                </button>
              </div>
            </div>
          </AccountCard>
        </AccountColumn>
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this address?"
        message="You will need to enter it again at checkout."
        confirmLabel="Delete address"
        busy={isSaving}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </AccountPage>
  );
}
