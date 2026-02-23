"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useChangePassword } from "@/hooks/use-profile";
import { useNotification } from "@/components/common/notification-provider";

function PasswordField({
  label,
  name,
  value,
  onChange,
  showToggle,
  show,
  onToggle,
  error,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-sm font-medium text-gray-700"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all pr-11
            ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white focus:border-gray-900"}
          `}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          autoComplete={
            name === "currentPassword" ? "current-password" : "new-password"
          }
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {show ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p
          className="text-xs text-red-500"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function ChangePasswordModal({ isOpen, onClose }) {
  const { mutate: changePassword, isPending } = useChangePassword();
  const { error: notifyError, success: notifySuccess } = useNotification();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.currentPassword)
      newErrors.currentPassword = "Current password is required";
    if (!form.newPassword) newErrors.newPassword = "New password is required";
    else if (form.newPassword.length < 8)
      newErrors.newPassword = "Must be at least 8 characters";
    else if (form.newPassword === form.currentPassword)
      newErrors.newPassword = "Must differ from current password";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Please confirm your new password";
    else if (form.newPassword !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    changePassword(form, {
      onSuccess: () => {
        notifySuccess(
          "Your password has been updated successfully.",
          "Password changed",
        );
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        onClose();
      },
      onError: (err) => {
        notifyError(err.message, "Password change failed");
      },
    });
  };

  const handleClose = () => {
    if (isPending) return;
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto bg-white rounded-3xl shadow-2xl w-full max-w-sm px-7 py-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="font-bold text-gray-900"
                  style={{ fontSize: "1.15rem" }}
                >
                  Change password
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isPending}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4"
              >
                <PasswordField
                  label="Current password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  showToggle
                  show={show.current}
                  onToggle={() => toggleShow("current")}
                  error={errors.currentPassword}
                />
                <PasswordField
                  label="New password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  showToggle
                  show={show.new}
                  onToggle={() => toggleShow("new")}
                  error={errors.newPassword}
                />
                <PasswordField
                  label="Confirm new password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  showToggle
                  show={show.confirm}
                  onToggle={() => toggleShow("confirm")}
                  error={errors.confirmPassword}
                />

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 w-full py-3.5 rounded-2xl text-white font-semibold text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF5722 0%, #FF7043 100%)",
                  }}
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isPending ? "Updating…" : "Update password"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
