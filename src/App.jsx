import { useCallback, useEffect, useMemo, useState } from "react";
import { createListing, deleteListing, listListings, updateListing } from "./api";
import { TYPES, TYPE_LABEL, btnDanger, btnPrimary, btnQuiet, compact, fieldBase } from "./lib/format";
import ListingCard from "./components/ListingCard";
import ListingForm from "./components/ListingForm";
import Modal from "./components/Modal";
import Segmented from "./components/Segmented";

const cardSize = "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]";

export default function App() {
  const [listings, setListings] = useState([]);
  const [phase, setPhase] = useState("loading");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((text, kind = "ok") => setToast({ text, kind, id: Date.now() }), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const load = useCallback(async () => {
    setPhase("loading");
    try {
      setListings(await listListings());
      setPhase("ready");
    } catch (e) {
      setError(e.message);
      setPhase("error");
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function save(values) {
    if (editing?.listingId) {
      const updated = await updateListing(editing.listingId, values);
      setListings((l) => l.map((x) => (x.listingId === updated.listingId ? updated : x)));
      notify("Listing updated");
    } else {
      const created = await createListing(values);
      setListings((l) => [created, ...l]);
      notify("Listing created");
    }
    setEditing(null);
  }

  async function toggle(item) {
    const next = item.status === "sold" ? "available" : "sold";
    setBusyId(item.listingId);
    try {
      const updated = await updateListing(item.listingId, { status: next });
      setListings((l) => l.map((x) => (x.listingId === updated.listingId ? updated : x)));
      notify(next === "sold" ? "Listing marked as sold" : "Listing reopened");
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    setDeletingBusy(true);
    try {
      await deleteListing(deleting.listingId);
      setListings((l) => l.filter((x) => x.listingId !== deleting.listingId));
      notify("Listing deleted");
      setDeleting(null);
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setDeletingBusy(false);
    }
  }

  const stats = useMemo(() => {
    const open = listings.filter((l) => l.status !== "sold");
    return { total: listings.length, available: open.length, value: open.reduce((s, l) => s + l.price, 0) };
  }, [listings]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = listings.filter(
      (l) =>
        (type === "all" || l.type === type) &&
        (status === "all" || l.status === status) &&
        (!q || `${l.title} ${l.location}`.toLowerCase().includes(q))
    );
    const order = {
      newest: (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
    };
    return rows.sort(order[sort]);
  }, [listings, query, type, status, sort]);

  const clearFilters = () => { setQuery(""); setType("all"); setStatus("all"); };
  const panel = "rounded-3xl border border-dashed border-line bg-card p-12 text-center";

  return (
    <div className="min-h-screen bg-page font-body text-ink">
      <nav className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-on-brand" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
                <path d="M4 11 12 4l8 7M6 10v10h12V10" />
              </svg>
            </span>
            <span className="font-display text-lg font-semibold">Listings</span>
          </div>
          <button onClick={() => setEditing({})} className={btnPrimary}>New listing</button>
        </div>
      </nav>

      <header className="mx-auto max-w-3xl px-5 pb-8 pt-14 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Property listings</h1>
        <p className="mx-auto mt-3 max-w-lg text-lg text-muted">
          {phase === "ready" && stats.total > 0
            ? `${stats.available} of ${stats.total} listings are available, worth ${compact.format(stats.value)}.`
            : "Land, buildings and rentals in one place."}
        </p>

        {phase === "ready" && listings.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="relative w-full max-w-xl">
              <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search listings"
                placeholder="Search by title or location"
                className={`${fieldBase} w-full rounded-full pl-11 pr-4`}
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Segmented label="Type" value={type} onChange={setType}
                options={[["all", "All types"], ...TYPES.map((t) => [t, TYPE_LABEL[t]])]} />
              <Segmented label="Status" value={status} onChange={setStatus}
                options={[["all", "Any status"], ["available", "Available"], ["sold", "Sold"]]} />
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort listings" className={`${fieldBase} rounded-full px-4`}>
                <option value="newest">Newest first</option>
                <option value="low">Price, low to high</option>
                <option value="high">Price, high to low</option>
              </select>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20">
        {phase === "loading" && (
          <ul className="flex flex-wrap justify-center gap-6" aria-label="Loading listings">
            {[0, 1, 2].map((i) => <li key={i} className={`h-96 animate-pulse rounded-[20px] border border-line bg-card ${cardSize}`} />)}
          </ul>
        )}

        {phase === "error" && (
          <div role="alert" className={`${panel} mx-auto max-w-2xl`}>
            <h2 className="font-display text-xl font-bold">Listings could not be loaded</h2>
            <p className="mt-1 text-muted">{error}</p>
            <p className="mt-1 text-sm text-muted">
              Check that VITE_API_URL in .env matches your API, and that its CORS settings allow this page's address.
            </p>
            <button onClick={load} className={`${btnPrimary} mt-5`}>Try again</button>
          </div>
        )}

        {phase === "ready" && listings.length === 0 && (
          <div className={`${panel} mx-auto max-w-2xl`}>
            <h2 className="font-display text-xl font-bold">No listings yet</h2>
            <p className="mt-1 text-muted">Add your first listing to see it here.</p>
            <button onClick={() => setEditing({})} className={`${btnPrimary} mt-5`}>New listing</button>
          </div>
        )}

        {phase === "ready" && listings.length > 0 && (
          <>
            <p className="mb-6 text-center text-sm text-muted">
              Showing {visible.length} of {stats.total} listings
            </p>
            {visible.length > 0 ? (
              <ul className="flex flex-wrap justify-center gap-6">
                {visible.map((item) => (
                  <ListingCard
                    key={item.listingId}
                    item={item}
                    busy={busyId === item.listingId}
                    onEdit={setEditing}
                    onToggle={toggle}
                    onDelete={setDeleting}
                  />
                ))}
              </ul>
            ) : (
              <div className={`${panel} mx-auto max-w-2xl`}>
                <h2 className="font-display text-xl font-bold">No listings match these filters</h2>
                <button onClick={clearFilters} className={`${btnQuiet} mt-5`}>Clear filters</button>
              </div>
            )}
          </>
        )}
      </main>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.listingId ? "Edit listing" : "New listing"}>
        {editing !== null && <ListingForm initial={editing} onSave={save} onCancel={() => setEditing(null)} />}
      </Modal>

      <Modal open={deleting !== null} onClose={() => setDeleting(null)} title="Delete this listing?">
        {deleting && (
          <>
            <p className="mt-3 text-muted">“{deleting.title}” will be removed permanently. This cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setDeleting(null)} className={btnQuiet}>Keep listing</button>
              <button onClick={confirmDelete} disabled={deletingBusy} className={btnDanger}>
                {deletingBusy ? "Deleting…" : "Delete listing"}
              </button>
            </div>
          </>
        )}
      </Modal>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg ${
            toast.kind === "error" ? "bg-danger text-on-brand" : "bg-ink text-on-brand"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}