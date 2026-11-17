const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

async function request(path, { method = "GET", body } = {}) {
  if (!BASE) {
    throw new Error("VITE_API_URL is not set. Add it to .env and restart the dev server.");
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed with status ${res.status}`);
  return data;
}

export const listListings = () => request("/listings");
export const createListing = (listing) => request("/listings", { method: "POST", body: listing });
export const updateListing = (id, changes) => request(`/listings/${id}`, { method: "PUT", body: changes });
export const deleteListing = (id) => request(`/listings/${id}`, { method: "DELETE" });
