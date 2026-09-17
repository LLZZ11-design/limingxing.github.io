(function () {
  var DESIGN_WIDTH = 375;
  var PHONE_MAX = 430;
  var DESKTOP_MIN = 480;
  var ticking = false;

  function currentWidth() {
    return document.documentElement.clientWidth || window.innerWidth || DESIGN_WIDTH;
  }

  function fit() {
    var vw = currentWidth();
    var isDesktop = vw >= DESKTOP_MIN;
    var minSide = isDesktop ? 24 : 0;
    var visualWidth = isDesktop
      ? Math.min(PHONE_MAX, Math.max(DESIGN_WIDTH, vw - minSide * 2))
      : vw;
    var side = Math.max(minSide, (vw - visualWidth) / 2);
    var root = document.documentElement.style;
    root.setProperty("--h5-scale", String(visualWidth / DESIGN_WIDTH));
    root.setProperty("--h5-side", side + "px");
  }

  function onResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      fit();
    });
  }

  fit();
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", function () {
    setTimeout(fit, 80);
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onResize, { passive: true });
  }
})();
