document.addEventListener('DOMContentLoaded', function () {
  var BATCH = 6;
  var wrappers = document.querySelectorAll('.tweet-wrapper');
  var total = wrappers.length;
  var countEl = document.querySelector('.tweet-count');
  var btn = document.querySelector('.show-more-btn');
  var shown = BATCH;

  if (countEl) countEl.textContent = total + ' Wallpaper Set';

  wrappers.forEach(function (w, i) {
    if (i >= BATCH) w.style.display = 'none';
  });

  if (!btn) return;
  if (total <= BATCH) { btn.style.display = 'none'; return; }

  btn.addEventListener('click', function () {
    var next = shown + BATCH;
    wrappers.forEach(function (w, i) {
      if (i < next) w.style.display = '';
    });
    shown = next;
    if (window.twttr && twttr.widgets) twttr.widgets.load();
    if (shown >= total) btn.style.display = 'none';
  });
});
