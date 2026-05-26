"use client";
import dynamic from "next/dynamic";

const AuthPromptModal = dynamic(
  () => import("@/components/ui/AuthPromptModal"),
  { ssr: false }
);

export default function ClientAuthModal() {
  return <AuthPromptModal />;
}
