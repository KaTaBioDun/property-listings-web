export default function Segmented({ label, value, onChange, options }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap justify-center gap-2">
      {options.map(([val, text]) => (
        <button
          key={val}
          type="button"
          aria-pressed={value === val}
          onClick={() => onChange(val)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            value === val
              ? "border-brand bg-brand text-on-brand"
              : "border-line bg-card text-ink hover:border-brand"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}