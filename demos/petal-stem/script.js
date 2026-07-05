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
      var t = document.querySelector(a.getAttribute("href"));
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
// image fallback: if a Pexels photo fails, reveal the soft placeholder
[].slice.call(document.querySelectorAll(".ph img")).forEach(function (img) {
  img.addEventListener("error", function () {
    img.classList.add("imgfail");
  });
});
// reveal
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
// shop filter
(function () {
  var chips = [].slice.call(document.querySelectorAll(".chip")),
    cards = [].slice.call(document.querySelectorAll(".card[data-cat]"));
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      chips.forEach(function (x) {
        x.classList.remove("on");
      });
      c.classList.add("on");
      var f = c.dataset.filter;
      cards.forEach(function (card) {
        card.classList.toggle("hide", !(f === "all" || card.dataset.cat === f));
      });
    });
  });
})();
// cart + toast
(function () {
  var count = 0,
    el = document.getElementById("cartcount"),
    toast = document.getElementById("toast"),
    tt;
  [].slice.call(document.querySelectorAll(".add")).forEach(function (b) {
    b.addEventListener("click", function () {
      count++;
      el.textContent = count;
      el.classList.add("show");
      var name = b.dataset.name || "Bouquet";
      toast.querySelector(".tx").textContent = name + " added to your basket";
      toast.classList.add("show");
      clearTimeout(tt);
      tt = setTimeout(function () {
        toast.classList.remove("show");
      }, 2200);
    });
  });
})();
// form
(function () {
  var f = document.getElementById("orderform"),
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
console.log("%cPetal & Stem", "font:600 20px Fraunces,serif;color:#C45B78");
