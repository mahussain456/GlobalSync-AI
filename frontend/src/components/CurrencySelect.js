import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export default function CurrencySelect({ currencies, value, onChange, testId }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selected = currencies.find(c => c.code === value);

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
        onClick={() => setOpen(v => !v)}
        className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all flex items-center justify-between gap-2 cursor-pointer hover:border-cyan-400/30"
        data-testid={`${testId}-trigger`}
      >
        <span className="font-semibold text-white">{selected?.code}</span>
        <span className="text-[#93B1B5] text-xs truncate flex-1 text-left ml-1">{selected?.name}</span>
        <ChevronDown className={`w-4 h-4 text-[#4F7C82] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#0B2E33]/90 backdrop-blur-2xl border border-[#4F7C82]/30 rounded-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-white/10 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#4F7C82] shrink-0 ml-1" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search currency…"
              className="flex-1 text-sm outline-none bg-transparent text-white placeholder-[#4F7C82] py-1"
              data-testid={`${testId}-search`}
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-[#4F7C82] hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Currency list */}
          <div className="max-h-56 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-[#4F7C82]">No currencies found</div>
            ) : (
              filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${
                    c.code === value ? "bg-cyan-500/20 text-cyan-300 font-semibold" : "text-[#B8E3E9]"
                  }`}
                  data-testid={`${testId}-option-${c.code}`}
                >
                  <span className="font-semibold w-10 shrink-0">{c.code}</span>
                  <span className="text-[#4F7C82] text-xs truncate">{c.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
