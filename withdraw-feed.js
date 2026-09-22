(function () {
  var track = document.getElementById("withdraw-feed");
  if (!track) return;

  var surnames = "李王张刘陈杨赵黄周吴徐孙胡朱高林何郭马罗梁宋郑谢韩唐冯于董萧";
  var lastSurname = "";
  var lastAmount = 0;
  var lastMinutes = 0;
  var timer = 0;
  var busy = false;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickDiff(prev, min, max) {
    var value = rand(min, max);
    var guard = 0;
    while (value === prev && guard < 8) {
      value = rand(min, max);
      guard += 1;
    }
    return value;
  }

  function pickSurname() {
    var name = surnames.charAt(rand(0, surnames.length - 1));
    var guard = 0;
    while (name === lastSurname && guard < 8) {
      name = surnames.charAt(rand(0, surnames.length - 1));
      guard += 1;
    }
    lastSurname = name;
    return name;
  }

  function makeItem() {
    lastMinutes = pickDiff(lastMinutes, 1, 59);
    lastAmount = pickDiff(lastAmount, 10, 150);
    var el = document.createElement("div");
    el.className = "home-withdraw-feed-item";
    el.innerHTML =
      pickSurname() +
      "** " +
      lastMinutes +
      "分钟前提现<em>￥" +
      lastAmount +
      "</em>已到账";
    return el;
  }

  function holdDelay() {
    var roll = Math.random();
    if (roll < 0.15) return rand(900, 1300);
    if (roll < 0.8) return rand(1600, 2600);
    return rand(2800, 4000);
  }

  function showNext() {
    if (busy) return;
    busy = true;
    var current = track.querySelector(".home-withdraw-feed-item.is-in");
    var next = makeItem();
    track.appendChild(next);

    function enter() {
      if (reduced) {
        next.classList.add("is-in");
        busy = false;
        timer = window.setTimeout(showNext, holdDelay());
        return;
      }
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          next.classList.add("is-in");
        });
      });
      timer = window.setTimeout(function () {
        busy = false;
        timer = window.setTimeout(showNext, holdDelay());
      }, 520);
    }

    if (current) {
      current.classList.remove("is-in");
      current.classList.add("is-out");
      window.setTimeout(function () {
        if (current.parentNode === track) track.removeChild(current);
        enter();
      }, reduced ? 0 : 380);
    } else {
      enter();
    }
  }

  showNext();

  document.addEventListener("visibilitychange", function () {
    window.clearTimeout(timer);
    if (!document.hidden && !busy) {
      timer = window.setTimeout(showNext, holdDelay());
    }
  });
})();
