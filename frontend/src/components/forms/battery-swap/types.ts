import type { Dispatch, RefObject, SetStateAction } from "react";

export interface BatterySwapFormState {
  // Step 1 — Your Details
  name: string; setName: Dispatch<SetStateAction<string>>;
  phone: string; setPhone: Dispatch<SetStateAction<string>>;
  email: string; setEmail: Dispatch<SetStateAction<string>>;
  city: string; setCity: Dispatch<SetStateAction<string>>;
  address: string; setAddress: Dispatch<SetStateAction<string>>;

  // Step 2 — Battery Info
  batteryBrand: string; setBatteryBrand: Dispatch<SetStateAction<string>>;
  batteryType: string; setBatteryType: Dispatch<SetStateAction<string>>;
  batteryCapacity: string; setBatteryCapacity: Dispatch<SetStateAction<string>>;
  purchaseYear: string; setPurchaseYear: Dispatch<SetStateAction<string>>;
  chargePercent: number; setChargePercent: Dispatch<SetStateAction<number>>;
  chargeColor: string;
  batteryCondition: string; setBatteryCondition: Dispatch<SetStateAction<string>>;
  serialNumber: string; setSerialNumber: Dispatch<SetStateAction<string>>;
  hasPhysicalDamage: boolean; setHasPhysicalDamage: Dispatch<SetStateAction<boolean>>;
  damageDescription: string; setDamageDescription: Dispatch<SetStateAction<string>>;
  photoPreview: string;
  uploadProgress: number;
  uploadStatus: "idle" | "uploading" | "done" | "error";
  fileInputRef: RefObject<HTMLInputElement | null>;
  handlePhotoUpload: (file: File) => Promise<void>;

  // Step 3 — Schedule
  swapLocation: string; setSwapLocation: Dispatch<SetStateAction<string>>;
  preferredDate: string; setPreferredDate: Dispatch<SetStateAction<string>>;
  minDate: string;
  maxDate: string;
  timeSlot: string; setTimeSlot: Dispatch<SetStateAction<string>>;
  specialInstructions: string; setSpecialInstructions: Dispatch<SetStateAction<string>>;

  // Step 4 — Review & Confirm
  termsAgreed: boolean; setTermsAgreed: Dispatch<SetStateAction<boolean>>;
  error: string;
  submitting: boolean;
  handleSubmit: () => Promise<void>;

  // Shared
  goToStep: (n: number, validate?: () => string) => void;
  validateStep1: () => string;
  validateStep2: () => string;
  validateStep3: () => string;
}
