/* Carrusel de fotos de Ana y Alvaro.
   Para anadir fotos: sube el archivo a /fotos y anade su nombre a FOTOS. */
(function () {
  'use strict';

  var FOTOS = [
    '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg',
    '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg',
    '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg',
    '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg',
    '29.jpg'
  ];

  var root = document.querySelector('[data-carousel]');
  if (!root || !FOTOS.length) return;

  var track = root.querySelector('[data-carousel-track]');
  var viewport = root.querySelector('[data-carousel-viewport]');
  var prev = root.querySelector('[data-carousel-prev]');
  var next = root.querySelector('[data-carousel-next]');
  var currentLabel = root.querySelector('[data-carousel-current]');
  var totalLabel = root.querySelector('[data-carousel-total]');
  var total = FOTOS.length;
  var index = 0;

  totalLabel.textContent = String(total);

  var slides = FOTOS.map(function (name, i) {
    var slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'diapositiva');
    slide.setAttribute('aria-label', 'Foto ' + (i + 1) + ' de ' + total);
    track.appendChild(slide);
    return slide;
  });

  function fill(i) {
    if (i < 0 || i >= total || slides[i].dataset.loaded) return;
    var img = document.createElement('img');
    img.src = 'fotos/' + (i + 20) + '-' + FOTOS[i];
    img.alt = 'Ana y Alvaro, foto ' + (i + 1) + ' de ' + total;
    img.loading = i === 0 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    slides[i].appendChild(img);
    slides[i].dataset.loaded = '1';
  }

  function go(i, smooth) {
    index = ((i % total) + total) % total;
    fill(index - 1); fill(index); fill(index + 1);
    var behavior = smooth === false ? 'auto' : 'smooth';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) behavior = 'auto';
    viewport.scrollTo({ left: slides[index].offsetLeft, behavior: behavior });
    currentLabel.textContent = String(index + 1);
  }

  prev.addEventListener('click', function () { go(index - 1); });
  next.addEventListener('click', function () { go(index + 1); });

  viewport.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1); }
  });

  /* El desplazamiento con los dedos ya mueve el scroll; solo hay que fijar la foto al soltar. */
  var scrollTimer = null;
  viewport.addEventListener('scroll', function () {
    if (scrollTimer) window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(function () {
      var nearest = 0;
      var best = Infinity;
      slides.forEach(function (slide, i) {
        var d = Math.abs(slide.offsetLeft - viewport.scrollLeft);
        if (d < best) { best = d; nearest = i; }
      });
      if (nearest !== index) {
        index = nearest;
        fill(index - 1); fill(index + 1);
        currentLabel.textContent = String(index + 1);
      }
    }, 90);
  }, { passive: true });

  window.addEventListener('resize', function () { go(index, false); });

  go(0, false);
})();
