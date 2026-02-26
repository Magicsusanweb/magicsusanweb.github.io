document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  setupSusanScene();
  setupContactMail();
});

/**
 * Contact mailto: built in JS only (never in HTML) to reduce bot scraping.
 */
function setupContactMail() {
  const link = document.getElementById("contact-mail");
  if (!link) return;
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const user = "labartcasa" + "robotics";
    const domain = "gmail" + "." + "com";
    window.location.href = "mailto:" + user + "@" + domain;
  });
}

/**
 * Item definitions: id, full phrase part after "Hey Susan, ", and SVG icon markup.
 */
const SUSAN_ITEMS = [
  {
    id: "wallet",
    phrase: "give me my wallet",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M4 9h16" stroke="currentColor" stroke-width="1.2"/>
      <path d="M4 9l4.5-3.5h7L20 9" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linejoin="round"/>
      <rect x="13.5" y="11" width="5" height="4" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/>
      <circle cx="16" cy="13" r="0.9" fill="currentColor"/>
      <path d="M6 18.5h12" stroke="currentColor" stroke-width="0.9" stroke-dasharray="2 2" opacity="0.8"/>
    </svg>`,
  },
  {
    id: "sharp",
    phrase: "give me something sharp",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6.5 4.5L10 9.5 8 11.5 4.5 6.5C4 5.7 4.3 4.7 5.1 4.3 5.8 3.9 6.7 4.1 7.2 4.7L11 9.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17.5 4.5L14 9.5 16 11.5 19.5 6.5C20 5.7 19.7 4.7 18.9 4.3 18.2 3.9 17.3 4.1 16.8 4.7L13 9.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 13.5c-0.8-0.8-2.1-0.8-2.9 0-0.8 0.8-0.8 2.1 0 2.9 0.8 0.8 2.1 0.8 2.9 0" stroke="currentColor" stroke-width="1.4" fill="none"/>
      <path d="M15 13.5c0.8-0.8 2.1-0.8 2.9 0 0.8 0.8 0.8 2.1 0 2.9-0.8 0.8-2.1 0.8-2.9 0" stroke="currentColor" stroke-width="1.4" fill="none"/>
      <path d="M9 13.5L12 16.5 15 13.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "lipstick",
    phrase: "give me my lipstick",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10.5 3.5L13 2l1 2.5v4h-3.5v-5z" fill="currentColor" opacity="0.9"/>
      <rect x="9" y="7" width="6" height="9" rx="1.2" stroke="currentColor" stroke-width="1.2" fill="none"/>
      <rect x="8.5" y="16" width="7" height="4.5" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/>
      <path d="M9 16.5h6" stroke="currentColor" stroke-width="1.1"/>
    </svg>`,
  },
  {
    id: "keys",
    phrase: "give me my keys",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M10.5 9.5L15 14l-1.5 1.5L15 17l-1.2 1.2L12.5 17 11 18.5 9.5 17 11 15.5 9.5 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="8" cy="8" r="0.9" fill="currentColor"/>
      <path d="M9.5 6.5l2-2.5c0.6-0.7 1.6-0.9 2.4-0.4 0.8 0.5 1 1.6 0.4 2.4l-1.8 2.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "glasses",
    phrase: "give me my glasses",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 11.5l1-3.5M21 11.5l-1-3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      <rect x="4.5" y="10" width="6" height="5" rx="2.2" stroke="currentColor" stroke-width="1.4" fill="none"/>
      <rect x="13.5" y="10" width="6" height="5" rx="2.2" stroke="currentColor" stroke-width="1.4" fill="none"/>
      <path d="M10.5 12.5h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M5 15h-0.5c-0.8 0-1.5 0.7-1.5 1.5V17M19 15h0.5c0.8 0 1.5 0.7 1.5 1.5V17" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "cable",
    phrase: "give me my USB cable",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="2.5" width="8" height="5" rx="1" stroke="currentColor" stroke-width="1.4" fill="none"/>
      <path d="M10 2.5v-1.2M14 2.5v-1.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M12 7.5v3.5c0 1.7-1.3 3-3 3-1.1 0-2 .9-2 2 0 1.1.9 2 2 2h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17 17.5h2.5v2.5H17z" stroke="currentColor" stroke-width="1.4" fill="none"/>
    </svg>`,
  },
];

/**
 * Build the Susan demo: stretched circular unit, door, items, and animated phrase.
 */
function setupSusanScene() {
  const container = document.getElementById("susan-scene");
  if (!container) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Phrase line: "Hey Susan, Give me my XXX" — XXX is dynamic
  const phraseEl = document.createElement("div");
  phraseEl.className = "susan-phrase";
  phraseEl.setAttribute("aria-live", "polite");
  phraseEl.setAttribute("aria-atomic", "true");
  const staticPart = document.createElement("span");
  staticPart.className = "phrase-static";
  staticPart.textContent = "Hey Susan, ";
  const dynamicPart = document.createElement("span");
  dynamicPart.className = "phrase-dynamic";
  dynamicPart.id = "susan-phrase-dynamic";
  phraseEl.appendChild(staticPart);
  phraseEl.appendChild(dynamicPart);
  container.appendChild(phraseEl);

  // Wrapper for the circular unit
  const unitWrap = document.createElement("div");
  unitWrap.className = "susan-unit-wrap";
  unitWrap.setAttribute("aria-label", "MagicSusan storage unit with door");

  // Stretched circular unit (ellipse)
  const unit = document.createElement("div");
  unit.className = "susan-unit";

  // Door (bottom half, opens upward)
  const door = document.createElement("div");
  door.className = "susan-door";
  door.setAttribute("aria-hidden", "true");

  // Interior: items (only one visible at a time)
  const interior = document.createElement("div");
  interior.className = "susan-interior";

  SUSAN_ITEMS.forEach((item, i) => {
    const itemEl = document.createElement("div");
    itemEl.className = "susan-item";
    itemEl.id = "susan-item-" + item.id;
    itemEl.setAttribute("data-item-id", item.id);
    itemEl.innerHTML = item.icon;
    itemEl.style.color = "#f0abfc";
    interior.appendChild(itemEl);
  });

  unit.appendChild(interior);
  unit.appendChild(door);
  unitWrap.appendChild(unit);
  container.appendChild(unitWrap);

  // Cycle phrase and door/item
  let index = 0;
  const cycle = () => {
    const item = SUSAN_ITEMS[index];
    dynamicPart.textContent = item.phrase;

    // Open door
    unitWrap.classList.add("door-open", "item-visible");
    interior.querySelectorAll(".susan-item").forEach((el) => el.classList.remove("active"));
    const activeItem = document.getElementById("susan-item-" + item.id);
    if (activeItem) activeItem.classList.add("active");

    // Close door all the way, then advance to next item
    if (!prefersReducedMotion) {
      setTimeout(() => {
        unitWrap.classList.remove("door-open");
        // Wait for door close transition (0.6s) to finish before hiding item and advancing
        setTimeout(() => {
          unitWrap.classList.remove("item-visible");
          index = (index + 1) % SUSAN_ITEMS.length;
        }, 650);
      }, 2200);
    } else {
      index = (index + 1) % SUSAN_ITEMS.length;
    }
  };

  cycle();
  if (!prefersReducedMotion) {
    setInterval(cycle, 3500);
  }
}
