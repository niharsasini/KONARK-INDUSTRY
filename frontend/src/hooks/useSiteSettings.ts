import { useEffect, useState } from "react";

export interface PublicSiteSettings {
  company_name: string;
  company_phone: string;
  company_email: string;
  company_address: string;
  company_tagline: string;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  whatsapp_number: string;
  business_hours: Record<string, unknown>;
  service_areas: string[];
  hero_tagline: string | null;
  footer_tagline: string | null;
  announcement_banner_enabled: boolean;
  announcement_banner_text: string;
  announcement_banner_link: string | null;
  announcement_banner_emoji: string;
  announcement_banner_type: string;
  whatsapp_message_template: string;
  maintenance_mode: boolean;
  maintenance_message: string;
}

let cachedSettings: PublicSiteSettings | null = null;
let inFlight: Promise<PublicSiteSettings | null> | null = null;

function fetchSettings(): Promise<PublicSiteSettings | null> {
  if (cachedSettings) return Promise.resolve(cachedSettings);
  if (inFlight) return inFlight;

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  inFlight = fetch(`${BACKEND}/api/v1/settings`)
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data) cachedSettings = data;
      return data;
    })
    .catch(() => null)
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

/** Shared hook for the public-safe site settings (tagline, banner, social links, WhatsApp template). */
export function useSiteSettings(): PublicSiteSettings | null {
  const [settings, setSettings] = useState<PublicSiteSettings | null>(cachedSettings);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      return;
    }
    fetchSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  return settings;
}
