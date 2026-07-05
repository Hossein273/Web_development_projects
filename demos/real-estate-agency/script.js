/* =========================================================
   ⚠️  ADD YOUR WEB3FORMS ACCESS KEY HERE — THE ONLY EDIT NEEDED
   Free key (30 sec) at https://web3forms.com — paste between the quotes.
   Powers every form: property enquiry, valuation, contact, newsletter.
   ========================================================= */
var WEB3FORMS_ACCESS_KEY = "";

/* --- LISTINGS NOTE ----------------------------------------
   All listing cards, their images and their modal galleries are
   hardcoded in index.html (each <article class="card"> carries its
   data in data-* attributes, including data-img with the gallery
   paths). This script only reads the DOM — it renders no content
   and references no image URLs. To go live, swap the static cards
   for your CRM/IDX output in the same shape; lead forms post to
   Web3Forms.
   ---------------------------------------------------------- */

/* suburb medians — used only by the valuation calculator */
var MED = {
  Paddington: 1650000,
  "New Farm": 1700000,
  Bulimba: 1950000,
  Ascot: 2100000,
  Hawthorne: 1600000,
  Teneriffe: 1550000,
  Coorparoo: 1250000,
  Hamilton: 2500000,
  Wilston: 1500000,
  Other: 1300000,
};

function money(n) {
  return "$" + Math.round(n).toLocaleString("en-AU");
}
function val(id) {
  return document.getElementById(id).value;
}
function sendToWeb3Forms(fd) {
  fd.set("access_key", WEB3FORMS_ACCESS_KEY);
  return fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: fd,
  }).then(function (r) {
    return r.json();
  });
}

/* ---- favourites (in-memory) ---- */
var fav = new Set();

/* ---- filter + sort + paginate the static cards ---- */
var grid = document.getElementById("grid"),
  fcount = document.getElementById("fcount"),
  loadmore = document.getElementById("loadmore");
var allCards = [].slice.call(grid.querySelectorAll(".card"));
var PAGE = 6,
  shown = PAGE,
  matched = [],
  emptyEl = null;

function byNum(key, dir) {
  return function (a, b) {
    return (+a.dataset[key] - +b.dataset[key]) * dir;
  };
}
function applyFilters() {
  var sub = val("f-suburb"),
    ty = val("f-type"),
    bd = +val("f-beds"),
    ba = +val("f-baths"),
    mn = +val("f-min"),
    mx = +val("f-max"),
    sort = val("f-sort");
  matched = allCards.filter(function (c) {
    var d = c.dataset;
    if (sub && d.sub !== sub) return false;
    if (ty && d.type !== ty) return false;
    if (bd && +d.bed < bd) return false;
    if (ba && +d.bath < ba) return false;
    if (mn && +d.price < mn) return false;
    if (mx && +d.price > mx) return false;
    return true;
  });
  var nonmatched = allCards.filter(function (c) {
    return matched.indexOf(c) < 0;
  });
  if (sort === "lo") matched.sort(byNum("price", 1));
  else if (sort === "hi") matched.sort(byNum("price", -1));
  else if (sort === "bed") matched.sort(byNum("bed", -1));
  else matched.sort(byNum("order", 1)); // Featured
  // reorder DOM so matched cards come first, in sorted order
  matched.concat(nonmatched).forEach(function (c) {
    grid.appendChild(c);
  });
  fcount.textContent =
    matched.length + (matched.length === 1 ? " home" : " homes");
  shown = PAGE;
  render();
}
function render() {
  allCards.forEach(function (c) {
    c.style.display = "none";
  });
  if (emptyEl) {
    emptyEl.remove();
    emptyEl = null;
  }
  if (!matched.length) {
    emptyEl = document.createElement("div");
    emptyEl.className = "empty";
    emptyEl.innerHTML =
      "<b>No homes match those filters</b>Try widening your price range or suburb — or reset to see everything.";
    grid.appendChild(emptyEl);
    loadmore.style.display = "none";
    return;
  }
  matched.slice(0, shown).forEach(function (c) {
    c.style.display = "";
  });
  var remaining = matched.length - shown;
  if (remaining > 0) {
    loadmore.style.display = "";
    loadmore.textContent = "Load more homes (" + remaining + " more)";
  } else loadmore.style.display = "none";
}
loadmore.addEventListener("click", function () {
  shown += PAGE;
  render();
});
["f-suburb", "f-type", "f-beds", "f-baths", "f-min", "f-max", "f-sort"].forEach(
  function (id) {
    document.getElementById(id).addEventListener("change", applyFilters);
  }
);
document.getElementById("freset").addEventListener("click", function () {
  ["f-suburb", "f-type", "f-beds", "f-baths", "f-min", "f-max"].forEach(
    function (id) {
      document.getElementById(id).selectedIndex = 0;
    }
  );
  document.getElementById("f-sort").value = "feat";
  applyFilters();
});
document.getElementById("h-go").addEventListener("click", function () {
  document.getElementById("f-suburb").value = val("h-suburb");
  document.getElementById("f-type").value = val("h-type");
  applyFilters();
  document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
});
applyFilters();

/* ---- card interactions (event delegation) ---- */
grid.addEventListener("click", function (e) {
  var card = e.target.closest(".card");
  if (!card) return;
  if (e.target.closest("[data-fav]")) {
    e.stopPropagation();
    var id = card.dataset.id,
      on = fav.has(id);
    if (on) fav.delete(id);
    else fav.add(id);
    var b = e.target.closest("[data-fav]");
    b.classList.toggle("on", !on);
    b.textContent = on ? "\u2661" : "\u2665";
    window.__toast(on ? "Removed from saved" : "Saved to your shortlist");
    return;
  }
  openModal(card);
});

/* ---- property modal (reads the card's data-* attributes) ---- */
var modal = document.getElementById("pmodal");
function openModal(card) {
  var d = card.dataset;
  var imgs = d.img.split(",");
  var feat = d.feat.split("|");
  document.getElementById("mprice").textContent = money(+d.price);
  document.getElementById("maddr").textContent = d.addr;
  document.getElementById("msub").textContent =
    d.sub + ", QLD \u00B7 " + d.type;
  document.getElementById("mspec").innerHTML =
    '<div class="ms"><span>' +
    d.bed +
    '</span><small>Beds</small></div><div class="ms"><span>' +
    d.bath +
    '</span><small>Baths</small></div><div class="ms"><span>' +
    d.car +
    '</span><small>Car</small></div><div class="ms"><span>' +
    d.land +
    "</span><small>m\u00B2 land</small></div>";
  document.getElementById("mdesc").textContent = d.desc;
  document.getElementById("mfeat").innerHTML = feat
    .map(function (f) {
      return "<li>" + f + "</li>";
    })
    .join("");
  document.getElementById("magent").innerHTML =
    '<div class="av"><img src="' +
    d.agentPhoto +
    '" alt="' +
    d.agentName +
    '"></div><div><b>' +
    d.agentName +
    "</b><span>" +
    d.agentRole +
    "</span></div>";
  document.getElementById("mprop").value =
    d.addr + ", " + d.sub + " (" + money(+d.price) + ")";
  document.querySelector("#mform [name=subject]").value =
    "Property enquiry: " + d.addr + ", " + d.sub;
  var thumbs = document.getElementById("mhthumbs"),
    mainimg = document.getElementById("mhimg");
  mainimg.src = imgs[0];
  mainimg.alt = d.addr;
  thumbs.innerHTML = imgs
    .map(function (src, i) {
      return (
        '<button data-i="' +
        i +
        '" class="' +
        (i === 0 ? "on" : "") +
        '"><img src="' +
        src +
        '" alt=""></button>'
      );
    })
    .join("");
  thumbs.querySelectorAll("button").forEach(function (b) {
    b.addEventListener("click", function () {
      mainimg.src = imgs[+b.dataset.i];
      thumbs.querySelectorAll("button").forEach(function (x) {
        x.classList.remove("on");
      });
      b.classList.add("on");
    });
  });
  document.getElementById("mform").style.display = "";
  document.getElementById("mok").classList.remove("on");
  modal.classList.add("on");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.remove("on");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
modal.addEventListener("click", function (e) {
  if (e.target.matches("[data-close]")) closeModal();
  if (e.target.closest("[data-demo]"))
    window.__toast("Demo \u2014 your 3D tour / video embeds here");
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && modal.classList.contains("on")) closeModal();
});

/* ---- forms -> Web3Forms (property, contact, newsletter) ---- */
function wireForm(formId, okId, btnId, phone) {
  var f = document.getElementById(formId),
    ok = document.getElementById(okId),
    b = document.getElementById(btnId);
  if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!f.reportValidity()) return;
    if (!WEB3FORMS_ACCESS_KEY) {
      window.__toast("Add your Web3Forms access key in the script");
      return;
    }
    var lab = b.innerHTML;
    b.innerHTML = "Sending\u2026";
    b.disabled = true;
    sendToWeb3Forms(new FormData(f))
      .then(function (d) {
        if (d.success) {
          f.style.display = "none";
          ok.classList.add("on");
        } else {
          window.__toast(
            "Couldn\u2019t send \u2014 " + (d.message || "try again")
          );
          console.error(d);
        }
      })
      .catch(function (err) {
        window.__toast(
          "Network error \u2014 please call " + (phone || "07 3000 0000")
        );
        console.error(err);
      })
      .then(function () {
        b.innerHTML = lab;
        b.disabled = false;
      });
  });
}
wireForm("mform", "mok", "msend");
wireForm("ctform", "ctok", "ctsend");
/* newsletter: inline success toast instead of panel swap */
(function () {
  var f = document.getElementById("newsform"),
    b = document.getElementById("newssend");
  if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!f.reportValidity()) return;
    if (!WEB3FORMS_ACCESS_KEY) {
      window.__toast("Add your Web3Forms access key in the script");
      return;
    }
    var lab = b.innerHTML;
    b.innerHTML = "\u2026";
    b.disabled = true;
    sendToWeb3Forms(new FormData(f))
      .then(function (d) {
        if (d.success) {
          f.reset();
          window.__toast("You\u2019re subscribed \u2713");
        } else {
          window.__toast("Couldn\u2019t subscribe \u2014 try again");
        }
      })
      .catch(function () {
        window.__toast("Network error \u2014 try again");
      })
      .then(function () {
        b.innerHTML = lab;
        b.disabled = false;
      });
  });
})();

/* ---- valuation widget ---- */
(function () {
  var st = { cond: 1.12 },
    step = 1;
  function show(n) {
    step = n;
    [].slice.call(document.querySelectorAll(".vstep")).forEach(function (s) {
      s.classList.toggle("on", +s.dataset.vstep === n);
    });
  }
  [].slice.call(document.querySelectorAll("[data-cond]")).forEach(function (b) {
    b.addEventListener("click", function () {
      [].slice
        .call(document.querySelectorAll("[data-cond]"))
        .forEach(function (x) {
          x.classList.remove("on");
        });
      b.classList.add("on");
      st.cond = +b.dataset.cond;
    });
  });
  function estimate() {
    var sub = document.getElementById("v-suburb").value,
      ty = document.getElementById("v-type").value,
      bd = +document.getElementById("v-beds").value,
      med = MED[sub] || MED.Other;
    var tf = ty === "house" ? 1 : ty === "town" ? 0.72 : 0.6;
    var bf = { 2: 0.78, 3: 0.9, 4: 1, 5: 1.14 }[bd] || 1;
    var mid = med * tf * bf * st.cond;
    var lo = Math.round((mid * 0.92) / 10000) * 10000,
      hi = Math.round((mid * 1.08) / 10000) * 10000;
    return { lo: lo, hi: hi, sub: sub, bd: bd, ty: ty };
  }
  document.querySelectorAll("[data-vnext]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (step === 1) {
        show(2);
      } else if (step === 2) {
        var e = estimate();
        document.getElementById("v-range").textContent =
          money(e.lo) + " \u2013 " + money(e.hi);
        document.getElementById("v-vehicle").textContent =
          "Estimate for a " +
          e.bd +
          "-bed " +
          (e.ty === "house"
            ? "house"
            : e.ty === "town"
            ? "townhouse"
            : "apartment") +
          " in " +
          e.sub;
        show(3);
      }
    });
  });
  document.querySelectorAll("[data-vback]").forEach(function (b) {
    b.addEventListener("click", function () {
      show(Math.max(1, step - 1));
    });
  });
  var lock = document.getElementById("v-lock");
  lock.addEventListener("click", function () {
    var n = document.getElementById("v-name").value.trim(),
      ph = document.getElementById("v-phone").value.trim();
    if (!n || !ph) {
      window.__toast("Please add your name & phone");
      return;
    }
    if (!WEB3FORMS_ACCESS_KEY) {
      window.__toast("Add your Web3Forms access key in the script");
      return;
    }
    var e = estimate(),
      fd = new FormData();
    fd.append("subject", "Home valuation lead — Meridian Property");
    fd.append("from_name", "Meridian Property website");
    fd.append("name", n);
    fd.append("phone", ph);
    fd.append(
      "address",
      document.getElementById("v-addr").value || "(not given)"
    );
    fd.append("suburb", e.sub);
    fd.append("property_type", e.ty);
    fd.append("bedrooms", e.bd);
    fd.append("estimated_range", money(e.lo) + " – " + money(e.hi));
    var lab = lock.innerHTML;
    lock.innerHTML = "Sending\u2026";
    lock.disabled = true;
    sendToWeb3Forms(fd)
      .then(function (d) {
        if (d.success) {
          document.querySelector('[data-vstep="3"] .vest').style.display =
            "none";
          document.getElementById("v-lock").style.display = "none";
          document.getElementById("v-name").style.display = "none";
          document.getElementById("v-phone").style.display = "none";
          document.querySelector('[data-vstep="3"] .vnote').style.display =
            "none";
          document.getElementById("vok").classList.add("on");
          window.__toast("Report on its way \u2713");
        } else {
          window.__toast(
            "Couldn\u2019t send \u2014 " + (d.message || "try again")
          );
          lock.innerHTML = lab;
          lock.disabled = false;
        }
      })
      .catch(function (err) {
        window.__toast("Network error \u2014 please call 07 3000 0000");
        console.error(err);
        lock.innerHTML = lab;
        lock.disabled = false;
      });
  });
})();

/* ---- mortgage calculator ---- */
(function () {
  var price = document.getElementById("c-price"),
    dep = document.getElementById("c-dep"),
    rate = document.getElementById("c-rate"),
    term = document.getElementById("c-term");
  function calc() {
    var P = +price.value,
      dp = +dep.value,
      r = +rate.value,
      t = +term.value;
    var loan = P * (1 - dp / 100),
      mr = r / 100 / 12,
      n = t * 12;
    var monthly = mr > 0 ? (loan * mr) / (1 - Math.pow(1 + mr, -n)) : loan / n;
    var totalInt = monthly * n - loan;
    document.getElementById("c-price-v").textContent = money(P);
    document.getElementById("c-dep-v").textContent =
      money((P * dp) / 100) + " \u00B7 " + dp + "%";
    document.getElementById("c-rate-v").textContent = r.toFixed(1) + "%";
    document.getElementById("c-term-v").textContent = t + " years";
    document.getElementById("c-monthly").textContent = money(monthly) + "/mo";
    document.getElementById("c-loan").textContent = money(loan);
    document.getElementById("c-interest").textContent = money(totalInt);
  }
  [price, dep, rate, term].forEach(function (el) {
    el.addEventListener("input", calc);
  });
  calc();
})();

/* ---- nav, mobile, reveal, count-up, toast ---- */
(function () {
  var nav = document.getElementById("nav"),
    burger = document.getElementById("burger"),
    links = document.getElementById("navlinks");
  var secs = [].slice.call(document.querySelectorAll("section[id],header[id]")),
    navas = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
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
  });
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var t = document.querySelector(a.getAttribute("href"));
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
        burger.classList.remove("open");
        links.classList.remove("open");
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
(function () {
  var done = false,
    strip = document.querySelector(".stats");
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
          el.textContent =
            pre +
            Math.floor((1 - Math.pow(1 - p, 3)) * to).toLocaleString("en-AU") +
            suf;
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
(function () {
  var toast = document.getElementById("toast"),
    tt;
  window.__toast = function (m) {
    toast.querySelector(".tx").textContent = m || "Done";
    toast.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  };
})();
console.log(
  "%cMeridian Property Co.",
  "font:600 22px Fraunces,serif;color:#1F3D34"
);
