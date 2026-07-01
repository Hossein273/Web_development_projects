(function () {
  var nav = document.getElementById("nav"),
    burger = document.getElementById("burger"),
    links = document.getElementById("navlinks");
  var secs = [].slice.call(document.querySelectorAll("section[id]"));
  var navas = [].slice.call(document.querySelectorAll(".nav-links a"));
  addEventListener(
    "scroll",
    function () {
      nav.classList.toggle("scrolled", scrollY > 40);
      var cur = "";
      secs.forEach(function (s) {
        if (scrollY >= s.offsetTop - 130) cur = s.id;
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
      var href = a.getAttribute("href");
      if (!href || href === "#") return;
      var t = document.querySelector(href);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
[].slice.call(document.querySelectorAll(".ph img")).forEach(function (img) {
  img.addEventListener("error", function () {
    img.classList.add("imgfail");
  });
});
(function () {
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
  [].slice.call(document.querySelectorAll(".rv")).forEach(function (e) {
    io.observe(e);
  });
})();
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
            suf = el.dataset.suf || "",
            dec = to % 1 !== 0,
            st = performance.now(),
            dur = 1400;
          function tk(now) {
            var p = Math.min((now - st) / dur, 1),
              e = 1 - Math.pow(1 - p, 3),
              v = e * to;
            el.textContent = (dec ? v.toFixed(1) : Math.round(v)) + suf;
            if (p < 1) requestAnimationFrame(tk);
          }
          requestAnimationFrame(tk);
        });
      }
    },
    { threshold: 0.4 }
  );
  io.observe(nums[0]);
})();
(function () {
  var f = document.getElementById("bookform"),
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
    }, 1200);
  });
})();
console.log(
  "%cTORQUE AUTO CO.",
  "font:800 20px Archivo,sans-serif;color:#F5B21A"
);
