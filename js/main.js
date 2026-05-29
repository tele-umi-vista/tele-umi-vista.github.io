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

  /* ── View compare: hide placeholder when video has source ── */
  function checkViewCompareVideos() {
    document.querySelectorAll(".view-compare-media").forEach((wrap) => {
      const video = wrap.querySelector(".view-compare-video");
      const source = video?.querySelector("source");
      const hasSrc =
        (video?.getAttribute("src") && video.getAttribute("src") !== "") ||
        (source?.getAttribute("src") && source.getAttribute("src") !== "");
      if (hasSrc && video) {
        wrap.classList.add("has-video");
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.play().catch(() => {});
      }
    });
  }

  checkViewCompareVideos();

  document.querySelectorAll(".physical-vali-video").forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.play().catch(() => {});
  });

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
  const previewVideos = document.querySelectorAll(".result-media");
  const modal = document.getElementById("video-modal");
  const modalTitle = document.getElementById("video-modal-title");
  const modalPlayer = document.getElementById("video-modal-player");
  const modalClose = document.getElementById("video-modal-close");
  const modalOpenButtons = document.querySelectorAll("[data-modal-video]");

  function loadPreview(video) {
    const src = video.dataset.src;
    if (!src || video.src) return;
    video.src = src;
    video.load();
  }

  function updatePreviewVideos() {
    const margin = 360;
    previewVideos.forEach((video) => {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;

      const rect = video.getBoundingClientRect();
      const nearViewport =
        rect.top < window.innerHeight + margin && rect.bottom > -margin;

      if (nearViewport) {
        loadPreview(video);
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;

          if (entry.isIntersecting) {
            loadPreview(video);
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "360px 0px", threshold: 0.01 }
    );

    previewVideos.forEach((video) => videoObserver.observe(video));
  }

  window.addEventListener("scroll", updatePreviewVideos, { passive: true });
  window.addEventListener("resize", updatePreviewVideos);
  window.addEventListener("load", updatePreviewVideos);
  setTimeout(updatePreviewVideos, 300);
  setTimeout(updatePreviewVideos, 1200);

  function closeVideoModal() {
    if (!modal || !modalPlayer) return;
    modal.hidden = true;
    modalPlayer.pause();
    modalPlayer.removeAttribute("src");
    modalPlayer.load();
    document.body.style.overflow = "";
  }

  function openVideoModal(src, title) {
    if (!modal || !modalPlayer || !modalTitle) return;
    modalTitle.textContent = title || "Task Video";
    modal.hidden = false;
    modalPlayer.src = src;
    modalPlayer.currentTime = 0;
    modalPlayer.play().catch(() => {});
    document.body.style.overflow = "hidden";
  }

  modalOpenButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-modal-video");
      const title = btn.getAttribute("data-modal-title");
      if (!src) return;
      openVideoModal(src, title);
    });
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target instanceof HTMLElement && e.target.hasAttribute("data-close-video-modal")) {
        closeVideoModal();
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeVideoModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) {
      closeVideoModal();
    }
  });

  /* ── Active nav highlight ── */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navAnchors.forEach((a) => {
            const active = a.getAttribute("href") === "#" + id;
            a.style.color = active ? "var(--text)" : "";
            a.style.fontWeight = active ? "600" : "";
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));

  /* ── KaTeX: inline math \( ... \) and display math \[ ... \] ── */
  function renderMath() {
    if (typeof renderMathInElement !== "function") return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      throwOnError: false,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMath);
  } else {
    renderMath();
  }

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
