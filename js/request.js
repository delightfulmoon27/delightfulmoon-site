var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsUBSXZBmDQyo8OcuYHAAmH5SwH5cDV0vUWnwdbH6J3dMeQemI0qB1TTjCdDOEQOTtOw/exec';

function loadRequests() {
  var list = document.getElementById('request-list');
  var url = SCRIPT_URL + '?t=' + Date.now();
  fetch(url, { redirect: 'follow' })
    .then(function (r) { return r.text(); })
    .then(function (text) {
      var requests = JSON.parse(text);
      if (!requests.length) {
        list.innerHTML = '<p class="empty-board">No requests yet. Be the first to submit one!</p>';
        return;
      }
      requests.sort(function (a, b) { return b.id - a.id; });
      list.innerHTML = '';
      requests.forEach(function (req) {
        var status = (req.status || '').toString().trim().toLowerCase();
        var isCompleted = status === 'completed';
        var item = document.createElement('div');
        item.className = 'request-item' + (isCompleted ? ' completed' : '');
        var statusText = isCompleted
          ? '<span class="request-status status-completed">Completed</span>'
          : '<span class="request-status status-pending">Pending</span>';
        var link = req.link
          ? '<span class="request-link"><a href="' + req.link + '" target="_blank" rel="noopener">View Wallpaper</a></span>'
          : '';
        var note = req.notes ? '<span class="request-note">' + req.notes + '</span>' : '';
        item.innerHTML =
          statusText +
          '<span class="request-no">#' + req.id + '</span>' +
          '<span class="request-details">' +
            '<span class="request-artist">' + req.artist + '</span>' +
            note +
          '</span>' +
          link;
        list.appendChild(item);
      });
    })
    .catch(function (err) {
      console.error('Failed to load requests:', err);
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
      redirect: 'follow',
      body: JSON.stringify({ artist: artist, notes: notes })
    })
      .then(function (r) { return r.text(); })
      .then(function (text) {
        var data = JSON.parse(text);
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
        msg.textContent = 'Request submitted! Refreshing board...';
        msg.className = 'form-message success';
        form.reset();
        setTimeout(loadRequests, 2000);
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Submit Request';
      });
  });
});
