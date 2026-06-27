/* ============================================================
   Charcoal & Crust — interaction logic only.
   Menu content now lives in index.html (static cards).
   Each "Add" button carries: data-id, data-name, data-price.
   ============================================================ */

/* ===================== STATE ===================== */
var cart = {}; /* id -> { n: name, p: price, q: qty } */
var mode = "takeaway"; /* 'dinein' | 'takeaway' */

function money(n) {
  return "$" + n.toFixed(2);
}

/* ===================== MENU TABS ===================== */
var tabs = document.getElementById("tabs");
var cats = document.getElementById("cats");

tabs.addEventListener("click", function (e) {
  var b = e.target.closest(".tab");
  if (!b) return;
  document.querySelectorAll(".tab").forEach(function (x) {
    x.classList.toggle("on", x === b);
  });
  document.querySelectorAll(".cat").forEach(function (x) {
    x.classList.toggle("on", x.id === "cat-" + b.dataset.cat);
  });
});

/* ===================== ADD TO CART ===================== */
/* Reads name + price straight off the button's data-* attributes,
   so the script never needs its own copy of the menu. */
cats.addEventListener("click", function (e) {
  var b = e.target.closest(".card-add");
  if (!b) return;
  addToCart(b.dataset.id, b.dataset.name, parseFloat(b.dataset.price));
  b.classList.add("added");
  b.innerHTML = '<span class="ic">✓</span> Added';
  setTimeout(function () {
    b.classList.remove("added");
    b.innerHTML = '<span class="ic">+</span> Add';
  }, 900);
});

function addToCart(id, name, price) {
  if (!cart[id]) cart[id] = { n: name, p: price, q: 0 };
  cart[id].q++;
  updateCart();
  toast(name + " added");
}
function setQty(id, d) {
  if (!cart[id]) return;
  cart[id].q += d;
  if (cart[id].q <= 0) delete cart[id];
  updateCart();
}
function cartCount() {
  var n = 0;
  for (var k in cart) n += cart[k].q;
  return n;
}
function cartTotal() {
  var t = 0;
  for (var k in cart) t += cart[k].p * cart[k].q;
  return t;
}

function updateCart() {
  var n = cartCount();
  document.getElementById("cc").textContent = n;
  document.getElementById("cc2").textContent = n;
  renderCartPanel();
}
function renderCartPanel() {
  var list = document.getElementById("cartList"),
    foot = document.getElementById("cartFoot");
  var ids = Object.keys(cart);
  if (!ids.length) {
    list.innerHTML =
      '<div class="cart-empty"><div class="em-ic">🔥</div><b>Your order is empty</b><div style="margin-top:6px;font-size:.86rem">Add something from the menu to get started.</div></div>';
    foot.innerHTML = "";
    return;
  }
  var html = "";
  ids.forEach(function (id) {
    var it = cart[id];
    html +=
      '<div class="cline"><div class="cline-main"><div class="cline-name">' +
      it.n +
      '</div><div class="cline-price">$' +
      it.p +
      " each</div></div>" +
      '<div class="qty"><button data-dec="' +
      id +
      '">−</button><span>' +
      it.q +
      '</span><button data-inc="' +
      id +
      '">+</button></div>' +
      '<div class="cline-sub">' +
      money(it.p * it.q) +
      "</div></div>";
  });
  list.innerHTML = html;
  var total = cartTotal(),
    gst = total * GST_RATE;
  foot.innerHTML =
    '<div class="tot-row"><span>Subtotal</span><span>' +
    money(total - gst) +
    "</span></div>" +
    '<div class="tot-row"><span>GST (incl.)</span><span>' +
    money(gst) +
    "</span></div>" +
    '<div class="tot-row big"><span>Total</span><span>' +
    money(total) +
    "</span></div>" +
    '<button class="btn btn-ember btn-block btn-lg" id="toPay" style="margin-top:14px">Checkout · ' +
    money(total) +
    "</button>";
  document.getElementById("toPay").addEventListener("click", goPay);
  syncModeButtons();
}
document.getElementById("cartList").addEventListener("click", function (e) {
  var inc = e.target.closest("[data-inc]"),
    dec = e.target.closest("[data-dec]");
  if (inc) setQty(inc.dataset.inc, 1);
  if (dec) setQty(dec.dataset.dec, -1);
});

/* ===================== GST ===================== */
var GST_RATE = 1 / 11; /* AU prices are GST-inclusive */

/* ===================== MODE ===================== */
function setMode(m) {
  mode = m;
  syncModeButtons();
  var mh = document.getElementById("modeHint");
  mh.textContent =
    m === "dinein"
      ? "We'll bring it to your table"
      : "Ready for pickup at the counter";
}
function syncModeButtons() {
  document
    .querySelectorAll("#dwMode button,#modeSeg button")
    .forEach(function (b) {
      b.classList.toggle("on", b.dataset.mode === mode);
    });
}
document.querySelectorAll("[data-mode]").forEach(function (b) {
  b.addEventListener("click", function () {
    setMode(b.dataset.mode);
    /* hero + find buttons also jump to the menu and reveal the mode banner */
    if (b.classList.contains("order-btn") || b.tagName === "A") {
      document.getElementById("modebar").classList.add("show");
      document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ===================== DRAWER ===================== */
var drawer = document.getElementById("drawer"),
  scrim = document.getElementById("scrim");
function openDrawer() {
  drawer.classList.add("on");
  scrim.classList.add("on");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  drawer.classList.remove("on");
  scrim.classList.remove("on");
  document.body.style.overflow = "";
}
function showPanel(p) {
  ["pCart", "pPay", "pDone"].forEach(function (id) {
    document.getElementById(id).classList.toggle("on", id === p);
  });
}
document.getElementById("cartBtn").addEventListener("click", function () {
  showPanel("pCart");
  document.getElementById("dwTitle").textContent = "Your order";
  openDrawer();
});
document.getElementById("mobarOrder").addEventListener("click", function () {
  showPanel("pCart");
  document.getElementById("dwTitle").textContent = "Your order";
  openDrawer();
});
document.getElementById("dwClose").addEventListener("click", closeDrawer);
scrim.addEventListener("click", closeDrawer);

/* ===================== CHECKOUT ===================== */
var payMethod = "card";
function setPayMethod(m) {
  payMethod = m;
  document.querySelectorAll("#payMethods .pm").forEach(function (b) {
    b.classList.toggle("on", b.dataset.pm === m);
  });
  var wallet = m !== "card";
  document.getElementById("cardFields").style.display = wallet
    ? "none"
    : "block";
  document.getElementById("walletNote").style.display = wallet
    ? "block"
    : "none";
  document.getElementById("payBtn").textContent =
    m === "apple"
      ? " Pay"
      : m === "google"
      ? "Pay with Google Pay"
      : "Pay & place order";
}
document.getElementById("payMethods").addEventListener("click", function (e) {
  var b = e.target.closest(".pm");
  if (b) setPayMethod(b.dataset.pm);
});

function goPay() {
  if (!cartCount()) return;
  document.getElementById("dwTitle").textContent =
    mode === "dinein" ? "Reserve & pay" : "Checkout";
  document.getElementById("resvFld").style.display =
    mode === "dinein" ? "block" : "none";
  if (mode === "dinein") {
    /* prefill today + next half hour */
    var d = document.getElementById("fDate"),
      t = document.getElementById("fTime"),
      now = new Date();
    if (!d.value)
      d.value =
        now.getFullYear() +
        "-" +
        ("0" + (now.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + now.getDate()).slice(-2);
    if (!t.value) {
      now.setMinutes(now.getMinutes() + 30);
      t.value =
        ("0" + now.getHours()).slice(-2) +
        ":" +
        ("0" + now.getMinutes()).slice(-2);
    }
  }
  setPayMethod(payMethod);
  showPanel("pPay");
}
document.getElementById("backToCart").addEventListener("click", function () {
  document.getElementById("dwTitle").textContent = "Your order";
  showPanel("pCart");
});

document.getElementById("payBtn").addEventListener("click", function () {
  var name = document.getElementById("fName").value.trim();
  var phone = document.getElementById("fPhone").value.trim();
  if (mode === "dinein") {
    if (!document.getElementById("fDate").value) {
      toast("Pick your arrival date");
      return;
    }
    if (!document.getElementById("fTime").value) {
      toast("Pick your arrival time");
      return;
    }
  }
  if (!name) {
    toast("Add your name");
    return;
  }
  if (!phone) {
    toast("Add a mobile number");
    return;
  }
  if (
    payMethod === "card" &&
    document.getElementById("fCard").value.replace(/\s/g, "").length < 12
  ) {
    toast("Enter a card number (demo: 4242…)");
    return;
  }
  var btn = this;
  btn.textContent = payMethod === "card" ? "Processing…" : "Confirming…";
  btn.disabled = true;
  setTimeout(function () {
    btn.disabled = false;
    placeOrder(name);
  }, 900);
});

function placeOrder(name) {
  var ref = "CC-" + Math.floor(1000 + Math.random() * 9000);
  var now = new Date();
  var total = cartTotal(),
    gst = total * GST_RATE;
  var methodLabel = document.querySelector("#payMethods .pm.on").dataset.label;
  var resv = null,
    modeLine;
  if (mode === "dinein") {
    var dv = document.getElementById("fDate").value,
      tv = document.getElementById("fTime").value,
      gv = document.getElementById("fGuests").value;
    var dt = dv ? new Date(dv + "T" + (tv || "00:00")) : now;
    resv = {
      date: dt.toLocaleDateString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      time: tv
        ? dt.toLocaleTimeString("en-AU", {
            hour: "numeric",
            minute: "2-digit",
          })
        : "—",
      guests: gv,
    };
    modeLine = "DINE IN · TABLE FOR " + gv;
  } else {
    modeLine = "TAKEAWAY · PICKUP";
  }
  var lines = "";
  Object.keys(cart).forEach(function (id) {
    var it = cart[id];
    lines +=
      '<div class="tk-line"><span><span class="q">' +
      it.q +
      "×</span> " +
      it.n +
      "</span><span>" +
      money(it.p * it.q) +
      "</span></div>";
  });
  var html =
    '<div class="tk-h"><div class="nm">Charcoal &amp; Crust</div><div class="ad">180 Boundary St · West End · (07) 3055 0180</div></div>' +
    '<div class="tk-meta"><span>Order ' +
    ref +
    "</span><span>" +
    now.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
    }) +
    "</span></div>" +
    '<div class="tk-meta"><span>' +
    (name ? name : "Guest") +
    "</span><span>" +
    now.toLocaleDateString("en-AU") +
    "</span></div>" +
    '<div class="tk-mode">' +
    modeLine +
    "</div>" +
    (resv
      ? '<div class="tk-meta"><span>Booked for</span><span>' +
        resv.date +
        " · " +
        resv.time +
        '</span></div><div class="tk-meta"><span>Guests</span><span>' +
        resv.guests +
        "</span></div>"
      : "") +
    '<div class="tk-sep"></div>' +
    lines +
    '<div class="tk-sep"></div>' +
    '<div class="tk-line"><span>Subtotal</span><span>' +
    money(total - gst) +
    "</span></div>" +
    '<div class="tk-line"><span>GST (incl.)</span><span>' +
    money(gst) +
    "</span></div>" +
    '<div class="tk-tot"><span>TOTAL</span><span>' +
    money(total) +
    "</span></div>" +
    '<div class="tk-paid">✓ PAID — ' +
    methodLabel +
    "</div>";
  document.getElementById("ticket").innerHTML = html;
  document.getElementById("dwTitle").textContent =
    mode === "dinein" ? "Table booked" : "Order confirmed";
  var etaL = document.getElementById("etaL"),
    etaT = document.getElementById("etaT"),
    etaD = document.getElementById("etaD"),
    eta = document.getElementById("eta");
  clearInterval(cdTimer);
  eta.classList.remove("ready");
  if (mode === "dinein") {
    eta.classList.add("ready");
    etaL.textContent = "Your table is booked for";
    etaT.style.fontSize = "3rem";
    etaT.textContent = resv.time;
    etaD.textContent =
      "See you " +
      resv.date +
      " — come in, grab any free table, and we'll fire your order fresh for your arrival.";
  } else {
    etaL.textContent = "Your order will be ready in";
    etaT.style.fontSize = "";
    startCountdown();
  }
  showPanel("pDone");
}

/* ===================== READY COUNTDOWN (takeaway) ===================== */
var cdTimer = null;
function startCountdown() {
  clearInterval(cdTimer);
  var mins = 7 + Math.floor(Math.random() * 4); /* 7–10 minutes */
  var end = Date.now() + mins * 60 * 1000;
  var etaT = document.getElementById("etaT"),
    etaD = document.getElementById("etaD"),
    eta = document.getElementById("eta");
  eta.classList.remove("ready");
  etaD.textContent = "Hang tight — the grill's already fired up.";
  function tick() {
    var left = Math.max(0, Math.round((end - Date.now()) / 1000));
    var m = Math.floor(left / 60),
      s = left % 60;
    etaT.textContent = m + ":" + (s < 10 ? "0" : "") + s;
    if (left <= 0) {
      clearInterval(cdTimer);
      etaT.textContent = "Ready!";
      etaD.textContent = "Come up to the counter — it's hot and ready.";
      eta.classList.add("ready");
    }
  }
  tick();
  cdTimer = setInterval(tick, 1000);
}
document.getElementById("newOrder").addEventListener("click", function () {
  cart = {};
  updateCart();
  clearInterval(cdTimer);
  ["fName", "fPhone", "fCard", "fExp", "fCvc", "fDate", "fTime"].forEach(
    function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    }
  );
  document.getElementById("fGuests").value = "2";
  document.getElementById("etaT").style.fontSize = "";
  setPayMethod("card");
  document.getElementById("dwTitle").textContent = "Your order";
  showPanel("pCart");
});

/* ===================== MISC UI ===================== */
var nav = document.getElementById("nav");
addEventListener(
  "scroll",
  function () {
    nav.classList.toggle("solid", scrollY > 40);
  },
  { passive: true }
);
var burger = document.getElementById("burger"),
  navlinks = document.getElementById("navlinks");
burger.addEventListener("click", function () {
  navlinks.classList.toggle("open");
});
document.querySelectorAll('#navlinks a[href^="#"]').forEach(function (a) {
  a.addEventListener("click", function () {
    navlinks.classList.remove("open");
  });
});

var toastEl = document.getElementById("toast"),
  toastT;
function toast(msg) {
  toastEl.querySelector(".tx").textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(function () {
    toastEl.classList.remove("show");
  }, 2200);
}

/* reveal on scroll */
var io = new IntersectionObserver(
  function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".rv").forEach(function (e) {
  io.observe(e);
});

/* if hero video fails, the poster image already shows underneath */
var hv = document.querySelector(".hero-video");
if (hv) {
  hv.addEventListener("error", function () {
    hv.style.display = "none";
  });
  hv.querySelector("source").addEventListener("error", function () {
    hv.style.display = "none";
  });
}

/* ===================== INIT ===================== */
updateCart();
setMode("takeaway");
console.log(
  "%cCHARCOAL & CRUST",
  "font:400 26px Bebas Neue,sans-serif;color:#FF6A2B"
);
