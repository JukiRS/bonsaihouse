// Клик по названию сайта в шапке ведёт на главную страницу
(function () {
  function wire() {
    var title = document.querySelector('.md-header__title');
    var logo = document.querySelector('.md-header a.md-logo');
    if (!title || !logo) return;
    title.style.cursor = 'pointer';
    if (title.dataset.homeWired) return;
    title.dataset.homeWired = '1';
    title.addEventListener('click', function () {
      window.location.href = logo.getAttribute('href');
    });
  }
  document.addEventListener('DOMContentLoaded', wire);
  wire();
})();

// Плавное появление элементов главной страницы (reveal)
(function () {
  function reveal() {
    var hero = document.querySelector('.bh-hero');
    if (!hero) return; // только на главной
    document.body.classList.add('bh-home');

    // Группы: [селектор, шаг стаггера в мс]. У каждой группы — свой каскад.
    var groups = [
      ['.bh-hero-logo', 80],
      ['.bh-badge', 80],
      ['.bh-hero h1', 80],
      ['.bh-sub', 80],
      ['.bh-hero .md-button', 80],
      ['.md-content h2', 0],
      ['.bh-staff', 130],   // администрация — заметный вылет слева направо
      ['.bh-steps li', 90]
    ];

    var targets = [];
    groups.forEach(function (g) {
      var local = 0;
      document.querySelectorAll(g[0]).forEach(function (el) {
        if (el.dataset.bhReveal) return;
        el.dataset.bhReveal = '1';
        el.classList.add('bh-reveal');
        el.style.transitionDelay = (local * g[1]) + 'ms';
        local++;
        targets.push(el);
      });
    });
    if (!targets.length) return;

    // Принудительный reflow, чтобы стартовое состояние (opacity:0) отрисовалось
    void document.body.offsetHeight;

    // показать элемент и затем убрать классы анимации,
    // чтобы они не мешали hover-эффектам (например, у карточек админов)
    function show(el) {
      if (el.dataset.bhShown) return;
      el.dataset.bhShown = '1';
      el.classList.add('bh-in');
      setTimeout(function () {
        el.classList.remove('bh-reveal', 'bh-in');
        el.style.transitionDelay = '';
      }, 1500);
    }

    if (!('IntersectionObserver' in window)) {
      requestAnimationFrame(function () { targets.forEach(show); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          show(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    // Наблюдаем на следующем кадре — гарантия проигрывания перехода
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        targets.forEach(function (el) { io.observe(el); });
      });
    });

    // Страховка: показать всё максимум через 3 секунды
    setTimeout(function () { targets.forEach(show); }, 3000);
  }

  if (window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(reveal);
  } else {
    document.addEventListener('DOMContentLoaded', reveal);
    reveal();
  }
})();
