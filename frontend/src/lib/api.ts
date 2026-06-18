const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("konark_token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("konark_token");
      localStorage.removeItem("konark_user");
      window.location.href = "/login";
    }
    throw new Error("Unauthorised. Please log in again.");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }

  return data as T;
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function registerUser(
  name: string,
  phone: string,
  email: string,
  password: string,
  city: string
) {
  const data = await request<{ access_token: string; user: Record<string, unknown> }>(
    "/api/v1/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ name, phone, email, password, city }),
    }
  );
  if (typeof window !== "undefined" && data.access_token) {
    localStorage.setItem("konark_token", data.access_token);
    localStorage.setItem("konark_user", JSON.stringify(data.user));
  }
  return data;
}

export async function loginUser(email: string, password: string) {
  const data = await request<{ access_token: string; user: Record<string, unknown> }>(
    "/api/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );
  if (typeof window !== "undefined" && data.access_token) {
    localStorage.setItem("konark_token", data.access_token);
    localStorage.setItem("konark_user", JSON.stringify(data.user));
    localStorage.removeItem("konark_auth_prompt_last_shown");
  }
  return data;
}

export async function forgotPassword(email: string) {
  return request("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return request("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("konark_token");
    localStorage.removeItem("konark_user");
    localStorage.removeItem("konark_auth_prompt_last_shown");
  }
}

export async function getCurrentUser() {
  return request("/api/v1/auth/me");
}

export async function updateProfile(data: Record<string, unknown>) {
  return request("/api/v1/auth/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  type?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
}

export async function getProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  const qs = params.toString();
  return request(`/api/v1/products${qs ? `?${qs}` : ""}`);
}

export async function getProduct(slug: string) {
  return request(`/api/v1/products/${slug}`);
}

export async function getProductReviews(slug: string) {
  return request(`/api/v1/products/${slug}/reviews`);
}

export async function submitReview(
  slug: string,
  rating: number,
  comment: string
) {
  return request(`/api/v1/products/${slug}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating, comment }),
  });
}

// ─── ENQUIRIES ───────────────────────────────────────────────────────────────

export async function submitEnquiry(data: Record<string, unknown>) {
  return request("/api/v1/enquiries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitTestRide(data: Record<string, unknown>) {
  return submitEnquiry({ ...data, enquiry_type: "test_ride" });
}

export async function submitServiceBooking(data: Record<string, unknown>) {
  return submitEnquiry({ ...data, enquiry_type: "service" });
}

export async function submitContactForm(data: Record<string, unknown>) {
  return submitEnquiry({ ...data, enquiry_type: "contact" });
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export async function createOrder(data: Record<string, unknown>) {
  return request("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMyOrders() {
  return request("/api/v1/orders");
}

export async function getMyNotifications() {
  return request("/api/v1/users/notifications");
}

export async function getOrder(orderNumber: string) {
  return request(`/api/v1/orders/${orderNumber}`);
}

export async function cancelOrder(orderNumber: string) {
  return request(`/api/v1/orders/${orderNumber}/cancel`, { method: "POST" });
}

// ─── BATTERY SWAP ─────────────────────────────────────────────────────────────

export async function submitBatterySwap(data: Record<string, unknown>) {
  return request("/api/v1/battery-swap", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function trackBatterySwap(token: string) {
  return request(`/api/v1/battery-swap/${token.toUpperCase()}`);
}

export async function uploadBatteryPhoto(file: File): Promise<{ photo_url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/api/v1/battery-swap/upload-photo`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Upload failed");
  return data as { photo_url: string };
}
