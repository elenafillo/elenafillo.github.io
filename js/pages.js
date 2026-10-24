// Renders the section pages from content.js.
// Each page's <body data-page="..."> picks which renderer runs.

(function () {
  const root = document.getElementById("content");
  const page = document.body.dataset.page;

  const renderers = { projects, publications, outreach, now };
  renderers[page]?.();

  // Filter pills: "all" plus each value present in the items.
  function filters(values, onPick) {
    const box = document.getElementById("filters");
    box.innerHTML = ["all", ...values]
      .map((v) => `<button class="pill" type="button" data-v="${esc(v)}" aria-pressed="${v === "all"}">${esc(v)}</button>`)
      .join("");
    box.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      box.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b === btn));
      onPick(btn.dataset.v);
    });
  }

  const byDateDesc = (a, b) => String(b.date ?? "").localeCompare(String(a.date ?? ""));

  function projects() {
    const statuses = ["building", "done", "idea"].filter((s) => PROJECTS.some((p) => p.status === s));
    filters(statuses, draw);

    function draw(filter) {
      root.className = "grid";
      root.innerHTML = PROJECTS
        .filter((p) => filter === "all" || p.status === filter)
        .map((p) => `
          <article class="box card">
            ${img(p.image, p.title)}
            <div class="card-row">
              <h2>${esc(p.title)}</h2>
              ${p.status ? `<span class="tag status-${esc(p.status)}">${esc(p.status)}</span>` : ""}
            </div>
            <p>${esc(p.description)}</p>
            ${p.tags?.length ? `<div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
            ${p.links?.length ? `<div class="links">${links(p.links)}</div>` : ""}
          </article>`)
        .join("");
    }
    draw("all");
  }

  function publications() {
    const tags = [...new Set(PUBLICATIONS.flatMap((p) => p.tags ?? []))];
    filters(tags, draw);

    function draw(filter) {
      root.className = "pub-list";
      root.innerHTML = [...PUBLICATIONS]
        .filter((p) => filter === "all" || p.tags?.includes(filter))
        .sort(byDateDesc)
        .map((p) => `
          <article class="box pub">
            ${p.image ? img(p.image, p.title) : ""}
            <div>
              <h2>${esc(p.title)}</h2>
              <p class="authors">${esc(p.authors)}</p>
              <p class="venue">${esc(p.venue)} · ${esc(fmtDate(p.date))}</p>
              <div class="pub-foot">
                ${p.tags?.length ? `<div class="tags">${p.tags.map((t) => `<span class="tag tag-${esc(t)}">${esc(t)}</span>`).join("")}</div>` : ""}
                <div class="links">${links(p.links)}</div>
              </div>
            </div>
          </article>`)
        .join("");
    }
    draw("all");
  }

  function outreach() {
    root.className = "grid";
    root.innerHTML = [...OUTREACH]
      .sort(byDateDesc)
      .map((o) => `
        <article class="box card">
          ${o.image ? img(o.image, o.title) : ""}
          <span class="now-date">${esc(fmtDate(o.date))}${o.where ? ` · ${esc(o.where)}` : ""}</span>
          <h2>${esc(o.title)}</h2>
          <p>${esc(o.text)}</p>
          ${o.links?.length ? `<div class="links">${links(o.links)}</div>` : ""}
        </article>`)
      .join("");
  }

  function now() {
    document.getElementById("updated").textContent = `last updated ${NOW.updated}`;
    root.className = "now-list";
    root.innerHTML = NOW.items
      .map((it) => `
        <article class="box now-item">
          <span class="now-date">${esc(it.date)}</span>
          <h2>${esc(it.title)}</h2>
          <p>${esc(it.text)}</p>
          ${it.images?.length ? `<div class="now-images">${it.images.map((src) => img(src, it.title)).join("")}</div>` : ""}
        </article>`)
      .join("");
  }

  // "2024-05" -> "May 2024"; "2024" stays "2024".
  function fmtDate(d) {
    const [y, m] = String(d ?? "").split("-");
    if (!m) return y ?? "";
    const month = new Date(Number(y), Number(m) - 1).toLocaleString("en", { month: "short" });
    return `${month} ${y}`;
  }
})();
