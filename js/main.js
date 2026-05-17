(function () {
  "use strict";

  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const compareRange = document.getElementById("compare-range");
  const compareHandle = document.getElementById("compare-handle");
  const compareBefore = document.querySelector(".compare-layer--before");
  const benchmarksToggle = document.getElementById("benchmarks-toggle");
  const benchmarksPanel = document.getElementById("benchmarks-panel");
  const copyBtn = document.getElementById("copy-bibtex");
  const bibtexEl = document.getElementById("bibtex-content");
  const hero = document.querySelector(".hero");
  const heroVideo = document.getElementById("hero-video");

  /* ── Sticky header: transparent → solid ── */
  function onScroll() {
    if (window.scrollY > 48) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav ── */
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.classList.toggle("is-open");
      navLinks.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("is-open");
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ── Image comparison slider ── */
  function setCompare(value) {
    const pct = Math.min(100, Math.max(0, Number(value)));
    if (compareBefore) {
      compareBefore.style.width = pct + "%";
    }
    if (compareHandle) {
      compareHandle.style.left = pct + "%";
    }
  }

  if (compareRange) {
    compareRange.addEventListener("input", (e) => setCompare(e.target.value));
    setCompare(compareRange.value);
  }

  /* ── Benchmarks accordion ── */
  if (benchmarksToggle && benchmarksPanel) {
    benchmarksToggle.addEventListener("click", () => {
      const expanded = benchmarksToggle.getAttribute("aria-expanded") === "true";
      benchmarksToggle.setAttribute("aria-expanded", String(!expanded));
      benchmarksPanel.hidden = expanded;
    });
  }

  /* ── Copy BibTeX ── */
  if (copyBtn && bibtexEl) {
    copyBtn.addEventListener("click", async () => {
      const text = bibtexEl.innerText;
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy BibTeX";
        }, 2000);
      } catch {
        copyBtn.textContent = "Copy failed";
      }
    });
  }

  /* ── Hero: hide placeholder when video has source ── */
  function checkHeroVideo() {
    const source = heroVideo?.querySelector("source");
    const hasSrc =
      (heroVideo?.getAttribute("src") && heroVideo.getAttribute("src") !== "") ||
      (source?.getAttribute("src") && source.getAttribute("src") !== "");
    if (hasSrc && hero) {
      hero.classList.add("has-video");
    }
  }

  checkHeroVideo();

  /* ── Smooth scroll offset for fixed header ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top =
        target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 12;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ── Horizontal scroll: wheel → horizontal on results strip ── */
  const resultsScroll = document.getElementById("results-scroll");
  if (resultsScroll) {
    resultsScroll.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          resultsScroll.scrollLeft += e.deltaY;
        }
      },
      { passive: false }
    );
  }

  /* ── Active nav highlight ── */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navAnchors.forEach((a) => {
            a.style.color =
              a.getAttribute("href") === "#" + id ? "var(--text)" : "";
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));

  /* Placeholder links — update when URLs are ready */
  const TODO = "#";
  [
    ["link-paper", TODO],
    ["link-code", TODO],
    ["link-dataset", TODO],
    ["link-models", TODO],
    ["res-vqa", TODO],
    ["res-traj", TODO],
    ["res-models", TODO],
  ].forEach(([id, href]) => {
    const el = document.getElementById(id);
    if (el) el.href = href;
  });
})();
