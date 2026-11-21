import { getIdToken, signOut } from "./auth";

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export class UnauthorizedError extends Error {}

async function request(path, { method = "GET", body } = {}) {
  if (!BASE) {
    throw new Error("VITE_API_URL is not set. Add it to .env and restart the dev server.");
  }
  const token = await getIdToken();
  if (!token) throw new UnauthorizedError("Please sign in.");

  const headers = { Authorization: `Bearer ${token}` };
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    signOut();
    throw new UnauthorizedError("Your session expired. Please sign in again.");
  }
  if (!res.ok) throw new Error(data.message || `Request failed with status ${res.status}`);
  return data;
}

export const listListings = () => request("/listings");
export const createListing = (listing) => request("/listings", { method: "POST", body: listing });
export const updateListing = (id, changes) => request(`/listings/${id}`, { method: "PUT", body: changes });
export const deleteListing = (id) => request(`/listings/${id}`, { method: "DELETE" });