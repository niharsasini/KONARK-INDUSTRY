"use client";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: string;
  duration?: number;
}

function parseTarget(target: string): { num: number; suffix: string; prefix: string } {
  const prefix = target.startsWith("₹") ? "₹" : "";
  const stripped = target.replace(/[₹,]/g, "");
  const suffix = stripped.replace(/[0-9.]/g, "");
  const num = parseFloat(stripped) || 0;
  return { num, suffix, prefix };
}

export default function AnimatedCounter({ target, duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const { num, suffix, prefix } = parseTarget(target);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = num / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, num, duration]);

  const display = num % 1 !== 0 ? count.toFixed(0) : count.toString();

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}
