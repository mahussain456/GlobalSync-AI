import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export default function CurrencySelect({ currencies, value, onChange, testId }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selected = currencies.find(c => c.code === value?.toUpperCase()) || currencies[0];

  const filtered = search.trim()
    ? currencies.filter(c =>
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : currencies;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (code) => {
    onChange(code);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative w-full" data-testid={testId}>
      {/* Trigger button */}
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Currency: ${selected?.code || "Select"}`}
        onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}
        onClick={() => setOpen(v => !v)}
        className="w-full h-12 px-4 rounded-xl border border-line bg-surface text-ink text-sm outline-none focus:border-line400/50 focus:bg-surface transition-all flex items-center justify-between gap-2 cursor-pointer hover:border-line400/30"
        data-testid={`${testId}-trigger`}
      >
        <span className="font-semibold text-ink">{selected?.code}</span>
        <span className="text-quiet text-xs truncate flex-1 text-left ml-1">{selected?.name}</span>
        <ChevronDown className={`w-4 h-4 text-quiet shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-paper  border border-line rounded-xl  overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-line flex items-center gap-2">
            <Search className="w-4 h-4 text-quiet shrink-0 ml-1" />
            <input
              ref={searchRef}
              aria-label="Search currencies"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search currency…"
              className="flex-1 text-sm outline-none bg-transparent text-ink placeholder-gem-mist/50 py-1"
              data-testid={`${testId}-search`}
            />
            {search && (
              <button aria-label="Clear currency search" onClick={() => setSearch("")} className="text-quiet hover:text-ink">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Currency list */}
          <div className="max-h-56 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-quiet">No currencies found</div>
            ) : (
              filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface ${
                    c.code === value?.toUpperCase() ? "bg-gem-gold/20 text-pine font-semibold" : "text-ink"
                  }`}
                  data-testid={`${testId}-option-${c.code}`}
                >
                  <span className="font-semibold w-10 shrink-0">{c.code}</span>
                  <span className="text-quiet text-xs truncate">{c.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
