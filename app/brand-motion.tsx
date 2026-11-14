"use client";

import { useEffect } from "react";

// Движение по брендбуку: блоки всплывают из воды при прокрутке, цифры добегают до значения.
// Без JS и при «уменьшить движение» всё видно сразу.
const REVEAL = [
  "main > section > *",
  ".service-card",
  ".price-card",
  ".article-card",
  ".manifesto-grid > *",
  ".feature-list > div",
  ".footer-main > div",
].join(",");

const COUNT = ".manifesto-stat strong, .hero-rail b, .op-facts b";

function countUp(el: HTMLElement) {
  const text = el.textContent ?? "";
  const match = text.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) return;
  const [, before, digits, after] = match;
  const target = Number(digits);
  const pad = digits.startsWith("0") ? digits.length : 1;
  const start = performance.now();
  const duration = 1100;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = `${before}${String(Math.round(target * eased)).padStart(pad, "0")}${after}`;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function BrandMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll<HTMLElement>(REVEAL)).filter(
      (el) => !el.closest(".hero, .pulse-strip, dialog") && el.getBoundingClientRect().top > window.innerHeight * 0.9,
    );
    items.forEach((el) => {
      const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((c) => items.includes(c as HTMLElement)) : [];
      el.style.setProperty("--reveal-delay", `${Math.min(siblings.indexOf(el), 5) * 70}ms`);
      el.classList.add("op-reveal");
    });
    root.classList.add("op-motion");

    const seen = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        seen.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((el) => seen.observe(el));

    const counters = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target as HTMLElement);
        counters.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll<HTMLElement>(COUNT).forEach((el) => counters.observe(el));

    return () => { seen.disconnect(); counters.disconnect(); };
  }, []);
  return null;
}
