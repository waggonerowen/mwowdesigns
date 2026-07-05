/* MWOW hero — click or any key boots the MacBook in the photo: the homepage
   appears on its screen, the camera dives in, then the hero removes itself.
   Every refresh starts outside the computer again. */
(function () {
  const hero = document.getElementById("hero-scroll");
  const stage = document.getElementById("hero-stage");
  const zoomer = document.getElementById("zoomer");
  const photo = document.getElementById("hero-photo");
  const site = document.getElementById("screen-site");
  const veil = document.getElementById("stage-veil");
  if (!hero || !stage || !zoomer || !photo) return;

  /* a refresh always starts outside the computer, at the top, with scrolling locked */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  document.body.classList.add("hero-live");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* the MacBook screen's position inside the photo, as fractions of the image —
     snug INSIDE the glass with bezel visible, never near the keyboard */
  const SCREEN = { x0: 0.396, x1: 0.594, y0: 0.494, y1: 0.715 };

  /* map image fractions to viewport pixels under object-fit: cover */
  function screenRect() {
    const vw = stage.clientWidth;
    const vh = stage.clientHeight;
    const iw = photo.naturalWidth || 4096;
    const ih = photo.naturalHeight || 2294;
    const s = Math.max(vw / iw, vh / ih);
    const ox = (vw - iw * s) / 2;
    const oy = (vh - ih * s) / 2;
    return {
      left: ox + SCREEN.x0 * iw * s,
      top: oy + SCREEN.y0 * ih * s,
      width: (SCREEN.x1 - SCREEN.x0) * iw * s,
      height: (SCREEN.y1 - SCREEN.y0) * ih * s,
    };
  }

  function layout() {
    const r = screenRect();
    if (site) {
      site.style.left = `${r.left}px`;
      site.style.top = `${r.top}px`;
      site.style.width = `${r.width}px`;
      site.style.height = `${r.height}px`;
      site.style.fontSize = `${r.width * 0.095}px`; /* headline scales with the screen */
    }
    zoomer.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
  }
  layout();
  window.addEventListener("resize", layout);
  photo.addEventListener("load", layout);

  function finish() {
    hero.remove();
    document.body.classList.remove("hero-live");
    window.scrollTo(0, 0);
    window.removeEventListener("keydown", onKey);
  }

  let opened = false;
  function open() {
    if (opened) return;
    opened = true;
    stage.classList.add("zooming");
    if (reducedMotion) {
      finish();
      return;
    }
    layout();
    /* the homepage boots up on the screen... */
    if (site) site.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, fill: "forwards", easing: "ease-out" });
    /* ...the camera dives into it... */
    zoomer.animate(
      [{ transform: "scale(1)" }, { transform: "scale(9)" }],
      { duration: 1600, delay: 500, fill: "forwards", easing: "cubic-bezier(0.55, 0, 0.85, 1)" }
    );
    /* ...and a quick fade hands off to the real page */
    const fade = veil
      ? veil.animate([{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }], { duration: 2100, fill: "forwards", easing: "linear" })
      : zoomer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 2100, fill: "forwards" });
    fade.onfinish = finish;
  }

  /* only real user gestures count — synthetic events can't consume the intro */
  const readyAt = performance.now() + 300;
  stage.addEventListener("click", (e) => {
    if (e.isTrusted && performance.now() > readyAt) open();
  });
  function onKey(e) {
    if (e.isTrusted && performance.now() > readyAt && !e.metaKey && !e.ctrlKey && !e.altKey) open();
  }
  window.addEventListener("keydown", onKey);
  window.__mwowOpen = open; /* manual trigger for testing */
})();
