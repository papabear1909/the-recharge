// Speakers: giant names, a sticky frame with the profile cards, and the tilted reel in the console.
// Each card shows its still at once. The entrance video plays every time the card arrives, then holds its last frame.
import { t, pack } from "./i18n.js";

const STAGGER_MS = 160;

function titleOf(sp) {
  return (pack().titles && pack().titles[sp.title]) || sp.title;
}

function initials(sp) {
  return (sp.title[0] + sp.name[0]).toUpperCase();
}

function picture(sp, sizes, { eager = false } = {}) {
  const pic = document.createElement("picture");
  const small = sp.stillSmall || sp.still;
  const srcset = sp.stillSmall ? `${sp.stillSmall} 296w, ${sp.still} 591w` : `${sp.still} 591w`;
  if (sp.avif && /\.webp$/.test(sp.still)) {
    const src = document.createElement("source");
    src.type = "image/avif";
    src.srcset = srcset.replace(/\.webp/g, ".avif");
    src.sizes = sizes;
    pic.append(src);
  }
  const img = document.createElement("img");
  img.src = small;
  img.srcset = srcset;
  img.sizes = sizes;
  img.width = 591;
  img.height = 1004;
  img.decoding = "async";
  img.loading = eager ? "eager" : "lazy";
  img.style.objectPosition = sp.crop || "50% 50%";
  img.alt = "";
  pic.append(img);
  return { pic, img };
}

function monogram(sp) {
  const m = document.createElement("div");
  m.className = "monogram";
  const span = document.createElement("span");
  span.textContent = initials(sp);
  const small = document.createElement("small");
  m.append(span, small);
  return m;
}

export function createSpeakers({ config }) {
  const namesEl = document.querySelector(".js-names");
  const frame = document.querySelector(".js-frame");
  const reel = document.querySelector(".reel-track");
  const section = document.getElementById("speakers");
  const dialog = document.getElementById("card-dialog");
  const dialogImg = dialog.querySelector(".dialog-img");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const probe = document.createElement("video");
  const canWebm = Boolean(probe.canPlayType && probe.canPlayType('video/webm; codecs="vp9"'));

  const items = config.speakers.map((sp, i) => ({ sp, i, shown: false, failed: false, video: null, slot: null, nameBtn: null }));
  let focus = 0;
  let sectionNear = false;
  let frameVisible = false;
  let lastStart = 0;

  function videoAllowed() {
    if (reduce.matches) return false;
    const c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ""))) return false;
    return true;
  }

  function label(item) {
    const sp = item.sp;
    const vars = { title: titleOf(sp), name: sp.name };
    return {
      alt: t(sp.role === "host" ? "card_alt_host" : "card_alt", vars),
      view: t("view_card", vars),
      full: `${vars.title} ${vars.name}`,
    };
  }

  function build() {
    namesEl.textContent = "";
    frame.textContent = "";
    reel.textContent = "";
    for (const item of items) {
      const { sp } = item;
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "name";
      btn.dataset.i = item.i;
      btn.innerHTML = '<span class="name-title"></span><span class="name-big"></span>';
      btn.insertAdjacentHTML("afterbegin", '<span class="name-role"></span>');
      btn.addEventListener("click", () => {
        setFocus(item.i);
        openCard(item);
      });
      li.append(btn);
      namesEl.append(li);
      item.nameBtn = btn;

      const slot = document.createElement("button");
      slot.type = "button";
      slot.className = "slot";
      slot.tabIndex = -1;
      if (sp.still) {
        const { pic, img } = picture(sp, "(min-width: 1024px) 380px, 40vw", { eager: item.i === 0 });
        slot.append(pic);
        item.img = img;
      } else {
        slot.append(monogram(sp));
      }
      slot.addEventListener("click", () => openCard(item));
      frame.append(slot);
      item.slot = slot;
    }
    // two copies so the reel can loop without a seam
    for (let copy = 0; copy < 2; copy++) {
      for (const item of items) {
        const fig = document.createElement("figure");
        fig.className = "reel-item";
        if (item.sp.still) fig.append(picture(item.sp, "(min-width: 768px) 210px, 31vw").pic);
        else fig.append(monogram(item.sp));
        reel.append(fig);
      }
    }
    relabel();
    setFocus(focus, { silent: true });
  }

  function relabel() {
    for (const item of items) {
      const l = label(item);
      const btn = item.nameBtn;
      btn.querySelector(".name-title").textContent = titleOf(item.sp);
      btn.querySelector(".name-big").textContent = item.sp.name;
      const role = btn.querySelector(".name-role");
      if (role) role.textContent = t(item.sp.role === "host" ? "role_host" : "role_guest");
      btn.setAttribute("aria-label", item.sp.still ? l.view : l.full);
      item.slot.setAttribute("aria-label", l.view);
      if (item.img) item.img.alt = l.alt;
      const small = item.slot.querySelector(".monogram small");
      if (small) small.textContent = l.full;
    }
    reel.querySelectorAll(".reel-item").forEach((fig, k) => {
      const item = items[k % items.length];
      const small = fig.querySelector(".monogram small");
      if (small) small.textContent = label(item).full;
    });
  }

  function ensureVideo(item) {
    if (item.video || !item.sp.video || !videoAllowed()) return item.video;
    const v = document.createElement("video");
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("muted", "");
    v.setAttribute("aria-hidden", "true");
    v.setAttribute("disablepictureinpicture", "");
    v.tabIndex = -1;
    v.preload = "auto";
    if (item.sp.still) v.poster = item.sp.still;
    if (item.sp.videoWebm && canWebm) {
      const s = document.createElement("source");
      s.src = item.sp.videoWebm;
      s.type = "video/webm";
      v.append(s);
    }
    const mp4 = document.createElement("source");
    mp4.src = item.sp.video;
    mp4.type = "video/mp4";
    v.append(mp4);
    // If the card already has focus when its video finishes loading, start it then.
    v.addEventListener("loadeddata", () => {
      if (item.i === focus) maybePlay(item);
    });
    v.addEventListener("error", () => release(item), true);
    item.slot.append(v);
    item.video = v;
    return v;
  }

  function release(item) {
    const v = item.video;
    if (!v) return;
    v.pause();
    v.removeAttribute("src");
    v.querySelectorAll("source").forEach((s) => s.remove());
    v.load();
    v.remove();
    item.video = null;
    item.shown = false;
  }

  // Stop a card that lost focus; once it has faded out, rewind it for next time.
  function rest(item) {
    const v = item.video;
    item.shown = false;
    if (!v) return;
    v.pause();
    setTimeout(() => {
      if (item.i === focus && item.shown) return;
      v.classList.remove("is-playing");
      try { v.currentTime = 0; } catch {}
    }, 400);
  }

  // Play from the start whenever the card arrives: frame on screen, video ready, not already showing.
  function maybePlay(item) {
    if (!frameVisible || item.shown || item.failed || item.starting || !videoAllowed()) return;
    const v = ensureVideo(item);
    if (!v || v.readyState < 2) return;
    const wait = Math.max(0, lastStart + STAGGER_MS - performance.now());
    lastStart = performance.now() + wait;
    item.starting = true;
    setTimeout(() => {
      item.starting = false;
      if (focus !== item.i || item.shown || !item.video || !frameVisible) return;
      item.shown = true;
      v.currentTime = 0;
      v.classList.add("is-playing");
      const p = v.play();
      if (p && p.catch) {
        p.catch(() => {
          v.classList.remove("is-playing");
          item.failed = true;
        });
      }
    }, wait);
  }

  function setFocus(i, { silent = false } = {}) {
    const prev = items[focus];
    focus = i;
    items.forEach((item) => {
      item.nameBtn.classList.toggle("is-focus", item.i === i);
      item.slot.classList.toggle("is-on", item.i === i);
    });
    if (prev && prev.i !== i) rest(prev);
    if (!silent) maybePlay(items[i]);
  }

  function openCard(item) {
    if (!item.sp.still) return;
    dialogImg.src = item.sp.still;
    dialogImg.alt = label(item).alt;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  build();

  // The focused name is the one crossing the middle band of the screen.
  const focusObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setFocus(Number(e.target.dataset.i));
    },
    { rootMargin: "-46% 0px -46% 0px" },
  );
  // Videos load name by name as they come near.
  const nearObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const item = items[Number(e.target.dataset.i)];
        if (e.isIntersecting) ensureVideo(item);
      }
    },
    { rootMargin: "0px 0px 70% 0px" },
  );
  const frameObserver = new IntersectionObserver(
    (entries) => {
      frameVisible = entries[0].isIntersecting;
      if (frameVisible) maybePlay(items[focus]);
      else rest(items[focus]);
    },
    { threshold: 0.5 },
  );
  // Far away: pause and let go of every video.
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      sectionNear = entries[0].isIntersecting;
      if (!sectionNear) items.forEach(release);
    },
    { rootMargin: "150% 0px 150% 0px" },
  );

  items.forEach((item) => {
    focusObserver.observe(item.nameBtn);
    nearObserver.observe(item.nameBtn);
  });
  frameObserver.observe(frame);
  sectionObserver.observe(section);

  // Only the first card's video loads early, and only after the page has painted and settled.
  function warmFirst() {
    const first = items[0];
    const go = () => ensureVideo(first);
    if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 4000 });
    else setTimeout(go, 1500);
  }
  if (document.readyState === "complete") warmFirst();
  else window.addEventListener("load", warmFirst, { once: true });

  return { relabel };
}
