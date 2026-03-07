// Always start at top of page on reload
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// Loading Screen
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-overlay");
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 1200); // Hide after 1.2 seconds
});

// Hero Photo Tilt on Scroll
let photoTilted = false;
const heroPhoto = document.querySelector(".hero-photo");

window.addEventListener("scroll", () => {
  if (!photoTilted && window.scrollY > 5) {
    heroPhoto.classList.add("tilted");
    photoTilted = true;
  }
});

// Hero Photo Hover - Reset to starting position
heroPhoto.addEventListener("mouseenter", () => {
  heroPhoto.classList.remove("tilted");
});

heroPhoto.addEventListener("mouseleave", () => {
  if (photoTilted) {
    heroPhoto.classList.add("tilted");
  }
});

// Falling SVG - Only terminal (top-right)
let terminalFallen = false;
const decoTerminal = document.querySelector(".deco-terminal");
const heroContent = document.querySelector(".hero-content");

function calculateFallDistance() {
  const heroContentRect = heroContent.getBoundingClientRect();
  const heroContentBottom = heroContentRect.bottom;
  const terminalRect = decoTerminal.getBoundingClientRect();
  const terminalFall = Math.max(
    0,
    heroContentBottom - terminalRect.bottom - 50,
  );
  decoTerminal.style.setProperty("--fall-distance", `${terminalFall}px`);
}

calculateFallDistance();
window.addEventListener("resize", calculateFallDistance);

window.addEventListener("scroll", () => {
  if (!terminalFallen && window.scrollY > 5) {
    decoTerminal.classList.add("falling");
    terminalFallen = true;
  }
});

// Paper Tear Gap Parallax Effect
const pageGap = document.querySelector(".page-gap");
const paperTearBottom = document.querySelector(".paper-tear-bottom");
const paperTearBottomBgGray = document.querySelector(
  '.paper-tear-bottom svg path[fill="#d0d0d0"]',
);
const paperTearBottomBgWhite = document.querySelector(
  '.paper-tear-bottom svg path[fill="#ffffff"]',
);
const tearTapeSticker = document.querySelector(".tear-tape-sticker");
const minGapHeight = -30;

function updateTapePosition() {
  if (paperTearBottom && tearTapeSticker) {
    const rect = paperTearBottom.getBoundingClientRect();
    tearTapeSticker.style.setProperty("--tape-position", `${rect.top}px`);
  }
}

function updateGapParallax() {
  if (!pageGap || !paperTearBottom) return;

  const isMobile = window.innerWidth <= 768;

  // Skip animation on mobile
  if (isMobile) return;

  const scrollY = window.scrollY;
  const initialGapHeight = 300;
  const scrollStart = 100;
  const scrollRange = 200;
  const stickerDelay = 30;
  const stickerStart = scrollStart + scrollRange + stickerDelay;
  const stickerRange = 60;

  updateTapePosition();

  if (scrollY <= scrollStart) {
    pageGap.style.setProperty("height", initialGapHeight + "px", "important");
    paperTearBottom.style.setProperty("margin-top", "0px", "important");
    if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = "1";
    if (tearTapeSticker) {
      tearTapeSticker.style.transform =
        "rotate(-8deg) translateY(-40px) translateZ(30px) rotateX(35deg)";
      tearTapeSticker.style.opacity = "0";
    }
  } else if (scrollY >= scrollStart && scrollY <= scrollStart + scrollRange) {
    const progress = (scrollY - scrollStart) / scrollRange;
    const currentHeight =
      initialGapHeight - (initialGapHeight - minGapHeight) * progress;

    if (currentHeight >= 0) {
      pageGap.style.setProperty("height", currentHeight + "px", "important");
      paperTearBottom.style.setProperty("margin-top", "0px", "important");
      if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = "1";
      if (tearTapeSticker) {
        tearTapeSticker.style.transform =
          "rotate(-8deg) translateY(-100px) translateZ(50px) rotateX(45deg)";
        tearTapeSticker.style.opacity = "0";
      }
    } else {
      // Negative margin starts - fade background
      pageGap.style.setProperty("height", "0px", "important");
      paperTearBottom.style.setProperty(
        "margin-top",
        currentHeight + "px",
        "important",
      );

      // Fade based on negative margin progress
      const negativePart = Math.abs(minGapHeight);
      const negativeProgress = Math.abs(currentHeight) / negativePart;
      const opacity = 1 - negativeProgress;

      if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = opacity;
      if (tearTapeSticker) {
        tearTapeSticker.style.transform =
          "rotate(-8deg) translateY(-100px) translateZ(50px) rotateX(45deg)";
        tearTapeSticker.style.opacity = "0";
      }
    }
  } else if (scrollY > stickerStart && scrollY < stickerStart + stickerRange) {
    // Sticker animation in progress
    pageGap.style.setProperty("height", "0px", "important");
    paperTearBottom.style.setProperty(
      "margin-top",
      minGapHeight + "px",
      "important",
    );
    if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = "0";

    if (tearTapeSticker) {
      const stickerProgress = (scrollY - stickerStart) / stickerRange;

      // Interpolate transform values based on progress
      const translateY = -40 + 40 * stickerProgress;
      const translateZ = 30 - 30 * stickerProgress;
      const rotateX = 35 - 35 * stickerProgress;
      const opacityVal = Math.min(
        1,
        Math.max(0, (stickerProgress - 0.35) * 1.54),
      );

      tearTapeSticker.style.transform = `rotate(-8deg) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg)`;
      tearTapeSticker.style.opacity = opacityVal;
    }
  } else if (scrollY >= stickerStart + stickerRange) {
    // Sticker fully stuck
    pageGap.style.setProperty("height", "0px", "important");
    paperTearBottom.style.setProperty(
      "margin-top",
      minGapHeight + "px",
      "important",
    );
    if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = "0";
    if (tearTapeSticker) {
      tearTapeSticker.style.transform =
        "rotate(-8deg) translateY(0px) translateZ(0px) rotateX(0deg)";
      tearTapeSticker.style.opacity = "1";
    }
  } else {
    // Between gap close and sticker start
    pageGap.style.setProperty("height", "0px", "important");
    paperTearBottom.style.setProperty(
      "margin-top",
      minGapHeight + "px",
      "important",
    );
    if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = "0";
    if (tearTapeSticker) {
      tearTapeSticker.style.transform =
        "rotate(-8deg) translateY(-40px) translateZ(30px) rotateX(35deg)";
      tearTapeSticker.style.opacity = "0";
    }
  }
}

window.addEventListener("scroll", updateGapParallax);
window.addEventListener("resize", updateGapParallax);

// Initialize all animations with current scroll position
requestAnimationFrame(() => {
  updateGapParallax();
});

// Highlight Parallax Effect
const highlights = document.querySelectorAll(".highlight");
const highlightData = new Map();

highlights.forEach((highlight, index) => {
  const direction = index % 2 === 0 ? "left" : "right";
  highlight.setAttribute("data-direction", direction);
  highlightData.set(highlight, {
    hasStarted: false,
    startScroll: 0,
    duration: 100,
    direction: direction,
  });
});

function updateHighlights() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  highlights.forEach((highlight) => {
    const rect = highlight.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const data = highlightData.get(highlight);

    // Start highlighting when element is near top of viewport
    const triggerPoint = scrollY + windowHeight * 0.8;

    if (!data.hasStarted && triggerPoint >= elementTop) {
      data.hasStarted = true;
      data.startScroll = scrollY;
    }

    if (data.hasStarted) {
      const progress = Math.min(
        1,
        Math.max(0, (scrollY - data.startScroll) / data.duration),
      );
      highlight.style.setProperty("--highlight-progress", `${progress * 100}%`);
    }

    // Reset when scrolling back up past element
    if (data.hasStarted && scrollY < data.startScroll - 50) {
      data.hasStarted = false;
      highlight.style.setProperty("--highlight-progress", "0%");
    }
  });
}

window.addEventListener("scroll", updateHighlights);
requestAnimationFrame(() => {
  updateHighlights();
});

// Language Stars Parallax Effect
const languageItems = document.querySelectorAll(".language-item");
const languageStarsData = new Map();

languageItems.forEach((item) => {
  const stars = item.querySelectorAll(".language-stars .star");
  languageStarsData.set(item, {
    hasStarted: false,
    startScroll: 0,
    stars: stars,
    starDelay: 50,
  });
});

function updateLanguageStars() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  languageItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const data = languageStarsData.get(item);

    const triggerPoint = scrollY + windowHeight * 0.8;

    if (!data.hasStarted && triggerPoint >= elementTop) {
      data.hasStarted = true;
      data.startScroll = scrollY;
    }

    if (data.hasStarted) {
      const scrollProgress = scrollY - data.startScroll;

      data.stars.forEach((star, index) => {
        const starTrigger = index * data.starDelay;
        if (scrollProgress >= starTrigger) {
          star.classList.add("visible");
        }
      });
    }
  });
}

window.addEventListener("scroll", updateLanguageStars);
requestAnimationFrame(() => {
  updateLanguageStars();
});

// Journey Timeline Book Page Effect
const journeyTimeline = document.querySelector(".journey-timeline");
const journeyTimelineBack = document.querySelector(".journey-timeline-back");
const journeyTimelineData = {
  hasStarted: false,
  startScroll: 0,
  pageRange: 200,
};

function updateJourneyTimeline() {
  if (!journeyTimeline || !journeyTimelineBack) return;

  // Only run animation on desktop
  if (window.innerWidth < 769) return;

  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const rect = journeyTimeline.getBoundingClientRect();
  const elementTop = rect.top + scrollY;

  const triggerPoint = scrollY + windowHeight * 0.5;

  if (!journeyTimelineData.hasStarted && triggerPoint >= elementTop) {
    journeyTimelineData.hasStarted = true;
    journeyTimelineData.startScroll = scrollY;
  }

  if (journeyTimelineData.hasStarted) {
    const progress = Math.min(
      1,
      Math.max(
        0,
        (scrollY - journeyTimelineData.startScroll) /
          journeyTimelineData.pageRange,
      ),
    );

    // Book left page opening - timeline rotates from back to front
    const rotateY = 180 - 180 * progress; // 180 -> 0

    // Both rotate together
    journeyTimeline.style.transform = `rotateY(${rotateY}deg)`;
    journeyTimelineBack.style.transform = `rotateY(${rotateY}deg)`;

    // Switch z-index at 90 degrees
    if (rotateY > 95) {
      // Map is visible (when book is closed)
      journeyTimeline.style.zIndex = "1";
      journeyTimelineBack.style.zIndex = "100";
    } else {
      // Timeline content is visible (when book is open)
      journeyTimeline.style.zIndex = "100";
      journeyTimelineBack.style.zIndex = "1";
    }

    // Enable scrolling when fully opened
    if (progress >= 1) {
      journeyTimeline.style.overflowY = "auto";
    } else {
      journeyTimeline.style.overflowY = "hidden";
    }
  } else {
    // Reset to initial state
    journeyTimeline.style.transform = "rotateY(180deg)";
    journeyTimelineBack.style.transform = "rotateY(180deg)";
    journeyTimeline.style.zIndex = "1";
    journeyTimelineBack.style.zIndex = "100";
    journeyTimeline.style.overflowY = "hidden";
  }
}

window.addEventListener("scroll", updateJourneyTimeline);
requestAnimationFrame(() => {
  updateJourneyTimeline();
});

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const icon = themeToggle.querySelector("i");

const currentTheme = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", currentTheme);
updateIcon(currentTheme);

themeToggle.addEventListener("click", () => {
  const theme = body.getAttribute("data-theme");
  const newTheme = theme === "light" ? "dark" : "light";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateIcon(newTheme);
});

function updateIcon(theme) {
  if (theme === "dark") {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
}

// Smooth Scroll for Navigation
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Smart Navbar Scroll
const navbar = document.querySelector(".navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // Smart hide/show navbar
  if (currentScroll > lastScroll && currentScroll > 100) {
    // Scrolling down & past threshold - hide navbar
    navbar.classList.add("navbar-hidden");
  } else if (currentScroll < lastScroll) {
    // Scrolling up - show navbar
    navbar.classList.remove("navbar-hidden");
  }

  // Active link highlighting
  const sections = document.querySelectorAll("section[id]");
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      currentScroll >= sectionTop &&
      currentScroll < sectionTop + sectionHeight
    ) {
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });

  lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
    }
  });
}, observerOptions);

document
  .querySelectorAll(".section, .timeline-item, .skill-box")
  .forEach((el) => {
    observer.observe(el);
  });

// Matrix Typing Effect for Hero Greeting
const greetingElement = document.getElementById("hero-greeting");
const finalText = "Hi there! 👋";
const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

function matrixTypingEffect() {
  let iterations = 0;
  const interval = setInterval(() => {
    greetingElement.textContent = finalText
      .split("")
      .map((char, index) => {
        if (index < iterations) {
          return finalText[index];
        }
        if (char === " " || char === "👋") {
          return char;
        }
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");

    if (iterations >= finalText.length) {
      clearInterval(interval);
    }

    iterations += 1 / 3;
  }, 50);
}

// Start the effect after a short delay
setTimeout(matrixTypingEffect, 500);

// Journey Map with Leaflet
const initialView = { center: [22.9734, 78.6569], zoom: 4 };

const map = L.map("journey-map", {
  center: initialView.center,
  zoom: initialView.zoom,
  scrollWheelZoom: false,
  zoomControl: true,
});

L.tileLayer(
  "https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg",
  {
    attribution: "© Stamen Design, © OpenStreetMap contributors",
    maxZoom: 16,
  },
).addTo(map);

// Add custom home button control
L.Control.Home = L.Control.extend({
  onAdd: function (map) {
    const container = L.DomUtil.create(
      "div",
      "leaflet-bar leaflet-control leaflet-control-home",
    );
    const link = L.DomUtil.create("a", "", container);
    link.href = "#";
    link.title = "Reset map view";
    link.innerHTML = '<i class="fas fa-home"></i>';

    L.DomEvent.on(link, "click", function (e) {
      e.preventDefault();
      map.setView(initialView.center, initialView.zoom);
    });

    return container;
  },
});

new L.Control.Home({ position: "topright" }).addTo(map);

// Group locations by country (YOUR DATA)
const locations = [
  {
    coords: [30.7046, 76.7179], // Mohali, Punjab, India
    country: "India",
    companies: [
      {
        city: "Mohali, Sector 66",
        company: "46-Tech",
        period: "Jun 2024 - Jan 2025",
        role: "Intern Graphic Designer",
      },
      {
        city: "Mohali, Sector 75",
        company: "Sociohype",
        period: "March 2025 - Feb 2026",
        role: "Junior Graphic Designer",
      },
    ],
  },
];

// Store markers by country
const markers = {};

// Add custom neo-brutalist markers
locations.forEach((location) => {
  const isCurrent = location.country === "India";
  const markerIcon = L.divIcon({
    className: isCurrent ? "neo-marker neo-marker-current" : "neo-marker",
    html: `
                    <div class="neo-marker-label ${isCurrent ? "neo-marker-label-current" : ""}">${location.country}</div>
                    <div class="neo-marker-pin ${isCurrent ? "neo-marker-pin-current" : ""}"></div>
                `,
    iconSize: isCurrent ? [35, 35] : [30, 30],
    iconAnchor: isCurrent ? [17.5, 50] : [15, 45],
    popupAnchor: [0, isCurrent ? -50 : -45],
  });

  // Build popup content with all companies for this country
  let popupContent = `<div class="map-popup">`;
  popupContent += `<div class="map-popup-country">${location.country}</div>`;

  location.companies.forEach((company, index) => {
    if (index > 0) popupContent += `<div class="map-popup-divider"></div>`;
    popupContent += `
                    <div class="map-popup-company">
                        <strong>${company.company}</strong>
                        <span>${company.role}</span>
                        <small>${company.city}</small>
                        <small>${company.period}</small>
                    </div>
                `;
  });

  popupContent += `</div>`;

  const marker = L.marker(location.coords, { icon: markerIcon }).addTo(map);
  marker.bindPopup(popupContent);

  // Store marker by country
  markers[location.country] = marker;
});

// Add click handlers to timeline items
document.querySelectorAll(".timeline-item-flat").forEach((item) => {
  item.addEventListener("click", () => {
    const country = item.getAttribute("data-country");
    const marker = markers[country];
    if (marker) {
      map.setView(marker.getLatLng(), 6, {
        animate: true,
        duration: 1,
      });
      setTimeout(() => {
        marker.openPopup();
      }, 500);
    }
  });
});

// Progress Bar Functionality
const progressBarFill = document.querySelector(".progress-bar-fill");
const checkpoints = document.querySelectorAll(".checkpoint");

function updateProgressBar() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrolled = window.scrollY;
  const progress = (scrolled / documentHeight) * 100;

  progressBarFill.style.width = progress + "%";

  // Update active checkpoint based on scroll position
  const sections = ["hero", "about", "experience", "skills", "contact"];
  let activeIndex = 0;

  sections.forEach((sectionId, index) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
        activeIndex = index;
      }
    }
  });

  checkpoints.forEach((checkpoint, index) => {
    if (index <= activeIndex) {
      checkpoint.classList.add("active");
    } else {
      checkpoint.classList.remove("active");
    }
  });
}

// Checkpoint click handlers
checkpoints.forEach((checkpoint) => {
  checkpoint.addEventListener("click", () => {
    const sectionId = checkpoint.getAttribute("data-section");
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

window.addEventListener("scroll", updateProgressBar);
window.addEventListener("resize", updateProgressBar);
updateProgressBar();

const modal = document.getElementById("contactModal");
const openBtn = document.getElementById("contactBtn");
const closeBtn = document.querySelector(".close-btn");

openBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("active");
  }
});

function showNotification(type, message) {
  const container = document.getElementById("notificationContainer");
  if (!container) return;

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  container.appendChild(notification);

  requestAnimationFrame(() => notification.classList.add("show"));

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 250);
  }, 3500);
}

async function sendContactEmail(payload) {
  const res = await fetch(
    "https://backend-pwer.onrender.com/notification/send",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");

  return data;
}

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const submitBtn = form.querySelector('button[type="submit"]');
  const oldText = submitBtn.textContent;

  const fd = new FormData(form);
  const payload = {
    name: fd.get("name"),
    email: fd.get("email"),
    phone: fd.get("phone"),
    description: fd.get("message"),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    const result = await sendContactEmail(payload);

    showNotification("success", result.message || "Message sent successfully!");
    form.reset();

    // ✅ close modal correctly
    modal.classList.remove("active");
  } catch (err) {
    console.error(err);
    showNotification("error", err.message || "Something went wrong");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = oldText;
  }
});
