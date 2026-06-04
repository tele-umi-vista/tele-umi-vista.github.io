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

  /* ── Results: 20-task preview videos ── */
  const previewVideos = document.querySelectorAll(".result-media");
  const modal = document.getElementById("video-modal");
  const modalTitle = document.getElementById("video-modal-title");
  const modalPlayer = document.getElementById("video-modal-player");
  const modalClose = document.getElementById("video-modal-close");

  const ICONS = {
    play:
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>',
    pause:
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>',
    volume:
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.74 2.5-2.28 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
    muted:
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
    expand:
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
  };

  function formatVideoTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ":" + String(s).padStart(2, "0");
  }

  function initResultMediaControls() {
    document.querySelectorAll(".result-media-player").forEach((player) => {
      const video = player.querySelector(".result-media");
      if (!video || player.querySelector(".result-media-shell")) return;

      const shell = document.createElement("div");
      shell.className = "result-media-shell";
      video.parentNode.insertBefore(shell, video);
      shell.appendChild(video);

      const controls = document.createElement("div");
      controls.className = "result-media-controls";
      controls.innerHTML =
        '<input type="range" class="result-media-progress" min="0" max="1000" value="0" step="1" aria-label="Playback position" />' +
        '<div class="result-media-bar">' +
        '<div class="result-media-bar-left">' +
        '<button type="button" class="result-media-icon-btn result-media-play" aria-label="Pause">' +
        ICONS.pause +
        "</button>" +
        '<span class="result-media-time">' +
        '<span class="result-media-time-current">0:00</span> / <span class="result-media-time-duration">0:00</span>' +
        "</span></div>" +
        '<div class="result-media-bar-right">' +
        '<button type="button" class="result-media-icon-btn result-media-mute" aria-label="Unmute">' +
        ICONS.muted +
        "</button>" +
        '<button type="button" class="result-media-icon-btn result-media-expand" aria-label="Enlarge video">' +
        ICONS.expand +
        "</button></div></div>";
      shell.appendChild(controls);

      const progress = controls.querySelector(".result-media-progress");
      const playBtn = controls.querySelector(".result-media-play");
      const muteBtn = controls.querySelector(".result-media-mute");
      const expandBtn = controls.querySelector(".result-media-expand");
      const timeCurrent = controls.querySelector(".result-media-time-current");
      const timeDuration = controls.querySelector(".result-media-time-duration");
      let seeking = false;

      function setPlayIcon() {
        if (!playBtn) return;
        const paused = video.paused;
        playBtn.innerHTML = paused ? ICONS.play : ICONS.pause;
        playBtn.setAttribute("aria-label", paused ? "Play" : "Pause");
      }

      function setMuteIcon() {
        if (!muteBtn) return;
        muteBtn.innerHTML = video.muted ? ICONS.muted : ICONS.volume;
        muteBtn.setAttribute("aria-label", video.muted ? "Unmute" : "Mute");
      }

      function syncProgress() {
        if (seeking || !progress) return;
        const duration = video.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;
        progress.value = String(Math.round((video.currentTime / duration) * 1000));
        if (timeCurrent) timeCurrent.textContent = formatVideoTime(video.currentTime);
      }

      function syncDuration() {
        if (timeDuration) timeDuration.textContent = formatVideoTime(video.duration);
        syncProgress();
      }

      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      setPlayIcon();
      setMuteIcon();

      video.addEventListener("loadedmetadata", syncDuration);
      video.addEventListener("durationchange", syncDuration);
      video.addEventListener("timeupdate", syncProgress);
      video.addEventListener("play", setPlayIcon);
      video.addEventListener("pause", setPlayIcon);

      playBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (video.paused) {
          playPreview(video);
        } else {
          video.pause();
        }
      });

      muteBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        setMuteIcon();
      });

      expandBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        const src = player.getAttribute("data-modal-video");
        const title = player.getAttribute("data-modal-title");
        if (src) openVideoModal(src, title);
      });

      if (progress) {
        const onSeekStart = (e) => {
          seeking = true;
          player.classList.add("is-seeking");
          e.stopPropagation();
        };
        const onSeekEnd = (e) => {
          seeking = false;
          player.classList.remove("is-seeking");
          if (e) e.stopPropagation();
        };

        progress.addEventListener("mousedown", onSeekStart);
        progress.addEventListener("touchstart", onSeekStart, { passive: true });
        progress.addEventListener("input", (e) => {
          e.stopPropagation();
          const duration = video.duration;
          if (!Number.isFinite(duration) || duration <= 0) return;
          video.currentTime = (Number(progress.value) / 1000) * duration;
          if (timeCurrent) timeCurrent.textContent = formatVideoTime(video.currentTime);
        });
        progress.addEventListener("mouseup", onSeekEnd);
        progress.addEventListener("touchend", onSeekEnd);
        progress.addEventListener("change", onSeekEnd);
      }

      controls.addEventListener("click", (e) => e.stopPropagation());
      controls.addEventListener("pointerdown", (e) => e.stopPropagation());
    });
  }

  initResultMediaControls();

  function isResultPreviewVisible(video) {
    const primaryPanel = video.closest("[data-results-primary-panel]");
    if (primaryPanel && primaryPanel.hidden) return false;
    return true;
  }

  function initResultsTabs() {
    const primaryTabs = document.querySelectorAll("[data-results-primary]");
    const primaryPanels = document.querySelectorAll("[data-results-primary-panel]");

    if (!primaryTabs.length) return;

    function activatePrimary(id) {
      primaryTabs.forEach((tab) => {
        const active = tab.dataset.resultsPrimary === id;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.tabIndex = active ? 0 : -1;
      });
      primaryPanels.forEach((panel) => {
        panel.hidden = panel.dataset.resultsPrimaryPanel !== id;
      });
      if (id === "model-eval") {
        updatePreviewVideos();
      } else {
        previewVideos.forEach((video) => video.pause());
      }
    }

    primaryTabs.forEach((tab) => {
      tab.addEventListener("click", () => activatePrimary(tab.dataset.resultsPrimary));
    });

    activatePrimary("diagnostic");
  }

  function loadPreview(video) {
    const src = video.dataset.src;
    if (!src || video.src) return;
    video.src = src;
    video.load();
  }

  function playPreview(video) {
    if (!isResultPreviewVisible(video)) {
      video.pause();
      return;
    }
    loadPreview(video);
    video.play().catch(() => {});
  }

  function updatePreviewVideos() {
    const margin = 360;
    previewVideos.forEach((video) => {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;

      if (!isResultPreviewVisible(video)) {
        video.pause();
        return;
      }

      const rect = video.getBoundingClientRect();
      const nearViewport =
        rect.top < window.innerHeight + margin && rect.bottom > -margin;

      if (nearViewport) {
        playPreview(video);
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

          if (entry.isIntersecting && isResultPreviewVisible(video)) {
            playPreview(video);
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "200px 0px", threshold: 0.08 }
    );

    previewVideos.forEach((video) => videoObserver.observe(video));
  }

  initResultsTabs();

  window.addEventListener("scroll", updatePreviewVideos, { passive: true });
  window.addEventListener("resize", updatePreviewVideos);
  window.addEventListener("load", updatePreviewVideos);
  setTimeout(updatePreviewVideos, 300);
  setTimeout(updatePreviewVideos, 1200);

  /* ── Video modal (full-screen) ── */
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
    modalPlayer.muted = false;
    modalPlayer.currentTime = 0;
    modalPlayer.play().catch(() => {});
    document.body.style.overflow = "hidden";
  }

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

  /* External resource links */
  [
    ["link-paper", "https://arxiv.org/abs/2606.04708"],
    ["link-code", "https://github.com/TeleHuman/umi-vista"],
    ["link-dataset", "https://huggingface.co/collections/TeleEmbodied/vista"],
    ["link-models", "https://huggingface.co/collections/TeleEmbodied/vista"],
    ["res-vqa", "https://huggingface.co/collections/TeleEmbodied/vista"],
    ["res-traj", "https://huggingface.co/collections/TeleEmbodied/vista"],
    ["res-checkpoints", "https://huggingface.co/collections/TeleEmbodied/vista"],
    ["res-code", "https://github.com/TeleHuman/umi-vista"],
  ].forEach(([id, href]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = href;
    if (href && href !== "#" && !href.startsWith("#")) {
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
  });
})();
