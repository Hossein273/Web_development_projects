// nav scroll + active link + mobile
(function () {
  var nav = document.getElementById("nav"),
    burger = document.getElementById("burger"),
    links = document.getElementById("navlinks");
  var sections = [].slice.call(document.querySelectorAll("section[id]"));
  var navas = [].slice.call(document.querySelectorAll(".nav-links a"));
  addEventListener(
    "scroll",
    function () {
      nav.classList.toggle("scrolled", scrollY > 40);
      var cur = "";
      sections.forEach(function (s) {
        if (scrollY >= s.offsetTop - 120) cur = s.id;
      });
      navas.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + cur);
      });
    },
    { passive: true }
  );
  burger.addEventListener("click", function () {
    var o = burger.classList.toggle("open");
    links.classList.toggle("open", o);
    document.body.style.overflow = o ? "hidden" : "";
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      burger.classList.remove("open");
      links.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var t = document.querySelector(a.getAttribute("href"));
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
// reveal
(function () {
  var els = [].slice.call(document.querySelectorAll(".rv"));
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach(function (e) {
    io.observe(e);
  });
})();
// hero rotator
(function () {
  var pvs = [].slice.call(document.querySelectorAll("#rotator .pv"));
  var tabs = [].slice.call(document.querySelectorAll(".rtab"));
  var url = document.getElementById("frame-url");
  if (!pvs.length) return;
  var urls = [
    "Charcoalandcrust.com.au",
    "bloomCo.com.au",
    "TopCarRemoval.com.au",
    "Almasreceptions.com.au",
  ];
  var i = 0,
    timer,
    paused = false;
  function show(n) {
    i = (n + pvs.length) % pvs.length;
    pvs.forEach(function (p, k) {
      p.classList.toggle("on", k === i);
    });
    tabs.forEach(function (t, k) {
      t.classList.toggle("on", k === i);
    });
    if (url) url.textContent = urls[i] || urls[0];
  }
  function next() {
    if (!paused) show(i + 1);
  }
  tabs.forEach(function (t, k) {
    t.addEventListener("click", function () {
      show(k);
      restart();
    });
  });
  var wrap = document.getElementById("rotator");
  wrap.addEventListener("mouseenter", function () {
    paused = true;
  });
  wrap.addEventListener("mouseleave", function () {
    paused = false;
  });
  function restart() {
    clearInterval(timer);
    timer = setInterval(next, 3200);
  }
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    show(0);
    restart();
  } else {
    show(0);
  }
})();
// work filter
(function () {
  var chips = [].slice.call(document.querySelectorAll(".chip"));
  var projs = [].slice.call(document.querySelectorAll(".proj[data-cat]"));
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      chips.forEach(function (x) {
        x.classList.remove("on");
      });
      c.classList.add("on");
      var f = c.dataset.filter;
      projs.forEach(function (p) {
        var ok = f === "all" || p.dataset.cat.split(" ").indexOf(f) > -1;
        p.classList.toggle("hide", !ok);
      });
    });
  });
})();
// counters
(function () {
  var nums = [].slice.call(document.querySelectorAll(".n[data-to]"));
  if (!nums.length) return;
  var done = false;
  var io = new IntersectionObserver(
    function (es) {
      if (es[0].isIntersecting && !done) {
        done = true;
        nums.forEach(function (el) {
          var to = parseFloat(el.dataset.to),
            pre = el.dataset.pre || "",
            suf = el.dataset.suf || "",
            st = performance.now(),
            dur = 1500;
          function tick(now) {
            var p = Math.min((now - st) / dur, 1),
              e = 1 - Math.pow(1 - p, 3);
            el.textContent = pre + Math.round(e * to) + suf;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      }
    },
    { threshold: 0.5 }
  );
  io.observe(nums[0].closest(".hero-stats") || nums[0]);
})();
// form
(function () {
  var f = document.getElementById("startform"),
    ok = document.getElementById("formok"),
    b = document.getElementById("sendbtn");
  if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var t = b.innerHTML;
    b.innerHTML = "Sending…";
    b.disabled = true;
    setTimeout(function () {
      ok.classList.add("on");
      b.innerHTML = t;
      b.disabled = false;
    }, 1300);
  });
})();
console.log(
  "%cNORTHBOUND — web studio",
  "font:700 18px Bricolage Grotesque,sans-serif;color:#5B4BFF"
);
