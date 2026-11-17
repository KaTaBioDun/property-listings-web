import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="modal-title"
      className="m-auto w-[min(32rem,calc(100%-2rem))] rounded border-2 border-ink bg-panel p-0"
    >
      {open && (
        <div className="p-6">
          <h2 id="modal-title" className="font-display text-xl font-bold tracking-tight">{title}</h2>
          {children}
        </div>
      )}
    </dialog>
  );
}
