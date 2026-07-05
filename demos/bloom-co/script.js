/* =====================================================================
   Bloom Co. — interactions only.
   The product catalogue is now static HTML in index.html, so nothing
   here builds cards or loads images. This script just adds behaviour:
   filtering, cart, favourites, nav, reveal-on-scroll and the order form.
   The site works with this file removed — you simply lose the
   interactive extras; every card and image still shows.
   ===================================================================== */

/* ---------- category filter (operates on the static cards) ---------- */
(function () {
  var grid = document.getElementById("shopgrid");
  if (!grid) return;
  var cards = [].slice.call(grid.querySelectorAll(".card"));
  var chips = [].slice.call(document.querySelectorAll(".chip"));

  function applyFilter(f) {
    cards.forEach(function (card) {
      var show = f === "all" || card.dataset.cat === f;
      card.classList.toggle("hide", !show);
    });
  }

  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      chips.forEach(function (x) {
        x.classList.remove("on");
      });
      c.classList.add("on");
      applyFilter(c.dataset.filter);
    });
  });

  /* category tiles jump to the shop and set the matching filter */
  [].slice.call(document.querySelectorAll("[data-jump]")).forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var f = a.dataset.jump;
      var chip =
        document.querySelector('.chip[data-filter="' + f + '"]') ||
        document.querySelector('.chip[data-filter="all"]');
      chips.forEach(function (x) {
        x.classList.remove("on");
      });
      chip.classList.add("on");
      applyFilter(chip.dataset.filter);
      document
        .getElementById("shop")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

/* ---------- cart / favourites / image fallback ---------- */
(function () {
  var cartCount = 0,
    cEl = document.getElementById("cartcount"),
    toast = document.getElementById("toast"),
    tt;

  [].slice.call(document.querySelectorAll(".add")).forEach(function (b) {
    b.addEventListener("click", function () {
      cartCount++;
      cEl.textContent = cartCount;
      cEl.classList.add("show");
      toast.querySelector(".tx").textContent =
        (b.dataset.name || "Bouquet") + " added to cart";
      toast.classList.add("show");
      clearTimeout(tt);
      tt = setTimeout(function () {
        toast.classList.remove("show");
      }, 2200);
    });
  });

  [].slice.call(document.querySelectorAll(".card-fav")).forEach(function (f) {
    f.addEventListener("click", function () {
      f.classList.toggle("liked");
    });
  });

  /* if an image file is missing, fade it so the gradient placeholder shows */
  [].slice.call(document.querySelectorAll(".ph img")).forEach(function (img) {
    img.addEventListener("error", function () {
      img.classList.add("imgfail");
    });
  });
})();

/* ---------- nav / scroll / reveal ---------- */
(function () {
  var nav = document.getElementById("nav"),
    burger = document.getElementById("burger"),
    links = document.getElementById("navlinks");
  var secs = [].slice.call(document.querySelectorAll("section[id]"));
  var navas = [].slice.call(document.querySelectorAll(".nav-links a"));
  addEventListener(
    "scroll",
    function () {
      nav.classList.toggle("scrolled", scrollY > 30);
      var cur = "";
      secs.forEach(function (s) {
        if (scrollY >= s.offsetTop - 140) cur = s.id;
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
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  [].slice.call(document.querySelectorAll(".rv")).forEach(function (e) {
    io.observe(e);
  });
})();

/* ---------- newsletter ---------- */
(function () {
  var f = document.getElementById("newsform"),
    ok = document.getElementById("newsok");
  if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    f.style.display = "none";
    ok.classList.add("on");
  });
})();

/* ---------- order form ---------- */
(function () {
  var form = document.getElementById("orderform");
  if (!form) return;
  var sel = document.getElementById("orderproduct"),
    seg = form.querySelector(".seg"),
    methodField = document.getElementById("methodfield"),
    card = form.closest(".order-card"),
    dateInput = document.getElementById("orderdate"),
    dateLabel = document.getElementById("datelabel"),
    okPanel = document.getElementById("orderok"),
    okMsg = document.getElementById("orderokmsg");

  /* min date = today */
  var t = new Date(),
    iso = t.toISOString().split("T")[0];
  dateInput.min = iso;
  dateInput.value = iso;

  /* delivery / pickup toggle */
  seg.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-method]");
    if (!btn) return;
    seg.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("on", b === btn);
    });
    var m = btn.dataset.method;
    methodField.value = m;
    card.classList.toggle("pickup", m === "pickup");
    dateLabel.textContent = m === "pickup" ? "Pickup date" : "Delivery date";
    var addr = form.querySelector('[name="address"]');
    if (addr) addr.required = m === "delivery";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var m = methodField.value,
      when = form.querySelector('[name="date"]').value,
      prod = sel.value || "your flowers";
    okMsg.textContent =
      m === "pickup"
        ? "Your " +
          prod +
          " will be ready for pickup at our Brisbane studio on " +
          when +
          ". We\u2019ll text you when it\u2019s ready."
        : "Your " +
          prod +
          " will be delivered on " +
          when +
          ". We\u2019ll text you a confirmation shortly.";
    okPanel.classList.add("on");
  });

  document.getElementById("orderagain").addEventListener("click", function () {
    form.reset();
    dateInput.value = iso;
    seg.querySelectorAll("button").forEach(function (b, i) {
      b.classList.toggle("on", i === 0);
    });
    methodField.value = "delivery";
    card.classList.remove("pickup");
    dateLabel.textContent = "Delivery date";
    okPanel.classList.remove("on");
  });
})();
