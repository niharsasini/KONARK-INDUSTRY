"use client";

export function useAuthGate() {
  const requireAuth = (action?: () => void, redirectPath?: string): boolean => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("konark_token");
    if (token) {
      action?.();
      return true;
    }
    if (redirectPath) {
      localStorage.setItem("konark_auth_redirect", redirectPath);
    }
    window.dispatchEvent(
      new CustomEvent("konark:require-auth", { detail: { redirectPath } })
    );
    return false;
  };

  return { requireAuth };
}
