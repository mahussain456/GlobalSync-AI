import { useEffect, useRef } from "react";
import { countUp } from "@/lib/reveal";

// Renders "85+" and counts the 85 up from zero when it first appears on screen.
// Non-numeric values render as plain text.
export default function CountUp({ value, className }) {
  const ref = useRef(null);
  const m = /^(\d[\d,]*)(.*)$/.exec(String(value));
  const target = m ? Number(m[1].replace(/,/g, "")) : NaN, suffix = m ? m[2] : "";
  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target)) return undefined;
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { countUp(el, target, { suffix }); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, suffix]);
  return <span ref={ref} className={className} suppressHydrationWarning>{value}</span>;
}
