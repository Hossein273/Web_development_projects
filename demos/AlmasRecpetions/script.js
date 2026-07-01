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
  // dropdowns: click toggles on mobile
  [].slice
    .call(document.querySelectorAll(".nav-links>li.has-drop>span"))
    .forEach(function (sp) {
      sp.addEventListener("click", function () {
        if (innerWidth <= 640) {
          sp.parentNode.classList.toggle("open");
        }
      });
    });
  function closeMenu() {
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
        closeMenu();
      }
    });
  });
  window.__closeMenu = closeMenu;
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
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  [].slice.call(document.querySelectorAll(".rv")).forEach(function (e) {
    io.observe(e);
  });
})();

/* HERO background crossfade */
(function () {
  var imgs = [].slice.call(document.querySelectorAll(".hero-bg .slideimg"));
  if (imgs.length < 2) return;
  var i = 0;
  setInterval(function () {
    imgs[i].classList.remove("on");
    i = (i + 1) % imgs.length;
    imgs[i].classList.add("on");
  }, 4500);
})();

/* EXPERIENCES tabs + JOURNEY routing + smart form */
(function () {
  var map = {
    wedding: "Wedding",
    henna: "Henna Night",
    nikah: "Nikah Night",
    birthday: "Birthday",
  };
  function selectExp(key) {
    [].slice.call(document.querySelectorAll(".exp-tab")).forEach(function (t) {
      t.classList.toggle("on", t.dataset.exp === key);
    });
    [].slice
      .call(document.querySelectorAll(".exp-panel"))
      .forEach(function (p) {
        p.classList.toggle("on", p.dataset.exp === key);
      });
    var sel = document.getElementById("eventtype");
    if (sel && map[key]) {
      sel.value = map[key];
    }
  }
  window.__selectExp = selectExp;
  [].slice.call(document.querySelectorAll(".exp-tab")).forEach(function (t) {
    t.addEventListener("click", function () {
      selectExp(t.dataset.exp);
    });
  });
  // hero cards / nav: choose an event and explore it
  [].slice
    .call(document.querySelectorAll("[data-journey]"))
    .forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.dataset.journey;
        selectExp(k);
        if (window.__setBuildEvent && map[k]) window.__setBuildEvent(map[k]);
        var t = document.getElementById("experiences");
        if (t) t.scrollIntoView({ behavior: "smooth" });
      });
    });
  // "Plan your ..." buttons: jump straight to the package builder
  [].slice.call(document.querySelectorAll("[data-plan]")).forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var k = b.dataset.plan;
      selectExp(k);
      if (window.__setBuildEvent && map[k]) window.__setBuildEvent(map[k]);
      var t = document.getElementById("builder");
      if (t) t.scrollIntoView({ behavior: "smooth" });
    });
  });
})();

/* TIMELINE visualizer */
(function () {
  var nodes = [].slice.call(document.querySelectorAll(".tl-node")),
    imgs = [].slice.call(document.querySelectorAll(".tphase")),
    infos = [].slice.call(document.querySelectorAll(".tphase-info"));
  function go(i) {
    nodes.forEach(function (n, k) {
      n.classList.toggle("on", k === i);
    });
    imgs.forEach(function (m, k) {
      m.classList.toggle("on", k === i);
    });
    infos.forEach(function (f, k) {
      f.classList.toggle("on", k === i);
    });
  }
  nodes.forEach(function (n, i) {
    n.addEventListener("click", function () {
      go(i);
    });
  });
  go(0);
})();

/* PACKAGE BUILDER */
(function () {
  var MENU = {
    1: { n: "Level 1 menu", pp: 55 },
    2: { n: "Level 2 menu", pp: 45 },
    3: { n: "Level 3 menu", pp: 40 },
  };
  var FIXED = {
    stage: { n: "Stage decor", amt: 500 },
    fireworks: { n: "Fireworks & dry ice / smoke", amt: 900 },
    welcome: { n: "Welcome sign", amt: 200 },
  };
  var st = {
    evt: "Wedding",
    guests: 200,
    menu: "1",
    add: {
      entree: false,
      lamb: false,
      stage: false,
      fireworks: false,
      welcome: false,
    },
  };
  function money(n) {
    return "$" + Math.round(n).toLocaleString("en-AU");
  }
  var rows = document.getElementById("bsumrows"),
    tot = document.getElementById("bsumtotal"),
    per = document.getElementById("bsumper");
  function entreeIncluded() {
    return st.menu === "1";
  }
  function render() {
    var g = st.guests,
      m = MENU[st.menu],
      total = 0,
      h = "";
    var menuAmt = g * m.pp;
    total += menuAmt;
    h +=
      '<div class="sumrow"><span class="sl">' +
      st.evt +
      " · " +
      m.n +
      "<small>" +
      g +
      " \u00D7 $" +
      m.pp +
      ' / guest</small></span><span class="sv">' +
      money(menuAmt) +
      "</span></div>";
    if (entreeIncluded()) {
      h +=
        '<div class="sumrow"><span class="sl">Entr\u00E9e<small>springrolls &amp; samosa</small></span><span class="sv">Included</span></div>';
    } else if (st.add.entree) {
      var e = g * 2;
      total += e;
      h +=
        '<div class="sumrow"><span class="sl">Entr\u00E9e<small>' +
        g +
        ' \u00D7 $2 / guest</small></span><span class="sv">' +
        money(e) +
        "</span></div>";
    }
    if (st.add.lamb) {
      var l = g * 10;
      total += l;
      h +=
        '<div class="sumrow"><span class="sl">Slow-cooked lamb shanks<small>' +
        g +
        ' \u00D7 $10 / guest</small></span><span class="sv">' +
        money(l) +
        "</span></div>";
    }
    Object.keys(FIXED).forEach(function (k) {
      if (st.add[k]) {
        total += FIXED[k].amt;
        h +=
          '<div class="sumrow"><span class="sl">' +
          FIXED[k].n +
          '<small>flat rate</small></span><span class="sv">' +
          money(FIXED[k].amt) +
          "</span></div>";
      }
    });
    rows.innerHTML = h;
    tot.textContent = money(total);
    per.textContent = "\u2248 " + money(total / g) + " per guest";
  }
  window.__setBuildEvent = function (name) {
    st.evt = name;
    [].slice
      .call(document.querySelectorAll("[data-evt]"))
      .forEach(function (x) {
        x.classList.toggle("on", x.dataset.evt === name);
      });
    render();
  };
  [].slice.call(document.querySelectorAll("[data-evt]")).forEach(function (b) {
    b.addEventListener("click", function () {
      window.__setBuildEvent(b.dataset.evt);
    });
  });
  var sl = document.getElementById("bguests"),
    gv = document.getElementById("bguestval");
  sl.addEventListener("input", function () {
    st.guests = parseInt(sl.value, 10);
    gv.textContent = st.guests;
    render();
  });
  [].slice.call(document.querySelectorAll("[data-menu]")).forEach(function (b) {
    b.addEventListener("click", function () {
      st.menu = b.dataset.menu;
      document.querySelectorAll("[data-menu]").forEach(function (x) {
        x.classList.toggle("on", x === b);
      });
      syncEntree();
      render();
    });
  });
  [].slice.call(document.querySelectorAll("[data-add]")).forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.dataset.add;
      if (k === "entree" && entreeIncluded()) return;
      st.add[k] = !st.add[k];
      b.classList.toggle("on", st.add[k]);
      render();
    });
  });
  function syncEntree() {
    var eb = document.querySelector('[data-add="entree"]');
    if (!eb) return;
    if (entreeIncluded()) {
      eb.classList.add("on");
    } else {
      eb.classList.toggle("on", st.add.entree);
    }
  }
  var rq = document.getElementById("breq");
  if (rq)
    rq.addEventListener("click", function () {
      var sel = document.getElementById("eventtype");
      if (sel) sel.value = st.evt;
      window.__toast("Package ready — send us your enquiry below");
      var t = document.getElementById("contact");
      if (t) t.scrollIntoView({ behavior: "smooth" });
    });
  syncEntree();
  render();
})();

/* MENUS toggle */
(function () {
  var tabs = [].slice.call(document.querySelectorAll(".mtab")),
    panels = [].slice.call(document.querySelectorAll(".menu-panel"));
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) {
        x.classList.remove("on");
      });
      t.classList.add("on");
      panels.forEach(function (p) {
        p.classList.toggle("on", p.id === t.dataset.panel);
      });
    });
  });
})();

/* GALLERY filter */
(function () {
  var chips = [].slice.call(document.querySelectorAll(".gchip")),
    items = [].slice.call(document.querySelectorAll(".gal[data-cat]"));
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      chips.forEach(function (x) {
        x.classList.remove("on");
      });
      c.classList.add("on");
      var f = c.dataset.filter;
      items.forEach(function (it) {
        it.classList.toggle(
          "hide",
          !(f === "all" || it.dataset.cat.indexOf(f) > -1)
        );
      });
    });
  });
})();

/* CONTACT form -> Web3Forms */
(function () {
  var f = document.getElementById("enqform"),
    ok = document.getElementById("formok"),
    b = document.getElementById("sendbtn");
  if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!f.reportValidity()) return;
    var label = b.innerHTML;
    b.innerHTML = "Sending…";
    b.disabled = true;
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(f),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data.success) {
          ok.classList.add("on");
          f.reset();
        } else {
          window.__toast &&
            window.__toast(
              "Couldn\u2019t send — " + (data.message || "please try again")
            );
          console.error("Web3Forms:", data);
        }
      })
      .catch(function (err) {
        window.__toast &&
          window.__toast("Network error — please call 1300 854 551");
        console.error(err);
      })
      .then(function () {
        b.innerHTML = label;
        b.disabled = false;
      });
  });
})();

/* STICKY book button */
(function () {
  var sb = document.getElementById("stickybook"),
    contact = document.getElementById("contact");
  if (!sb) return;
  addEventListener(
    "scroll",
    function () {
      var past = scrollY > innerHeight * 0.7;
      var nearC = contact && scrollY + innerHeight > contact.offsetTop + 120;
      sb.classList.toggle("show", past && !nearC);
    },
    { passive: true }
  );
})();

/* TOAST */
(function () {
  var toast = document.getElementById("toast"),
    tt;
  window.__toast = function (msg) {
    toast.querySelector(".tx").textContent = msg || "Saved";
    toast.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  };
})();
console.log(
  "%cAlmas Receptions",
  "font:600 22px Playfair Display,serif;color:#C2A04C"
);
