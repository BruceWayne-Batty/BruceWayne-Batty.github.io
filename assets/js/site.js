(() => {
  const root = document.documentElement;
  const body = document.body;
  const menuButton = document.querySelector('[data-menu-toggle]');
  const siteNav = document.querySelector('[data-site-nav]');
  const clock = document.querySelector('[data-clock]');
  const year = document.querySelector('[data-year]');
  root.classList.add('js');

  if (year) year.textContent = String(new Date().getFullYear());
  if (clock) {
    const updateClock = () => {
      clock.textContent = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Hong_Kong', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }).format(new Date());
    };
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  if (menuButton && siteNav) {
    const mobileLayout = window.matchMedia('(max-width: 980px)');
    const setMenuOpen = (isOpen, restoreFocus = false) => {
      const wasOpen = body.classList.contains('nav-open');
      body.classList.toggle('nav-open', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
      siteNav.inert = mobileLayout.matches && !isOpen;
      if (isOpen) siteNav.querySelector('a')?.focus();
      if (wasOpen && restoreFocus) menuButton.focus();
    };
    menuButton.addEventListener('click', () => setMenuOpen(!body.classList.contains('nav-open')));
    siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      const wasOpen = body.classList.contains('nav-open');
      setMenuOpen(false);
      const href = link.getAttribute('href');
      const target = href?.startsWith('#') ? document.getElementById(href.slice(1)) : null;
      if (wasOpen && target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuOpen(false, true);
    });
    document.addEventListener('click', (event) => {
      if (!body.classList.contains('nav-open') || siteNav.contains(event.target) || menuButton.contains(event.target)) return;
      setMenuOpen(false, siteNav.contains(document.activeElement));
    });
    mobileLayout.addEventListener('change', () => {
      setMenuOpen(false, mobileLayout.matches && siteNav.contains(document.activeElement));
    });
    setMenuOpen(false);
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => revealObserver.observe(element));
    root.classList.add('has-reveal');
  }

  const sectionLinks = document.querySelectorAll('[data-section-link]');
  const sectionIds = new Set([...sectionLinks].map((link) => link.getAttribute('href')));
  const sections = [...document.querySelectorAll('main section[id]')].filter((section) => sectionIds.has(`#${section.id}`));
  if (sections.length) {
    let scheduled = false;
    const updateActiveSection = () => {
      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
      let current = sections[0];
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= headerHeight + 40) current = section;
      });
      if (window.scrollY + window.innerHeight >= root.scrollHeight - 2) current = sections[sections.length - 1];
      sectionLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${current.id}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      scheduled = false;
    };
    const scheduleUpdate = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updateActiveSection);
    };
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);
    updateActiveSection();
  }
})();
