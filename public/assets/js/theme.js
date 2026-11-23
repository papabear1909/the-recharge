// "Slaves to Sons". The red cut runs across the word letter by letter; each letter cracks on the line,
// then breaks apart on a hinge. The new word rises out of the line, and the line settles under it.
// Scroll sets a target; the scene eases toward it every frame, so it stays smooth on any scroll speed.
import { t } from "./i18n.js";

const seg = (p, a, b) => (p <= a ? 0 : p >= b ? 1 : (p - a) / (b - a));
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const backOut = (x) => {
  const c = 1.5;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

export function createTheme() {
  const section = document.getElementById("theme");
  const stage = section.querySelector(".theme-stage");
  const fromEl = section.querySelector(".js-from");
  const toEl = section.querySelector(".js-to");
  const cut = section.querySelector(".cut");
  const bar = section.querySelector(".cut-bar");
  const head = section.querySelector(".cut-head");
  const line = section.querySelector(".theme-line");
  const verse = section.querySelector(".verse");
  const wash = section.querySelector(".theme-wash");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  let from = [];
  let to = [];
  let cutW = 1;
  let wordRatio = 0.4;
  let target = 0;
  let shown = -1;
  let raf = 0;

  function build() {
    const a = t("theme_from");
    const b = t("theme_to");
    stage.style.setProperty("--len", String(Math.max(a.length, b.length)));
    fromEl.textContent = "";
    toEl.textContent = "";
    from = [...a].map((ch, i) => {
      const lt = document.createElement("span");
      lt.className = "lt";
      lt.innerHTML = '<span class="lt-ghost"></span><span class="lt-a"></span><span class="lt-b"></span>';
      lt.querySelectorAll("span").forEach((s) => (s.textContent = ch));
      fromEl.append(lt);
      const tilt = [-1, 1][i % 2] * (3 + ((i * 7) % 5));
      return { a: lt.querySelector(".lt-a"), b: lt.querySelector(".lt-b"), tilt };
    });
    to = [...b].map((ch) => {
      const mask = document.createElement("span");
      mask.className = "lt-mask";
      const up = document.createElement("span");
      up.className = "lt-up";
      up.textContent = ch;
      mask.append(up);
      toEl.append(mask);
      return up;
    });
    measure();
    shown = -1;
  }

  function measure() {
    cutW = cut.offsetWidth || 1;
    wordRatio = Math.min(1, (toEl.offsetWidth + 24) / cutW);
  }

  function draw(p) {
    const n = from.length;
    // 1. the line runs across
    const c = easeInOut(seg(p, 0.06, 0.34));
    bar.style.transform = `scaleX(${c.toFixed(4)})`;
    head.style.transform = `translateX(${(c * cutW).toFixed(1)}px) rotate(45deg) scale(${(c > 0 && c < 1 ? 1 : 0).toFixed(0)})`;

    // 2. each letter cracks as the line passes it, then breaks on a hinge, left to right
    from.forEach((L, i) => {
      const x = (i + 0.5) / n;
      const crack = easeOut(seg(p, 0.06 + 0.28 * x - 0.01, 0.06 + 0.28 * x + 0.04));
      const fall = easeInOut(seg(p, 0.38 + i * 0.028, 0.6 + i * 0.028));
      const gap = crack * 0.03 + fall * 0.55;
      L.a.style.transform = `translateY(${(-gap).toFixed(4)}em) rotate(${(fall * -L.tilt).toFixed(2)}deg)`;
      L.b.style.transform = `translateY(${gap.toFixed(4)}em) rotate(${(fall * L.tilt * 0.7).toFixed(2)}deg)`;
      const o = (1 - Math.pow(fall, 1.4)).toFixed(3);
      L.a.style.opacity = o;
      L.b.style.opacity = o;
    });

    // 3. the line drops to the baseline and the new word rises out of it, letter by letter
    const drop = easeInOut(seg(p, 0.52, 0.7));
    to.forEach((up, j) => {
      const r = backOut(seg(p, 0.56 + j * 0.045, 0.76 + j * 0.045));
      up.style.transform = `translateY(${((1 - r) * 115).toFixed(2)}%)`;
    });

    // 4. the line tightens to the width of the word, like a signature under a name
    const tight = easeInOut(seg(p, 0.78, 0.92));
    const sx = 1 - tight * (1 - wordRatio);
    cut.style.transform = `translateY(${(drop * 0.47).toFixed(4)}em) scaleX(${sx.toFixed(4)})`;

    // 5. the words around it settle in, and the page warms a little
    const tail = easeOut(seg(p, 0.8, 0.98));
    line.style.opacity = tail.toFixed(3);
    line.style.transform = `translateY(${((1 - tail) * 18).toFixed(1)}px)`;
    const v = easeOut(seg(p, 0.86, 1));
    verse.style.opacity = v.toFixed(3);
    verse.style.transform = `translateY(${((1 - v) * 24).toFixed(1)}px)`;
    wash.style.opacity = (drop * 0.9).toFixed(3);
  }

  function progress() {
    const r = section.getBoundingClientRect();
    const run = section.offsetHeight - window.innerHeight;
    return run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 1;
  }

  function frame() {
    raf = 0;
    const next = shown < 0 ? target : shown + (target - shown) * 0.12;
    shown = Math.abs(target - next) < 0.0005 ? target : next;
    draw(shown);
    if (shown !== target) raf = requestAnimationFrame(frame);
  }

  function onScroll() {
    target = progress();
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function mode() {
    if (reduce.matches) {
      section.classList.remove("is-scroll");
      window.removeEventListener("scroll", onScroll);
      draw(1);
    } else {
      section.classList.add("is-scroll");
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  window.addEventListener("resize", () => {
    measure();
    shown = -1;
    reduce.matches ? draw(1) : onScroll();
  });
  reduce.addEventListener?.("change", mode);
  build();
  mode();
  if (document.fonts) document.fonts.ready.then(() => window.dispatchEvent(new Event("resize")));
  return {
    relabel() {
      build();
      reduce.matches ? draw(1) : onScroll();
    },
  };
}
