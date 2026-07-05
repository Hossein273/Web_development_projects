var WEB3FORMS_ACCESS_KEY = "152fd9fb-85a8-46d1-8434-0f25241d623d";

/* Sends a FormData payload to Web3Forms. Injects the key above automatically. */
function sendToWeb3Forms(formData) {
  formData.set("access_key", WEB3FORMS_ACCESS_KEY);
  return fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  }).then(function (r) {
    return r.json();
  });
}

/* nav + reveal + fallback */
(function () {
  var nav = document.getElementById("nav"),
    burger = document.getElementById("burger"),
    links = document.getElementById("navlinks");
  var secs = [].slice.call(document.querySelectorAll("section[id]"));
  var navas = [].slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );
  addEventListener(
    "scroll",
    function () {
      nav.classList.toggle("scrolled", scrollY > 30);
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
  function close() {
    burger.classList.remove("open");
    links.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var t = document.querySelector(a.getAttribute("href"));
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
        close();
      }
    });
  });
})();
[].slice
  .call(document.querySelectorAll(".ph img, .cbg img"))
  .forEach(function (img) {
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
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  [].slice.call(document.querySelectorAll(".rv")).forEach(function (e) {
    io.observe(e);
  });
})();

/* ===== QUOTE / VALUATION WIDGET ===== */
(function () {
  var YEAR_NOW = 2026,
    MIN = 300;
  var MAKE = {
    Toyota: 1.12,
    Mazda: 1.08,
    Ford: 1.0,
    Holden: 0.95,
    Hyundai: 1.0,
    Kia: 1.0,
    Mitsubishi: 0.98,
    Nissan: 1.0,
    Subaru: 1.05,
    Volkswagen: 1.02,
    Honda: 1.05,
    BMW: 1.3,
    "Mercedes-Benz": 1.32,
    Audi: 1.28,
    Lexus: 1.25,
    Suzuki: 0.95,
    Isuzu: 1.15,
    Jeep: 1.0,
    Other: 0.95,
  };
  var BODY = {
    Sedan: 1.0,
    Hatchback: 0.98,
    SUV: 1.12,
    Ute: 1.2,
    "4WD": 1.22,
    Van: 1.05,
    Wagon: 1.0,
  };
  var KM = { a: 1.1, b: 1.0, c: 0.9, d: 0.8, e: 0.68 };
  var q = {
    make: "",
    year: "",
    body: "SUV",
    km: "b",
    cond: 1.0,
    condLab: "Good",
    rego: 1.05,
  };
  var step = 1;
  var prog = document.getElementById("qprog"),
    lab = document.getElementById("qsteplab");
  function show(n) {
    step = n;
    [].slice.call(document.querySelectorAll(".qstep")).forEach(function (s) {
      s.classList.toggle("on", +s.dataset.step === n);
    });
    prog.style.width = n * 33.34 + "%";
    lab.textContent = "Step " + n + " of 3";
  }
  document.getElementById("qmake").addEventListener("change", function () {
    q.make = this.value;
  });
  document.getElementById("qyear").addEventListener("change", function () {
    q.year = this.value;
  });
  document.getElementById("qbody").addEventListener("change", function () {
    q.body = this.value;
  });
  document.getElementById("qkm").addEventListener("change", function () {
    q.km = this.value;
  });
  [].slice.call(document.querySelectorAll("[data-cond]")).forEach(function (b) {
    b.addEventListener("click", function () {
      [].slice
        .call(document.querySelectorAll("[data-cond]"))
        .forEach(function (x) {
          x.classList.remove("on");
        });
      b.classList.add("on");
      q.cond = +b.dataset.cond;
      q.condLab = b.dataset.lab;
    });
  });
  [].slice.call(document.querySelectorAll("[data-rego]")).forEach(function (b) {
    b.addEventListener("click", function () {
      [].slice
        .call(document.querySelectorAll("[data-rego]"))
        .forEach(function (x) {
          x.classList.remove("on");
        });
      b.classList.add("on");
      q.rego = +b.dataset.rego;
    });
  });
  function compute() {
    var yo = Math.max(0, Math.min(30, YEAR_NOW - parseInt(q.year, 10)));
    var base = 24000 * Math.pow(0.865, yo);
    var mid =
      base *
      (MAKE[q.make] || 0.95) *
      (BODY[q.body] || 1) *
      (KM[q.km] || 1) *
      q.cond *
      q.rego;
    mid = Math.max(mid, MIN);
    var low = Math.floor((mid * 0.9) / 50) * 50,
      high = Math.ceil((mid * 1.08) / 50) * 50;
    if (low < MIN) low = MIN;
    if (high <= low) high = low + 150;
    return { low: low, high: high };
  }
  function money(n) {
    return "$" + n.toLocaleString("en-AU");
  }
  document.querySelectorAll("[data-next]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (step === 1) {
        if (!q.make || !q.year) {
          window.__toast("Please choose your car\u2019s make & year");
          return;
        }
        show(2);
      } else if (step === 2) {
        var o = compute();
        document.getElementById("qoffer").textContent =
          money(o.low) + " \u2013 " + money(o.high);
        var yr = q.year,
          mk = q.make,
          md = (document.getElementById("qmodel").value || "").trim();
        document.getElementById("qvehicle").innerHTML =
          "Estimated offer for your <b>" +
          yr +
          " " +
          mk +
          (md ? " " + md : "") +
          "</b>";
        show(3);
      }
    });
  });
  document.querySelectorAll("[data-back]").forEach(function (b) {
    b.addEventListener("click", function () {
      show(Math.max(1, step - 1));
    });
  });
  var lock = document.getElementById("qlock");
  if (lock)
    lock.addEventListener("click", function () {
      var n = document.getElementById("qname").value.trim(),
        ph = document.getElementById("qphone").value.trim();
      if (!n || !ph) {
        window.__toast("Please add your name & phone");
        return;
      }
      if (!WEB3FORMS_ACCESS_KEY) {
        window.__toast("Add your Web3Forms access key in the script");
        return;
      }
      var ref = "BC-" + Math.floor(10000 + Math.random() * 90000);
      var odoSel = document.getElementById("qkm");
      var regoBtn = document.querySelector("[data-rego].on");
      var fd = new FormData();
      fd.append("subject", "New car valuation lead — Top Cash for Cars");
      fd.append("from_name", "Top Cash for Cars website");
      fd.append("reference", ref);
      fd.append("name", n);
      fd.append("phone", ph);
      fd.append("make", q.make);
      fd.append(
        "model",
        (document.getElementById("qmodel").value || "").trim()
      );
      fd.append("year", q.year);
      fd.append("body_type", q.body);
      fd.append("odometer", odoSel.options[odoSel.selectedIndex].text);
      fd.append("condition", q.condLab);
      fd.append("registered", regoBtn ? regoBtn.textContent.trim() : "");
      fd.append(
        "estimated_offer",
        document.getElementById("qoffer").textContent
      );
      var label = lock.innerHTML;
      lock.innerHTML = "Locking in\u2026";
      lock.disabled = true;
      sendToWeb3Forms(fd)
        .then(function (data) {
          if (data.success) {
            document.getElementById("qrefnum").textContent =
              "Reference: " + ref;
            document.getElementById("qofferbox").style.display = "none";
            document.getElementById("qlockform").style.display = "none";
            document.getElementById("qok").classList.add("on");
            window.__toast("Offer locked in \u2713");
          } else {
            window.__toast(
              "Couldn\u2019t lock in — " + (data.message || "please try again")
            );
            console.error("Web3Forms:", data);
            lock.innerHTML = label;
            lock.disabled = false;
          }
        })
        .catch(function (err) {
          window.__toast("Network error — please call 1300 265 800");
          console.error(err);
          lock.innerHTML = label;
          lock.disabled = false;
        });
    });
  show(1);
})();

/* FAQ accordion */
(function () {
  [].slice.call(document.querySelectorAll(".faq-it")).forEach(function (it) {
    var q = it.querySelector(".faq-q"),
      a = it.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = it.classList.contains("open");
      [].slice.call(document.querySelectorAll(".faq-it")).forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!open) {
        it.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });
})();

/* count-up stats */
(function () {
  var done = false;
  var strip = document.querySelector(".stats");
  if (!strip) return;
  function run() {
    if (done) return;
    done = true;
    [].slice
      .call(document.querySelectorAll(".stat .n[data-to]"))
      .forEach(function (el) {
        var to = +el.dataset.to,
          pre = el.dataset.pre || "",
          suf = el.dataset.suf || "",
          t0 = null;
        function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1100, 1);
          var v = Math.floor((1 - Math.pow(1 - p, 3)) * to);
          el.textContent = pre + v.toLocaleString("en-AU") + suf;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
  }
  new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) run();
      });
    },
    { threshold: 0.4 }
  ).observe(strip);
})();

/* contact form -> Web3Forms */
(function () {
  var f = document.getElementById("ctform"),
    ok = document.getElementById("ctok"),
    b = document.getElementById("ctsend");
  if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!f.reportValidity()) return;
    if (!WEB3FORMS_ACCESS_KEY) {
      window.__toast("Add your Web3Forms access key in the script");
      return;
    }
    var label = b.innerHTML;
    b.innerHTML = "Sending\u2026";
    b.disabled = true;
    sendToWeb3Forms(new FormData(f))
      .then(function (data) {
        if (data.success) {
          ok.classList.add("on");
          f.reset();
        } else {
          window.__toast(
            "Couldn\u2019t send — " + (data.message || "please try again")
          );
          console.error("Web3Forms:", data);
        }
      })
      .catch(function (err) {
        window.__toast("Network error — please call 1300 265 800");
        console.error(err);
      })
      .then(function () {
        b.innerHTML = label;
        b.disabled = false;
      });
  });
})();

/* toast */
(function () {
  var toast = document.getElementById("toast"),
    tt;
  window.__toast = function (msg) {
    toast.querySelector(".tx").textContent = msg || "Done";
    toast.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  };
})();

/* image sliders (what-we-buy + scrap) */
(function () {
  [].slice
    .call(document.querySelectorAll("[data-slider]"))
    .forEach(function (sl) {
      var track = sl.querySelector(".slides");
      var slides = [].slice.call(sl.querySelectorAll(".slide"));
      var dotsWrap = sl.querySelector("[data-dots]");
      var n = slides.length,
        i = 0,
        timer = null;
      [].slice.call(sl.querySelectorAll("img")).forEach(function (img) {
        img.addEventListener("error", function () {
          img.style.opacity = "0";
        });
      });
      if (n < 2) {
        if (dotsWrap) dotsWrap.style.display = "none";
        var pa = sl.querySelector("[data-prev]"),
          na = sl.querySelector("[data-next]");
        if (pa) pa.style.display = "none";
        if (na) na.style.display = "none";
        return;
      }
      var dots = slides.map(function (_, k) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Show image " + (k + 1) + " of " + n);
        if (k === 0) b.className = "on";
        b.addEventListener("click", function () {
          go(k);
          restart();
        });
        dotsWrap.appendChild(b);
        return b;
      });
      function go(k) {
        i = (k + n) % n;
        track.style.transform = "translateX(-" + i * 100 + "%)";
        dots.forEach(function (d, j) {
          d.classList.toggle("on", j === i);
        });
      }
      var prev = sl.querySelector("[data-prev]"),
        next = sl.querySelector("[data-next]");
      if (prev)
        prev.addEventListener("click", function () {
          go(i - 1);
          restart();
        });
      if (next)
        next.addEventListener("click", function () {
          go(i + 1);
          restart();
        });
      function start() {
        if (!timer)
          timer = setInterval(function () {
            go(i + 1);
          }, 5000);
      }
      function stop() {
        clearInterval(timer);
        timer = null;
      }
      function restart() {
        stop();
        start();
      }
      sl.addEventListener("mouseenter", stop);
      sl.addEventListener("mouseleave", start);
      if (
        !(
          window.matchMedia &&
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
      )
        start();
    });
})();

console.log(
  "%cTop Cash for Cars",
  "font:800 22px Sora,sans-serif;color:#2563EB"
);
