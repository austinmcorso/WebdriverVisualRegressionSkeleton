// Global var.
var selected;

window.onload = function () {
  // Consts so JS won't have to load more than once.
  RESULTS = Array.prototype.slice.call(document.getElementsByClassName('result'));
  HEADERS = Array.prototype.slice.call(document.getElementsByTagName('h4'));
  FILTERS = Array.prototype.slice.call(document.getElementsByClassName("env"));
  RESULTSLEN = RESULTS.length;

  // Load image on load.
  loadImage();

  // Update URL on result click.
  var resultClick = function() {
    document.location = this.dataset.href;
  };

  // Filter by env.
  var filter = function() {
    var i;
    for (i=0; i<RESULTSLEN; i++) {
      if (this.id === 'all' || RESULTS[i].dataset.href.toLowerCase().indexOf('/' + this.id + '/') > -1) {
        RESULTS[i].style.display = 'table-row';
      } else {
        RESULTS[i].style.display = 'none';
      }
    }

    // Hide headers if no items within associated list by checking list's height.
    env = this.id.charAt(0).toUpperCase() + this.id.slice(1);
    for (i=0; i<HEADERS.length; i++) {
      HEADERS[i].firstChild.innerHTML = env;
    }

    // Highlight filter.
    for (i=0; i<FILTERS.length; i++) {
      FILTERS[i].className = "env";
    }
    this.className = "env active";
  };

  // Add listener to results.
  for (i=0; i<RESULTSLEN; i++) {
    RESULTS[i].addEventListener('click', resultClick, false);
  }

  // Add listener to env filters.
  for (i=0; i<FILTERS.length; i++){
      FILTERS[i].addEventListener('click', filter, false);
  }

  // Keyboard shortcuts.
  document.addEventListener('keyup', function (e) {
    if (e.keyCode !== 38 && e.keyCode !== 40) {
      return;
    }

    if (e.keyCode === 38) {
      // Move up one result on up key.
      if (selected === 0) {
        return;
      } else {
        selected--;
      }
    } else if (e.keyCode === 40) {
      // Move down one result on down key.
      if (selected === RESULTSLEN-1) {
        return;
      } else {
        selected++;
      }
    }
    window.location.hash = RESULTS[selected].getAttribute("data-href").replace(/^#/, '');
  }, false);
};

// Load image on hash change.
window.onhashchange = function () {
  loadImage();
};

// Load image.
function loadImage() {
  var found = false;
  var href = window.location.hash.substring(1);
  var i;

  // Highlight selected result.
  for (i = 0; i < RESULTSLEN; i++) {
    if (href === RESULTS[i].getAttribute("data-href").replace(/^#/, '')) {
      RESULTS[i].className = "active";
      selected = i;
    } else {
      RESULTS[i].className = "";
    }
  }

  if (typeof href !== 'undefined') {
    href = /*"./tests" +*/ href + ".png";
    document.getElementById('image_diff').src = href;
  }
}
