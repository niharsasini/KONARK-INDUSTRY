const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export type Paginated<T> = { items: T; total: number };

async function adminRequestRaw(
  path: string,
  options: RequestInit = {}
): Promise<{ data: unknown; res: Response }> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("konark_admin_token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("konark_admin_token");
      localStorage.removeItem("konark_admin_user");
      // Also clear the auth cookie — otherwise middleware still thinks this
      // session is authenticated and bounces /admin-login back to /dashboard,
      // which 401s again and redirects back here, looping forever.
      document.cookie = "admin_auth=; path=/; max-age=0";
      window.location.href = "/admin-login";
    }
    throw new Error("Unauthorised. Please log in again.");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }

  return { data, res };
}

async function adminRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { data } = await adminRequestRaw(path, options);
  return data as T;
}

/** Like adminRequest, but also returns the X-Total-Count header for pagination. */
async function adminRequestPaginated<T>(
  path: string,
  options: RequestInit = {}
): Promise<Paginated<T>> {
  const { data, res } = await adminRequestRaw(path, options);
  const totalHeader = res.headers.get("X-Total-Count");
  const items = data as T;
  const total = totalHeader ? parseInt(totalHeader, 10) : Array.isArray(items) ? items.length : 0;
  return { items, total };
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export async function getStats() {
  return adminRequest("/api/v1/admin/stats");
}

export async function getRecentActivity() {
  return adminRequest("/api/v1/admin/recent-activity");
}

export async function getNotifications() {
  return adminRequest("/api/v1/admin/notifications");
}

export async function markNotificationRead(id: string) {
  return adminRequest(`/api/v1/admin/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export async function markAllNotificationsRead() {
  return adminRequest("/api/v1/admin/notifications/mark-all-read", {
    method: "POST",
  });
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export async function getAdminProducts(
  filters: Record<string, string> = {}
) {
  const params = new URLSearchParams(filters);
  const qs = params.toString();
  return adminRequestPaginated(`/api/v1/products${qs ? `?${qs}` : ""}`);
}

export async function getProduct(slug: string) {
  return adminRequest(`/api/v1/products/${slug}`);
}

export async function createProduct(data: Record<string, unknown>) {
  return adminRequest("/api/v1/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  slug: string,
  data: Record<string, unknown>
) {
  return adminRequest(`/api/v1/products/${slug}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(slug: string) {
  return adminRequest(`/api/v1/products/${slug}`, { method: "DELETE" });
}

export async function toggleStock(slug: string) {
  return adminRequest(`/api/v1/products/${slug}/toggle-stock`, {
    method: "PATCH",
  });
}

export async function toggleFeatured(slug: string) {
  return adminRequest(`/api/v1/products/${slug}/toggle-featured`, {
    method: "PATCH",
  });
}

// ─── ENQUIRIES ───────────────────────────────────────────────────────────────

export async function getEnquiries(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  const qs = params.toString();
  return adminRequestPaginated(`/api/v1/enquiries${qs ? `?${qs}` : ""}`);
}

export async function getEnquiry(id: string) {
  return adminRequest(`/api/v1/enquiries/${id}`);
}

export async function updateEnquiryStatus(
  id: string,
  status: string,
  notes?: string
) {
  return adminRequest(`/api/v1/enquiries/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status, admin_notes: notes }),
  });
}

export async function markEnquiriesRead(ids: string[]) {
  return adminRequest("/api/v1/enquiries/bulk-read", {
    method: "POST",
    body: JSON.stringify({ enquiry_ids: ids }),
  });
}

export async function deleteEnquiry(id: string) {
  return adminRequest(`/api/v1/enquiries/${id}`, { method: "DELETE" });
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export async function getOrders(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  const qs = params.toString();
  return adminRequestPaginated(`/api/v1/orders${qs ? `?${qs}` : ""}`);
}

export async function getOrder(orderNumber: string) {
  return adminRequest(`/api/v1/orders/${orderNumber}`);
}

export async function updateOrderStatus(
  orderNumber: string,
  status: string
) {
  return adminRequest(`/api/v1/orders/${orderNumber}/status`, {
    method: "PATCH",
    body: JSON.stringify({ order_status: status }),
  });
}

export async function cancelOrder(orderNumber: string) {
  return adminRequest(`/api/v1/orders/${orderNumber}/cancel`, {
    method: "POST",
  });
}

export async function exportOrders() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("konark_admin_token")
      : null;
  const res = await fetch(`${BASE_URL}/api/v1/orders/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "konark-orders.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── SERVICES ────────────────────────────────────────────────────────────────

export async function getServiceBookings(
  filters: Record<string, string> = {}
) {
  const params = new URLSearchParams(filters);
  const qs = params.toString();
  return adminRequestPaginated(`/api/v1/services/bookings${qs ? `?${qs}` : ""}`);
}

export async function getServiceBooking(id: string) {
  return adminRequest(`/api/v1/services/bookings/${id}`);
}

export async function updateServiceBooking(
  id: string,
  data: Record<string, unknown>
) {
  return adminRequest(`/api/v1/services/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function exportServiceBookings() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("konark_admin_token")
      : null;
  const res = await fetch(`${BASE_URL}/api/v1/services/bookings/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "konark-service-bookings.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────

export async function getCustomers(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  const qs = params.toString();
  return adminRequestPaginated(`/api/v1/admin/customers${qs ? `?${qs}` : ""}`);
}

export async function getCustomer(id: string) {
  return adminRequest(`/api/v1/admin/customers/${id}`);
}

export async function toggleCustomerStatus(id: string) {
  return adminRequest(`/api/v1/admin/customers/${id}/toggle`, {
    method: "PATCH",
  });
}

export async function exportCustomers() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("konark_admin_token")
      : null;
  const res = await fetch(`${BASE_URL}/api/v1/admin/customers/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "konark-customers.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

export async function getDailyAnalytics() {
  return adminRequest("/api/v1/admin/analytics/daily");
}

export async function getTopProducts() {
  return adminRequest("/api/v1/admin/analytics/top-products");
}

export async function getRevenueAnalytics() {
  return adminRequest("/api/v1/admin/analytics/revenue");
}

export async function getOrdersByStatus() {
  return adminRequest("/api/v1/admin/analytics/orders-by-status");
}

export async function getEnquiriesByType() {
  return adminRequest("/api/v1/admin/analytics/enquiries-by-type");
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────

export async function getSettings() {
  return adminRequest("/api/v1/admin/settings");
}

export async function updateSettings(data: Record<string, unknown>) {
  return adminRequest("/api/v1/admin/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  return adminRequest("/api/v1/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}

// ─── BATTERY SWAP ─────────────────────────────────────────────────────────────

export async function getBatterySwaps(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  const qs = params.toString();
  return adminRequestPaginated(`/api/v1/battery-swap${qs ? `?${qs}` : ""}`);
}

export async function getBatterySwap(id: string) {
  return adminRequest(`/api/v1/battery-swap/admin/${id}`);
}

export async function updateBatterySwap(id: string, data: Record<string, unknown>) {
  return adminRequest(`/api/v1/battery-swap/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteBatterySwap(id: string) {
  return adminRequest(`/api/v1/battery-swap/${id}`, { method: "DELETE" });
}

export async function getBatterySwapStats() {
  return adminRequest("/api/v1/battery-swap/stats");
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

export async function getProductReviews(slug: string) {
  return adminRequest(`/api/v1/products/${slug}/reviews`);
}

export async function getAllReviews(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  const qs = params.toString();
  return adminRequestPaginated(`/api/v1/admin/reviews${qs ? `?${qs}` : ""}`);
}

export async function approveReview(id: string) {
  return adminRequest(`/api/v1/reviews/${id}/approve`, {
    method: "PATCH",
  });
}

export async function deleteReview(id: string) {
  return adminRequest(`/api/v1/reviews/${id}`, { method: "DELETE" });
}
