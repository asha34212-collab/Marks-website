/**
 * MARKS STRAWBERRY MILK SHAKE — CLEAN HIGH-PERFORMANCE SCROLL ENGINE
 * Pure animation focus: Zero unwanted text, zero overlays, zero visual artifacts.
 * Sub-frame temporal interpolation (cross-fading) for 60/120fps butter-smooth motion.
 * High-DPI crisp canvas rendering optimized for Chrome on desktop and mobile.
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TOTAL_FRAMES = 194; // 194 unique fluid keyframes
  const FRAME_DIR = 'frames_clean/';
  const FRAME_PREFIX = 'frame-';
  const FRAME_EXT = '.jpg';
  const LERP_SPEED = 0.12; // Inertial smooth damping factor

  // --- DOM References ---
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const loader = document.getElementById('loader');
  const progressBar = document.getElementById('progress-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const heroTitle = document.getElementById('hero-title-overlay');

  // --- State Variables ---
  const frames = [];
  let loadedCount = 0;
  let isReady = false;
  let targetProgress = 0;   // 0.0 to 1.0 (from user scroll)
  let currentProgress = 0;  // 0.0 to 1.0 (smoothly damped)
  let dpr = 1;
  let canvasW = 0;
  let canvasH = 0;

  // --- Utility: 3-digit zero pad ---
  function pad3(num) {
    if (num < 10) return '00' + num;
    if (num < 100) return '0' + num;
    return '' + num;
  }

  // --- Preload all unique frames ---
  function preloadAllFrames() {
    let completed = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `${FRAME_DIR}${FRAME_PREFIX}${pad3(i)}${FRAME_EXT}`;

      img.onload = () => {
        completed++;
        loadedCount = completed;
        const pct = Math.floor((completed / TOTAL_FRAMES) * 100);

        if (progressBar) progressBar.style.width = `${pct}%`;
        if (loaderPercent) loaderPercent.textContent = `${pct}%`;

        // Render first frame immediately as soon as ready
        if (i === 1 && !isReady) {
          drawScene(0);
        }

        if (completed === TOTAL_FRAMES) {
          onLoadingComplete();
        }
      };

      img.onerror = () => {
        console.warn(`Frame ${i} load fallback`);
        completed++;
        if (completed === TOTAL_FRAMES) onLoadingComplete();
      };

      frames[i - 1] = img;
    }
  }

  function onLoadingComplete() {
    isReady = true;
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden');
      }
      resizeCanvas();
      drawScene(currentProgress);
      updateHeroTitleFade(currentProgress);
    }, 200);
  }

  // --- High-DPI Crisp Canvas Sizing ---
  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    canvasW = Math.round(winW * dpr);
    canvasH = Math.round(winH * dpr);

    canvas.width = canvasW;
    canvas.height = canvasH;
    canvas.style.width = winW + 'px';
    canvas.style.height = winH + 'px';

    // Ensure high-quality bicubic smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (isReady) {
      drawScene(currentProgress);
    }

    updateScrollTarget();
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });

  // --- Hero Headline & Subheadline Fade (Fade away at 30% scroll of animation section) ---
  function updateHeroTitleFade(progress) {
    if (!heroTitle) return;
    const fadeThreshold = 0.30; // 30% of scroll animation section

    if (progress <= 0) {
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0px)';
      heroTitle.style.visibility = 'visible';
    } else if (progress >= fadeThreshold) {
      heroTitle.style.opacity = '0';
      heroTitle.style.transform = 'translateY(-30px)';
      heroTitle.style.visibility = 'hidden';
    } else {
      const ratio = progress / fadeThreshold; // 0.0 to 1.0
      const opacity = Math.max(0, Math.min(1, 1 - ratio));
      heroTitle.style.opacity = opacity.toFixed(3);
      heroTitle.style.transform = `translateY(${(-ratio * 30).toFixed(1)}px)`;
      heroTitle.style.visibility = 'visible';
    }
  }

  // --- Scroll Tracking ---
  function updateScrollTarget() {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const runway = document.getElementById('scroll-runway');
    const stickyBar = document.getElementById('sticky-checkout-bar');

    if (runway) {
      // Calculate progress across the animation runway
      const runwayDistance = Math.max(1, runway.offsetHeight - window.innerHeight);
      targetProgress = Math.min(1, Math.max(0, scrollY / runwayDistance));

      // Reveal sticky quick-checkout bar as user enters the product content sections
      if (stickyBar) {
        if (scrollY > runwayDistance * 0.75) {
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
        }
      }
    } else {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress = maxScroll <= 0 ? 0 : Math.min(1, Math.max(0, scrollY / maxScroll));
    }

    updateHeroTitleFade(targetProgress);
  }

  window.addEventListener('scroll', updateScrollTarget, { passive: true });

  // --- Render Scene with Crisp Discrete Frame (Zero Ghosting / Zero Blur) ---
  function drawScene(progress) {
    if (!frames.length) return;

    // Clean background fill matching the theme
    ctx.fillStyle = '#f2c0c1';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Compute exact frame index — discrete nearest frame avoids any blurry ghosting
    const clampedProgress = Math.min(1, Math.max(0, progress));
    const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(clampedProgress * (TOTAL_FRAMES - 1))));

    const img = frames[frameIndex];
    if (!img || !img.complete) return;

    // Source dimensions: 1280 x 720 (16:9)
    const srcW = 1280;
    const srcH = 720;

    // Full-bleed cover scaling to ensure no seams or borders on desktop & mobile
    const scale = Math.max(canvasW / srcW, canvasH / srcH);
    const drawW = Math.round(srcW * scale);
    const drawH = Math.round(srcH * scale);
    const drawX = Math.round((canvasW - drawW) / 2);
    const drawY = Math.round((canvasH - drawH) / 2);

    // High quality bicubic resampling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  // --- Smooth Animation Damping Loop (60fps / 120fps) ---
  let lastProgress = -1;

  function loop() {
    if (isReady) {
      // Smooth lerp towards target scroll position
      const diff = targetProgress - currentProgress;
      currentProgress += diff * LERP_SPEED;

      // Update hero title fade in sync with smooth animation progress
      updateHeroTitleFade(currentProgress);

      // Only repaint when there is noticeable movement
      if (Math.abs(currentProgress - lastProgress) > 0.0001) {
        drawScene(currentProgress);
        lastProgress = currentProgress;
      }
    }

    requestAnimationFrame(loop);
  }

  // --- Initialize ---
  resizeCanvas();
  preloadAllFrames();
  requestAnimationFrame(loop);

})();
