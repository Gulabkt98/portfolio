(() => {
  "use strict";

  const projectData = {
    sql: {
      title: "AI Database Agent",
      category: "Full stack / Generative AI · June 2026",
      intro: "A full-stack text-to-SQL agent that turns natural-language questions into safe, read-only database queries.",
      problem: "Database access is powerful, but generated SQL needs clear boundaries. The goal was to make natural-language querying useful while governing what reaches the database.",
      points: [
        "A multi-node LangGraph pipeline interprets each question and generates SQL. An sqlglot AST validator enforces SELECT-only statements and injects row limits before execution.",
        "Statement timeouts govern queries. JWT authentication and role-based access control secure access, while Fernet encrypts stored database credentials at rest.",
        "An asynchronous SQLAlchemy backend uses Alembic migrations. FastAPI, React, PostgreSQL, Redis, and Nginx run in Docker Compose, deployed on AWS EC2 behind a reverse-proxy gateway."
      ],
      tech: ["FastAPI", "LangGraph", "PostgreSQL", "SQLAlchemy", "React", "Docker", "AWS EC2", "Redis", "Nginx", "Alembic", "sqlglot", "JWT", "Fernet"],
      source: "https://github.com/Gulabkt98/SQL-AI-Agent"
    },
    rag: {
      title: "eMitra AI",
      category: "Generative AI / Multi-source RAG · April 2026",
      intro: "A retrieval-augmented generation engine that connects uploaded documents, crawled websites, and live web search to answer questions with citations.",
      problem: "Useful AI answers need relevant context and traceable sources. The goal was to bring multiple information sources into one retrieval pipeline and ground responses in that context.",
      points: [
        "The ingestion pipeline handles website crawling, document parsing, semantic chunking, embedding generation, and vector indexing.",
        "Qdrant provides semantic retrieval across indexed content, supplying the language model with relevant context from documents, websites, and search.",
        "FastAPI and React connect the pipeline with Gemini to deliver citation-based responses and reduce hallucinations. Crawl4AI supports website ingestion."
      ],
      tech: ["FastAPI", "React", "Gemini", "Qdrant", "Crawl4AI", "RAG", "Semantic retrieval", "Vector indexing"],
      source: "https://github.com/Gulabkt98/Emitra-AI-Agent-"
    },
    risk: {
      title: "Accident Risk Prediction",
      category: "Machine learning / Prediction · August 2026",
      intro: "A machine learning system for predicting road accident risk from road, weather, traffic, and historical accident data.",
      problem: "Road safety depends on conditions that interact in complex ways. The goal was to use those conditions to predict understandable Low, Medium, or High risk levels.",
      points: [
        "Preprocessing and feature engineering transform speed, weather, traffic, road conditions, and time into model inputs, including rush-hour indicators and weather severity.",
        "Logistic Regression, Random Forest, and XGBoost classifiers were trained and compared for accident risk prediction.",
        "A dashboard accepts user-entered road conditions and returns Low, Medium, or High risk predictions. The portfolio visual illustrates the idea and does not run the prediction model."
      ],
      tech: ["Python", "Pandas", "Scikit-learn", "XGBoost", "Logistic Regression", "Random Forest", "Feature engineering"]
    }
  };

  // The theme uses a fresh preference key for this redesign.
  const themeButton = document.querySelector(".theme-toggle");
  const themeKey = "gulab-portfolio-theme-v2";
  function setTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    document.querySelector('meta[name="theme-color"]').content = isDark ? "#102430" : "#f7f5f0";
  }
  try {
    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
  } catch { /* Local files and private browsing may disable storage. */ }
  themeButton.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(theme);
    try { localStorage.setItem(themeKey, theme); } catch { /* The toggle still works. */ }
  });

  // Mobile navigation remains a simple keyboard-accessible disclosure.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  function closeMenu() {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }
  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("click", event => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);

  // Filter real project cards; the count is also announced to screen readers.
  const filters = [...document.querySelectorAll(".filter-button")];
  const cards = [...document.querySelectorAll(".project-card")];
  filters.forEach(button => button.addEventListener("click", () => {
    filters.forEach(filter => filter.setAttribute("aria-pressed", String(filter === button)));
    let count = 0;
    cards.forEach(card => {
      card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) count += 1;
    });
    document.getElementById("work-count").textContent = `${String(count).padStart(2, "0")} ${count === 1 ? "project" : "projects"} / 2026`;
    document.getElementById("filter-status").textContent = `${count} ${count === 1 ? "project" : "projects"} shown`;
  }));

  // Native dialog provides Escape support, focus trapping, and an accessible modal.
  const dialog = document.getElementById("project-dialog");
  let dialogOpener = null;
  document.querySelectorAll("[data-project]").forEach(button => button.addEventListener("click", () => {
    const project = projectData[button.dataset.project];
    if (!project) return;
    dialogOpener = button;
    document.getElementById("dialog-category").textContent = project.category;
    document.getElementById("dialog-title").textContent = project.title;
    document.getElementById("dialog-intro").textContent = project.intro;
    document.getElementById("dialog-problem").textContent = project.problem;
    const points = document.getElementById("dialog-points");
    points.replaceChildren(...project.points.map(point => {
      const item = document.createElement("li");
      item.textContent = point;
      return item;
    }));
    const technology = document.getElementById("dialog-tech");
    technology.replaceChildren(...project.tech.map(name => {
      const tag = document.createElement("span");
      tag.textContent = name;
      return tag;
    }));
    const source = document.getElementById("dialog-source");
    source.replaceChildren();
    if (project.source) {
      const link = document.createElement("a");
      link.href = project.source;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "button button-primary";
      link.textContent = "Explore source on GitHub ↗";
      source.append(link);
    }
    dialog.showModal();
    document.body.classList.add("dialog-open");
    dialog.scrollTop = 0;
    dialog.querySelector(".dialog-close").focus({ preventScroll: true });
  }));
  document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (dialogOpener?.isConnected) dialogOpener.focus({ preventScroll: true });
  });

  let toastTimer;
  function notify(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
  }
  const copyButton = document.getElementById("copy-email");
  function copyFallback(email) {
    const input = document.createElement("textarea");
    input.value = email;
    input.setAttribute("readonly", "");
    input.setAttribute("aria-hidden", "true");
    input.style.cssText = "position:fixed;top:-1000px;left:0;opacity:0";
    document.body.append(input);
    input.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } finally { input.remove(); }
    copyButton.focus({ preventScroll: true });
    return copied;
  }
  copyButton.addEventListener("click", async () => {
    const email = "gulabgkg99@gmail.com";
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(email); copied = true; } catch { /* Try the local-file fallback. */ }
    }
    if (!copied) {
      try { copied = copyFallback(email); } catch { /* Show the address if copying is unavailable. */ }
    }
    notify(copied ? "Email copied. Let’s make something happen." : `Email: ${email}`);
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navigation.querySelectorAll("a").forEach(link => {
          if (link.getAttribute("href") === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
    document.querySelectorAll("main > section").forEach(section => sectionObserver.observe(section));

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("motion-ready");
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: .06, rootMargin: "0px 0px -20px 0px" });
      document.querySelectorAll("[data-reveal]").forEach(element => revealObserver.observe(element));
    }
  }
})();
