(() => {
  const root = document.documentElement;
  const body = document.body;
  const translatable = document.querySelectorAll('[data-zh][data-en]');
  const languageButtons = document.querySelectorAll('[data-lang]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const siteNav = document.querySelector('[data-site-nav]');
  const clock = document.querySelector('[data-clock]');
  const year = document.querySelector('[data-year]');

  const setLanguage = (language) => {
    const safeLanguage = language === 'en' ? 'en' : 'zh';
    root.lang = safeLanguage === 'zh' ? 'zh-CN' : 'en';
    body.dataset.language = safeLanguage;

    translatable.forEach((element) => {
      const value = element.dataset[safeLanguage];
      if (value !== undefined) element.textContent = value;
    });

    languageButtons.forEach((button) => {
      const isActive = button.dataset.lang === safeLanguage;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    const title = safeLanguage === 'zh' ? body.dataset.titleZh : body.dataset.titleEn;
    if (title) document.title = title;

    try {
      localStorage.setItem('brucy-language', safeLanguage);
    } catch {
      // The page remains fully functional when storage is unavailable.
    }
  };

  const savedLanguage = (() => {
    try {
      return localStorage.getItem('brucy-language');
    } catch {
      return null;
    }
  })();

  setLanguage(savedLanguage || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'));
  languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.lang)));

  if (year) year.textContent = String(new Date().getFullYear());

  const updateClock = () => {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Hong_Kong',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  };
  updateClock();
  window.setInterval(updateClock, 1000);

  if (menuButton && siteNav) {
    menuButton.addEventListener('click', () => {
      const isOpen = body.classList.toggle('nav-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
    siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      body.classList.remove('nav-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        body.classList.remove('nav-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const sections = document.querySelectorAll('main section[id]');
  const sectionLinks = document.querySelectorAll('[data-section-link]');
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
      if (!current) return;
      sectionLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${current.target.id}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.2, 0.6] });
    sections.forEach((section) => sectionObserver.observe(section));
  }
})();
