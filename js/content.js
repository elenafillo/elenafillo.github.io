// ============================================================
//  All the site's content lives here. Edit this file + drop
//  images into /img — no other file needs touching.
// ============================================================

const SITE = {
  name: "Elena",
  tagline: "[one line about you]",
  links: [
    { label: "github", url: "https://github.com/elenafillo" },
    { label: "scholar", url: "#" },
    { label: "email", url: "mailto:[your-email]" },
  ],
};

// The boxes on the mindmap. `pos` is where each box starts,
// as a fraction of the screen (0,0 = top-left, 1,1 = bottom-right).
const SECTIONS = [
  {
    id: "projects",
    title: "Side projects",
    href: "projects.html",
    tint: "blue",
    images: ["img/placeholder.svg"],
    pos: { x: 0.2, y: 0.26 },
  },
  {
    id: "publications",
    title: "Publications",
    href: "publications.html",
    tint: "green",
    images: ["img/placeholder.svg"],
    pos: { x: 0.8, y: 0.26 },
  },
  {
    id: "outreach",
    title: "Outreach",
    href: "outreach.html",
    tint: "purple",
    images: ["img/placeholder.svg"],
    pos: { x: 0.16, y: 0.74 },
  },
  {
    id: "now",
    title: "Working on right now",
    href: "now.html",
    tint: "orange",
    images: ["img/placeholder.svg", "img/placeholder.svg"],
    pos: { x: 0.56, y: 0.76 },
  },
];

// status: "idea" | "building" | "done"
const PROJECTS = [
  {
    title: "[Project name]",
    description: "[One or two lines on what it does]",
    image: "img/placeholder.svg",
    tags: ["python", "[tag]"],
    status: "building",
    links: [{ label: "repo", url: "#" }, { label: "demo", url: "#" }],
  },
  {
    title: "[Project name]",
    description: "[One or two lines on what it does]",
    image: "img/placeholder.svg",
    tags: ["[tag]"],
    status: "done",
    links: [{ label: "repo", url: "#" }],
  },
  {
    title: "[Project name]",
    description: "[One or two lines on what it does]",
    image: "img/placeholder.svg",
    tags: ["[tag]"],
    status: "idea",
    links: [],
  },
];

// Papers and conference appearances. Shown newest first.
// date: "YYYY-MM" (or "YYYY-MM-DD"). tags: "paper" and/or "conference".
// image: the paper's main figure, saved in img/pubs/.
const PUBLICATIONS = [
  {
    title: "[Paper title]",
    authors: "[Author A, Elena ..., Author C]",
    venue: "[Journal]",
    date: "2026-03",
    tags: ["paper"],
    image: "img/placeholder.svg",
    links: [{ label: "pdf", url: "#" }, { label: "doi", url: "#" }],
  },
  {
    title: "[Talk title]",
    authors: "[Authors]",
    venue: "[Conference, city]",
    date: "2025-09",
    tags: ["conference"],
    image: "img/placeholder.svg",
    links: [{ label: "abstract", url: "#" }],
  },
];

// Talks for the public, school visits, blog posts, workshops...
const OUTREACH = [
  {
    title: "[Outreach thing]",
    date: "2026-05",
    where: "[Where / who for]",
    text: "[A sentence or two about it.]",
    image: "img/placeholder.svg",
    links: [],
  },
];

const NOW = {
  updated: "October 2026",
  items: [
    {
      title: "[What you're building]",
      date: "Oct 2026",
      text: "[A few sentences about it — what, why, what's hard.]",
      images: ["img/placeholder.svg", "img/placeholder.svg"],
    },
    {
      title: "[What you're reading / thinking about]",
      date: "Oct 2026",
      text: "[A few sentences.]",
      images: [],
    },
  ],
};
