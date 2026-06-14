"use client";

import { useState, useRef } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import StepIndicator from "@/components/forms/battery-swap/StepIndicator";
import SwapSuccess from "@/components/forms/battery-swap/SwapSuccess";
import Step1Details from "@/components/forms/battery-swap/Step1Details";
import Step2Battery from "@/components/forms/battery-swap/Step2Battery";
import Step3Schedule from "@/components/forms/battery-swap/Step3Schedule";
import Step4Review from "@/components/forms/battery-swap/Step4Review";
import type { BatterySwapFormState } from "@/components/forms/battery-swap/types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function BatterySwapPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ token: string; phone: string; email: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // ── Form state ───────────────────────────────────────────────────────────────
  // Step 1
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  // Step 2
  const [batteryBrand, setBatteryBrand] = useState("");
  const [batteryType, setBatteryType] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");
  const [purchaseYear, setPurchaseYear] = useState("");
  const [chargePercent, setChargePercent] = useState(50);
  const [batteryCondition, setBatteryCondition] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [hasPhysicalDamage, setHasPhysicalDamage] = useState(false);
  const [damageDescription, setDamageDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  // Step 3
  const [swapLocation, setSwapLocation] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  // Step 4
  const [termsAgreed, setTermsAgreed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // ── Validation ───────────────────────────────────────────────────────────────

  function validateStep1() {
    if (!name.trim()) return "Please enter your full name";
    if (!/^\d{10}$/.test(phone.replace(/\D/g, "").slice(-10))) return "Please enter a valid 10-digit phone number";
    if (!city) return "Please select your city";
    if (!address.trim() || address.length < 5) return "Please enter your full address";
    return "";
  }

  function validateStep2() {
    if (!batteryBrand.trim()) return "Please enter the battery brand";
    if (!batteryType) return "Please select the battery type";
    if (!batteryCapacity) return "Please select the battery capacity";
    if (!purchaseYear) return "Please select the purchase year";
    if (!batteryCondition) return "Please select the battery condition";
    return "";
  }

  function validateStep3() {
    if (!swapLocation) return "Please select the swap location";
    if (!preferredDate) return "Please select a preferred date";
    if (!timeSlot) return "Please select a time slot";
    return "";
  }

  // ── Photo upload ─────────────────────────────────────────────────────────────

  async function handlePhotoUpload(file: File) {
    setUploadStatus("uploading");
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 20, 80));
      }, 200);

      const res = await fetch(`${BASE_URL}/api/v1/battery-swap/upload-photo`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }

      const data = await res.json();
      setPhotoUrl(data.photo_url);
      setUploadStatus("done");
    } catch (e: unknown) {
      setUploadStatus("error");
      setError(e instanceof Error ? e.message : "Photo upload failed");
    }
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!termsAgreed) { setError("Please agree to the terms before submitting"); return; }
    setSubmitting(true);
    setError("");

    const payload = {
      name, phone, email: email || undefined, city, address,
      battery_brand: batteryBrand,
      battery_capacity: batteryCapacity,
      battery_type: batteryType,
      purchase_year: parseInt(purchaseYear),
      current_charge_percent: chargePercent,
      battery_condition: batteryCondition,
      battery_serial_number: serialNumber || undefined,
      battery_photo_url: photoUrl || undefined,
      any_physical_damage: hasPhysicalDamage,
      damage_description: hasPhysicalDamage ? damageDescription : undefined,
      preferred_date: preferredDate,
      preferred_time_slot: timeSlot,
      swap_location: swapLocation,
      special_instructions: specialInstructions || undefined,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/v1/battery-swap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Submission failed");
      setResult({ token: data.token_number, phone, email });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function copyToken() {
    if (result?.token) {
      navigator.clipboard.writeText(result.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const chargeColor = chargePercent <= 20 ? "#ef4444" : chargePercent <= 50 ? "#f97316" : "#10b981";

  function goToStep(n: number, validate?: () => string) {
    if (validate) {
      const err = validate();
      if (err) { setError(err); return; }
    }
    setError("");
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ═══ SUCCESS STATE ══════════════════════════════════════════════════════════

  if (result) {
    return <SwapSuccess result={result} copied={copied} onCopyToken={copyToken} />;
  }

  // ═══ FORM ═══════════════════════════════════════════════════════════════════

  const form: BatterySwapFormState = {
    name, setName, phone, setPhone, email, setEmail, city, setCity, address, setAddress,
    batteryBrand, setBatteryBrand, batteryType, setBatteryType, batteryCapacity, setBatteryCapacity,
    purchaseYear, setPurchaseYear, chargePercent, setChargePercent, chargeColor,
    batteryCondition, setBatteryCondition, serialNumber, setSerialNumber,
    hasPhysicalDamage, setHasPhysicalDamage, damageDescription, setDamageDescription,
    photoPreview, uploadProgress, uploadStatus, fileInputRef, handlePhotoUpload,
    swapLocation, setSwapLocation, preferredDate, setPreferredDate, minDate, maxDate,
    timeSlot, setTimeSlot, specialInstructions, setSpecialInstructions,
    termsAgreed, setTermsAgreed, error, submitting, handleSubmit, goToStep,
    validateStep1, validateStep2, validateStep3,
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0f1e" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 0" }}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Battery Swap" }]} />
      </div>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", padding: "20px 24px 80px", textAlign: "center" }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
            borderRadius: 999, border: "1px solid rgba(0,212,255,0.4)", color: "#00d4ff",
            fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
            background: "rgba(0,212,255,0.08)", marginBottom: 20,
          }}>
            NEW SERVICE ⚡
          </span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 16px", lineHeight: 1.15 }}>
            Battery Swap Service
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#94a3b8", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Hand us your discharged battery.<br />Drive away with a fully charged one.<br />
            <strong style={{ color: "#f1f5f9" }}>No waiting. No hassle.</strong>
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["⚡ Charged in minutes", "🔋 Same capacity guaranteed", "📍 Home pickup available"].map((pill) => (
              <span key={pill} style={{
                padding: "6px 14px", borderRadius: 999, background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.2)", color: "#94a3b8", fontSize: 13,
              }}>{pill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <StepIndicator current={step} />

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#ef4444", fontSize: 14,
            }}>
              ⚠️ {error}
            </div>
          )}

          {step === 1 && (
            <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px", marginBottom: 0 }}>
              <Step1Details form={form} />
            </div>
          )}

          {step === 2 && (
            <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px", marginBottom: 0 }}>
              <Step2Battery form={form} />
            </div>
          )}

          {step === 3 && (
            <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px", marginBottom: 0 }}>
              <Step3Schedule form={form} />
            </div>
          )}

          {step === 4 && (
            <div style={{ background: "#0f172a", border: "1px solid #1e2d40", borderRadius: 16, padding: "32px", marginBottom: 0 }}>
              <Step4Review form={form} />
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .step-bar-desktop { display: none !important; }
          .step-bar-mobile { display: block !important; }
        }
        @media (min-width: 641px) {
          .step-bar-mobile { display: none !important; }
        }
      `}</style>
    </main>
  );
}
