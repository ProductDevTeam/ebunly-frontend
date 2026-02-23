export const getCurrentUser = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}auth/me`,
    );
  } catch {}
};
export const getUserProfile = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}auth/me`,
    );
  } catch {}
};
