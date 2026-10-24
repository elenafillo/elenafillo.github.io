// The home-page mindmap: pills that bob gently, can be dragged
// around, open into a bigger box when clicked, and stay connected
// to the center by curved wires.

(function () {
  const map = document.getElementById("map");
  const wires = document.getElementById("wires");
  const resetBtn = document.getElementById("reset");

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phone = matchMedia("(max-width: 720px)");

  const OPEN_ON_LAUNCH = "now";

  const STORE = "mindmap-positions-v2";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE)) || {}; } catch (_) {}

  function save() {
    const out = {};
    nodes.forEach((n) => { out[n.id] = { x: n.x, y: n.y }; });
    try { localStorage.setItem(STORE, JSON.stringify(out)); } catch (_) {}
  }

  // ---------- build the boxes ----------
  const meta = {
    projects: `${PROJECTS.length} projects`,
    publications: `${PUBLICATIONS.length} items`,
    outreach: `${OUTREACH.length} things`,
    now: `updated ${esc(NOW.updated)}`,
  };

  const center = document.createElement("div");
  center.className = "node box center";
  center.innerHTML = `
    <h1>${esc(SITE.name)}</h1>
    <p class="tagline">${esc(SITE.tagline)}</p>
    <nav>${SITE.links.map((l) => `<a href="${esc(l.url)}" draggable="false">${esc(l.label)}</a>`).join("")}</nav>`;
  map.appendChild(center);

  const nodes = [makeNode(center, "center", { x: 0.5, y: 0.38 })];

  SECTIONS.forEach((s) => {
    const el = document.createElement("div");
    el.className = `node box section tint-${s.tint}`;
    const pics = s.images.length > 1
      ? `<div class="thumb-pair">${s.images.map((src) => img(src)).join("")}</div>`
      : img(s.images[0]);
    el.innerHTML = `
      <img class="dot" src="${esc(s.images[0])}" alt="" draggable="false">
      <div class="node-body">${pics}</div>
      <button class="node-toggle" type="button" aria-expanded="false">
        <span>${esc(s.title)}</span><span class="node-meta">${meta[s.id] ?? ""}</span>
      </button>
      <a class="open-link" href="${esc(s.href)}" draggable="false">open →</a>`;
    map.appendChild(el);

    const n = makeNode(el, s.id, s.pos);
    n.wire = document.createElementNS("http://www.w3.org/2000/svg", "path");
    wires.appendChild(n.wire);
    nodes.push(n);
  });

  const sections = nodes.slice(1);

  function makeNode(el, id, home) {
    const start = saved[id] || home;
    const n = {
      el, id, home,
      x: start.x, y: start.y,          // position as a fraction of the map
      px: 0, py: 0,                    // rendered position in px (incl. bob)
      hw: 0, hh: 0,                    // half the box's size, in px
      phase: Math.random() * Math.PI * 2,
      speed: 0.7 + Math.random() * 0.5,
      bob: 1, tilt: 0,
      drag: null, moved: false, returning: false,
    };
    enableDrag(n);
    return n;
  }

  // ---------- opening and closing ----------
  function setOpen(target) {
    sections.forEach((n) => {
      const open = n === target;
      n.el.classList.toggle("open", open);
      n.el.querySelector(".node-toggle").setAttribute("aria-expanded", open);
    });
  }

  function toggle(n) {
    setOpen(n.el.classList.contains("open") ? null : n);
  }

  setOpen(sections.find((n) => n.id === OPEN_ON_LAUNCH) ?? null);

  map.addEventListener("click", (e) => {
    if (e.target === map) setOpen(null);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(null);
  });

  // ---------- dragging ----------
  function enableDrag(n) {
    const el = n.el;

    el.addEventListener("pointerdown", (e) => {
      if (phone.matches || e.button !== 0) return;
      if (e.target.closest("nav a, .open-link")) return; // let links work
      n.drag = { sx: e.clientX, sy: e.clientY, ox: n.x, oy: n.y };
      n.moved = false;
      n.returning = false;
      el.setPointerCapture(e.pointerId);
      el.classList.add("dragging");
    });

    el.addEventListener("pointermove", (e) => {
      if (!n.drag) return;
      const W = map.clientWidth, H = map.clientHeight;
      const dx = e.clientX - n.drag.sx, dy = e.clientY - n.drag.sy;
      if (Math.hypot(dx, dy) > 4) n.moved = true;
      n.x = clamp(n.drag.ox + dx / W, n.hw / W, 1 - n.hw / W);
      n.y = clamp(n.drag.oy + dy / H, n.hh / H, 1 - n.hh / H);
    });

    const end = () => {
      if (!n.drag) return;
      n.drag = null;
      el.classList.remove("dragging");
      if (n.moved) save();
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);

    // A drag shouldn't count as a click; a click on a pill opens it.
    el.addEventListener("click", (e) => {
      if (n.moved) { e.preventDefault(); n.moved = false; return; }
      if (n.id !== "center" && !phone.matches && !e.target.closest(".open-link")) toggle(n);
    });
  }

  resetBtn.addEventListener("click", () => {
    nodes.forEach((n) => { n.returning = true; });
    try { localStorage.removeItem(STORE); } catch (_) {}
  });

  // ---------- animation ----------
  function frame(t) {
    requestAnimationFrame(frame);
    if (phone.matches) return;

    const W = map.clientWidth, H = map.clientHeight;
    const s = t / 1000;

    // Read all sizes first, then write all transforms (avoids layout thrash).
    nodes.forEach((n) => { n.hw = n.el.offsetWidth / 2; n.hh = n.el.offsetHeight / 2; });

    nodes.forEach((n) => {
      if (n.returning) {
        n.x += (n.home.x - n.x) * 0.08;
        n.y += (n.home.y - n.y) * 0.08;
        if (Math.abs(n.home.x - n.x) + Math.abs(n.home.y - n.y) < 0.0005) {
          n.x = n.home.x; n.y = n.home.y; n.returning = false;
        }
      }
      n.bob += ((n.drag ? 0 : 1) - n.bob) * 0.1;
      n.tilt += ((n.drag ? -2.5 : 0) - n.tilt) * 0.2;

      const amp = reduceMotion ? 0 : n.bob;
      const bx = Math.cos(s * n.speed * 0.6 + n.phase) * 3 * amp;
      const by = Math.sin(s * n.speed + n.phase) * 7 * amp;

      // Keep the whole box on screen, even once it has opened up.
      n.px = clamp(n.x * W, n.hw + 8, W - n.hw - 8) + bx;
      n.py = clamp(n.y * H, n.hh + 8, H - n.hh - 8) + by;
      n.el.style.transform =
        `translate(${n.px}px, ${n.py}px) translate(-50%, -50%) rotate(${n.tilt}deg)`;
    });

    const c = nodes[0];
    sections.forEach((n) => n.wire.setAttribute("d", curve(c.px, c.py, n.px, n.py)));
  }

  // An S-curve between two points, bending along the longer axis.
  function curve(x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1;
    if (Math.abs(dx) > Math.abs(dy)) {
      const mx = x1 + dx / 2;
      return `M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
    }
    const my = y1 + dy / 2;
    return `M${x1} ${y1} C${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  requestAnimationFrame(frame);
})();
