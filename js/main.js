/* MWOW® shared behaviors: theme toggle, nav, reveals, marquee, tilt, process line, forms */

/* light/dark toggle — theme itself is applied by the inline <head> snippet before paint */
const themeBtn = document.getElementById("theme-toggle");
function paintThemeIcon() {
  if (themeBtn) themeBtn.textContent = document.documentElement.dataset.theme === "light" ? "☾" : "☀";
}
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("mwow-theme", next);
    paintThemeIcon();
  });
  paintThemeIcon();
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* nav background on scroll */
const nav = document.querySelector(".nav");
const onNav = () => nav.classList.toggle("scrolled", window.scrollY > 24);
onNav();
window.addEventListener("scroll", onNav, { passive: true });

/* reveal on scroll */
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.14 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* scroll-linked marquee + process line */
const marquee = document.querySelector(".marquee-track");
const processLine = document.querySelector(".process-line i");
const processSection = document.querySelector(".process");

function onScrollFx() {
  if (marquee && !reducedMotion) {
    marquee.style.transform = `translateX(${-(window.scrollY * 0.35) % (marquee.scrollWidth / 2)}px)`;
  }
  if (processLine && processSection) {
    const r = processSection.getBoundingClientRect();
    const total = r.height + window.innerHeight * 0.4;
    const done = Math.min(Math.max(window.innerHeight * 0.7 - r.top, 0), total);
    processLine.parentElement.style.setProperty("--progress", (done / total).toFixed(3));
  }
  ticking = false;
}
let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollFx);
    }
  },
  { passive: true }
);
onScrollFx();

/* 3D tilt cards */
if (!reducedMotion) {
  document.querySelectorAll(".tilt").forEach((card) => {
    const inner = card.querySelector(".tilt-inner, .mock");
    if (!inner) return;
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      inner.style.transform = `rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 10}deg) translateZ(6px)`;
      inner.style.setProperty("--mx", `${px * 100}%`);
      inner.style.setProperty("--my", `${py * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      inner.style.transform = "rotateY(0) rotateX(0)";
    });
  });
}

/* forms → submit silently to Formspree; falls back to the visitor's email app */
document.querySelectorAll("form[data-mail-subject]").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const note = form.querySelector(".form-note");
    const button = form.querySelector("button[type=submit]");

    if (form.dataset.formspree) {
      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      try {
        const data = new FormData(form);
        data.append("_subject", form.dataset.mailSubject);
        const res = await fetch(form.dataset.formspree, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
        form.innerHTML =
          '<h3 style="margin-bottom:10px">Sent. We\'re on it. ✓</h3>' +
          '<p style="color:var(--stone)">Your info is in our inbox — expect a reply within one business day. Talk soon.</p>';
        return;
      } catch (err) {
        if (button) { button.disabled = false; button.textContent = "Try again"; }
        if (note) note.textContent = "Hmm, that didn't go through — check your connection and try again, or email us directly.";
        return;
      }
    }

    /* no endpoint configured: open the visitor's email app instead */
    const lines = [];
    for (const el of form.elements) {
      if (!el.name || el.type === "submit") continue;
      lines.push(`${el.dataset.label || el.name}: ${el.value}`);
    }
    lines.push("", "— sent from MWOWDesigns.com");
    window.location.href =
      "mailto:waggonerowen@gmail.com" +
      `?subject=${encodeURIComponent(form.dataset.mailSubject)}` +
      `&body=${encodeURIComponent(lines.join("\n"))}`;
    if (note) note.textContent = "Your email app just opened with everything filled in — hit send and we're on it.";
  });
});

/* footer year */
const yr = document.getElementById("yr");
if (yr) yr.textContent = new Date().getFullYear();
