// Warns old browsers to update their browser
// Resource: https://browser-update.org/#install

var $buoop = {};

function $buo_f() {
  var e = document.createElement("script");
  e.src = "//browser-update.org/update.min.js";
  document.body.appendChild(e);
};

try { document.addEventListener("DOMContentLoaded", $buo_f, false) } catch (e) { window.attachEvent("onload", $buo_f) }
