"use client";

import { useMutation } from "@tanstack/react-query";
import { loginAction } from "@/app/actions/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials) => {
      const result = await loginAction(credentials);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.user;
    },
  });
}
