import { useState } from "react";
import { TYPES, TYPE_LABEL, btnPrimary, btnQuiet, field, fieldBase } from "../lib/format";
import Select from "./Select";

export default function ListingForm({ initial, onSave, onCancel }) {
  const [v, setV] = useState({
    title: initial.title ?? "",
    location: initial.location ?? "",
    price: initial.price ?? "",
    type: initial.type ?? "land",
    status: initial.status ?? "available",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const editing = Boolean(initial.listingId);

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    const price = Number(v.price);
    if (!v.title.trim()) errs.title = "Enter a title.";
    if (!v.location.trim()) errs.location = "Enter a location.";
    if (v.price === "" || Number.isNaN(price) || price < 0) errs.price = "Enter a price of 0 or more.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    setSubmitError("");
    try {
      await onSave({ title: v.title.trim(), location: v.location.trim(), price, type: v.type, status: v.status });
    } catch (err) {
      setSubmitError(err.message);
      setSaving(false);
    }
  }

  const input = (id, label, props = {}) => (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      <input
        id={id}
        value={v[id]}
        onChange={set(id)}
        aria-invalid={Boolean(errors[id])}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        className={field}
        {...props}
      />
      {errors[id] && <p id={`${id}-error`} className="mt-1 text-sm text-danger">{errors[id]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="mt-5 space-y-4">
      {input("title", "Title", { placeholder: "Corner plot, 600 sqm", autoFocus: true })}
      {input("location", "Location", { placeholder: "Lekki, Lagos" })}
      {input("price", "Price in naira", { type: "number", min: 0, inputMode: "numeric", placeholder: "45000000" })}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium">Type</label>
          <Select id="type" value={v.type} onChange={set("type")} className={`${fieldBase} w-full rounded-xl pl-3.5`}>
            {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
          </Select>
        </div>
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">Status</label>
          <Select id="status" value={v.status} onChange={set("status")} className={`${fieldBase} w-full rounded-xl pl-3.5`}>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </Select>
        </div>
      </div>
      {submitError && <p role="alert" className="text-sm text-danger">{submitError}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className={btnQuiet}>Cancel</button>
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? "Saving…" : editing ? "Save changes" : "Create listing"}
        </button>
      </div>
    </form>
  );
}
