export const TYPES = ["land", "building", "rental"];
export const TYPE_LABEL = { land: "Land", building: "Building", rental: "Rental" };
export const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
export const compact = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", notation: "compact", minimumFractionDigits: 0, maximumFractionDigits: 1 });
export const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const btn = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";
export const btnPrimary = `${btn} bg-brand text-on-brand hover:bg-brand-hover`;
export const btnQuiet = `${btn} border border-line bg-card text-ink hover:border-brand hover:text-brand`;
export const btnDanger = `${btn} bg-danger text-on-brand hover:opacity-90`;
export const fieldBase = "border border-line bg-card py-2.5 text-base text-ink placeholder:text-muted focus:border-brand";
export const field = `${fieldBase} w-full rounded-xl px-3.5`;
