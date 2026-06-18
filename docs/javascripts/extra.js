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
