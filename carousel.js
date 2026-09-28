/* Carrusel de fotos de Ana y Alvaro.
   Para anadir fotos: sube el archivo a /fotos y anade su nombre a FOTOS. */
(function () {
  'use strict';

  var FOTOS = [
    '20-01.jpg', '21-02.jpg', '22-03.jpg', '23-04.jpg', '24-05.jpg', '25-06.jpg',
    '26-07.jpg', '27-08.jpg', '28-09.jpg', '29-10.jpg', '30-11.jpg', '31-12.jpg',
    '32-13.jpg', '33-14.jpg', '34-15.jpg', '35-16.jpg', '36-17.jpg', '37-18.jpg',
    '38-19.jpg', '39-20.jpg', '40-21.jpg', '41-22.jpg', '42-23.jpg', '43-24.jpg',
    '44-25.jpg', '45-26.jpg', '46-27.jpg', '47-28.jpg', '48-29.jpg', '33-30.jpg',
    '34-31.jpg', '35-32.jpg', '36-33.jpg', '37-34.jpg', '38-35.jpg', '39-36.jpg',
    '40-37.jpg', '41-38.jpg', '42-39.jpg', '43-40.jpg', '44-41.jpg', '45-42.jpg',
    '46-43.jpg', '47-44.jpg', '48-45.jpg', '49-46.jpg', '50-47.jpg', '51-48.jpg',
    '52-49.jpg', '53-50.jpg', '54-51.jpg', '55-52.jpg', '56-53.jpg', '57-54.jpg',
    '58-55.jpg', '59-56.jpg', '60-57.jpg', '61-58.jpg', '62-59.jpg', '63-60.jpg'
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
    img.src = 'fotos/' + FOTOS[i];
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
        fill(index - 1); fill(index); fill(index + 1);
        currentLabel.textContent = String(index + 1);
      }
    }, 90);
  }, { passive: true });

  window.addEventListener('resize', function () { go(index, false); });

  go(0, false);
})();
