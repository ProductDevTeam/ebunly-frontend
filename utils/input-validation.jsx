export function validateEmail(email) {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return "Please confirm your password";
  if (password !== confirm) return "Passwords do not match";
  return null;
}
