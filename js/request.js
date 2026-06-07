var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsUBSXZBmDQyo8OcuYHAAmH5SwH5cDV0vUWnwdbH6J3dMeQemI0qB1TTjCdDOEQOTtOw/exec';

function loadRequests() {
  var list = document.getElementById('request-list');
  fetch(SCRIPT_URL)
    .then(function (r) { return r.json(); })
    .then(function (requests) {
      if (!requests.length) {
        list.innerHTML = '<p class="empty-board">No requests yet. Be the first to submit one!</p>';
        return;
      }
      list.innerHTML = '';
      requests.forEach(function (req) {
        var item = document.createElement('div');
        item.className = 'request-item' + (req.status === 'completed' ? ' completed' : '');
        var checkbox = req.status === 'completed'
          ? '<input type="checkbox" checked disabled>'
          : '<input type="checkbox" disabled>';
        var link = req.link
          ? '<span class="request-link"><a href="' + req.link + '" target="_blank" rel="noopener">View Wallpaper</a></span>'
          : '';
        var note = req.notes ? '<span class="request-note">' + req.notes + '</span>' : '';
        item.innerHTML =
          checkbox +
          '<span class="request-no">#' + req.id + '</span>' +
          '<span class="request-details">' +
            '<span class="request-artist">' + req.artist + '</span>' +
            note +
          '</span>' +
          link;
        list.appendChild(item);
      });
    })
    .catch(function () {
      list.innerHTML = '<p class="empty-board">Could not load requests. Please try again later.</p>';
    });
}

document.addEventListener('DOMContentLoaded', function () {
  loadRequests();

  var form = document.getElementById('request-form');
  var msg = document.getElementById('form-message');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var artist = document.getElementById('artist').value.trim();
    var notes = document.getElementById('note').value.trim();
    if (!artist) return;

    var btn = form.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Submitting...';
    msg.textContent = '';
    msg.className = 'form-message';

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ artist: artist, notes: notes })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.result === 'success') {
          msg.textContent = 'Request #' + data.id + ' submitted successfully!';
          msg.className = 'form-message success';
          form.reset();
          loadRequests();
        } else {
          msg.textContent = 'Something went wrong. Please try again.';
          msg.className = 'form-message error';
        }
      })
      .catch(function () {
        msg.textContent = 'Something went wrong. Please try again.';
        msg.className = 'form-message error';
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Submit Request';
      });
  });
});
