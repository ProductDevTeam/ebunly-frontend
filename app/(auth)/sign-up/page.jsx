"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/hooks/use-auth";
import {
  AuthButton,
  AuthFooter,
  AuthInput,
  GoogleButton,
  OrDivider,
} from "@/components/common/auth/input";

export default function SignUpPage() {
  const router = useRouter();
  const { mutate: signUp, isPending } = useSignUp();

  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    const confirmErr = validateConfirmPassword(form.password, form.confirm);
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (confirmErr) newErrors.confirm = confirmErr;
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError("");
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    signUp(
      { email: form.email, password: form.password },
      {
        onSuccess: () => {
          router.push("/home"); // redirect after signup
        },
        onError: (err) => {
          setServerError(
            err.message || "Something went wrong. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12 pb-8 font-sans max-w-md mx-auto">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="hero-heading text-gray-900 mb-2">Sign up</h1>
        <p className="paragraph text-gray-500">
          Create a free Ebunly Account
          <br />& gift to your heart&lsquo;s content
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <AuthInput
          label="Email"
          name="email"
          type="email"
          placeholder="example@gmail.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <AuthInput
          label="Create a password"
          name="password"
          type="password"
          placeholder="must be 8 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <AuthInput
          label="Confirm password"
          name="confirm"
          type="password"
          placeholder="repeat password"
          value={form.confirm}
          onChange={handleChange}
          error={errors.confirm}
          autoComplete="new-password"
        />

        {serverError && (
          <p className="paragraph-s text-red-500 text-center">{serverError}</p>
        )}

        <div className="mt-2">
          <AuthButton isLoading={isPending}>Create Account</AuthButton>
        </div>
      </form>

      {/* Divider */}
      <div className="my-6">
        <OrDivider label="Or Register with" />
      </div>

      {/* Google */}
      <GoogleButton label="Sign up with Google" />

      {/* Footer */}
      <div className="mt-auto pt-8">
        <AuthFooter
          text="Already have an account?"
          linkText="Log in"
          href="/login"
        />
      </div>
    </div>
  );
}
