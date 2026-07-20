"use client";
import { useState, useRef, useEffect } from "react";

export default function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded-[10px] border-none bg-white px-4 py-3 text-sm text-forest-dark shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-forest"
      >
        {selectedLabel}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-[10px] bg-white shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`block w-full cursor-pointer px-4 py-2.5 text-left text-sm hover:bg-forest/5 ${
                opt.value === value ? "bg-forest/10 font-medium" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}