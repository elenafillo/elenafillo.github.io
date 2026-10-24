// Small helpers shared by every page.

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function img(src, alt = "") {
  return `<img class="thumb" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" draggable="false">`;
}

function links(list = []) {
  return list
    .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`)
    .join("");
}

// Missing image file? Fall back to the striped placeholder.
document.addEventListener("error", (e) => {
  const t = e.target;
  if (t.tagName === "IMG" && !t.dataset.fallback) {
    t.dataset.fallback = "1";
    t.src = "img/placeholder.svg";
  }
}, true);
