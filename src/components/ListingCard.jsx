import { TYPE_LABEL, btn, btnPrimary, btnQuiet, dateFmt, money } from "../lib/format";
import Plan from "./Plan";

export default function ListingCard({ item, busy, onEdit, onToggle, onDelete }) {
  const sold = item.status === "sold";
  return (
    <li className="flex w-full flex-col rounded-[20px] border border-line bg-card p-2 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
      <div className="relative aspect-16/10 overflow-hidden rounded-[14px] bg-mint">
        <div className={`h-full w-full ${sold ? "opacity-50 grayscale" : ""}`}>
          <Plan type={item.type} />
        </div>
        <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          sold ? "bg-ink text-on-brand" : "bg-card text-brand"
        }`}>
          {!sold && <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />}
          {sold ? "Sold" : "Available"}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-card/85 px-3 py-1 text-xs font-medium">
          {TYPE_LABEL[item.type]}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <p className={`font-display text-2xl font-bold tracking-tight tabular-nums ${sold ? "text-muted" : "text-brand"}`}>
          {money.format(item.price)}
        </p>
        <h2 className="mt-1 text-lg font-semibold leading-snug">{item.title}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {item.location}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          Added {item.createdAt ? dateFmt.format(new Date(item.createdAt)) : "recently"}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <button onClick={() => onToggle(item)} disabled={busy} className={sold ? btnQuiet : btnPrimary}>
            {busy ? "Saving…" : sold ? "Reopen" : "Mark as sold"}
          </button>
          <button onClick={() => onEdit(item)} className={btnQuiet}>Edit</button>
          <button onClick={() => onDelete(item)} className={`${btn} ml-auto text-danger hover:bg-danger/10`}>Delete</button>
        </div>
      </div>
    </li>
  );
}