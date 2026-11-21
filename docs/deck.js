// Arrow-key navigation for deck.html. No network, no eval, no inline handlers.
(function () {
  'use strict';
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var counter = document.getElementById('counter');
  var index = 0;

  function fromHash() {
    var n = parseInt(window.location.hash.replace('#s', ''), 10);
    return n >= 1 && n <= slides.length ? n - 1 : 0;
  }

  function show(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, k) {
      s.classList.toggle('active', k === index);
    });
    counter.textContent = index + 1 + ' / ' + slides.length;
    if (window.location.hash !== '#s' + (index + 1)) {
      window.history.replaceState(null, '', '#s' + (index + 1));
    }
  }

  function toggleNotes() {
    slides[index].classList.toggle('show-notes');
  }

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        show(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        show(index - 1);
        break;
      case 'Home':
        show(0);
        break;
      case 'End':
        show(slides.length - 1);
        break;
      case 'n':
      case 'N':
        toggleNotes();
        break;
      default:
    }
  });

  document.addEventListener('click', function (e) {
    show(e.clientX < window.innerWidth / 3 ? index - 1 : index + 1);
  });

  window.addEventListener('hashchange', function () {
    show(fromHash());
  });

  show(fromHash());
})();
