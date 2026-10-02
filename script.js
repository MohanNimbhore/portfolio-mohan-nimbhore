(() => {
  const body = document.body;
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const progress = document.querySelector(".scroll-progress");

  // Theme preference (stored locally in the browser).
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("mohan-portfolio-theme"); } catch (_) { /* file:// privacy settings may block storage */ }
  if (savedTheme === "light") body.classList.add("light");
  const updateThemeIcon = () => {
    const isLight = body.classList.contains("light");
    themeIcon.textContent = isLight ? "☾" : "☼";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isLight ? "#f3f2ed" : "#0b0b0d");
  };
  updateThemeIcon();
  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("light");
    try { localStorage.setItem("mohan-portfolio-theme", body.classList.contains("light") ? "light" : "dark"); } catch (_) { /* theme still works for this page view */ }
    updateThemeIcon();
  });

  // Mobile navigation.
  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks?.classList.toggle("open", !isOpen);
  });
  navLinks?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }));

  // Scroll progress indicator.
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = `${percent}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Reveal content as it enters the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Keep all in-page links smooth even if CSS behavior is overridden.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  });

  // Certificate PDFs remain hidden until a certificate card is clicked.
  const certificateModal = document.querySelector("#certificateModal");
  const certificateFrame = document.querySelector("#certificateFrame");
  const certificateTitle = document.querySelector("#certificateModalTitle");
  const certificateOpenNew = document.querySelector("#certificateOpenNew");
  const certificateClose = document.querySelector(".certificate-close");
  document.querySelectorAll("[data-certificate]").forEach(card => {
    card.addEventListener("click", () => {
      const file = card.dataset.certificate;
      certificateTitle.textContent = card.dataset.title || "Certificate";
      certificateFrame.src = `${file}#toolbar=0&navpanes=0&view=FitH`;
      certificateOpenNew.href = file;
      if (typeof certificateModal.showModal === "function") certificateModal.showModal();
      else window.open(file, "_blank", "noopener,noreferrer");
    });
  });
  const closeCertificate = () => {
    if (certificateModal?.open) certificateModal.close();
    if (certificateFrame) certificateFrame.src = "about:blank";
  };
  certificateClose?.addEventListener("click", closeCertificate);
  certificateModal?.addEventListener("click", event => {
    if (event.target === certificateModal) closeCertificate();
  });
  certificateModal?.addEventListener("close", () => {
    if (certificateFrame) certificateFrame.src = "about:blank";
  });

})();