/* =========================================================
   ⚠️  ADD YOUR WEB3FORMS ACCESS KEY HERE — THE ONLY EDIT NEEDED
   Free key (30 sec) at https://web3forms.com — paste between the quotes.
   Powers every form: property enquiry, valuation, contact, newsletter.
   ========================================================= */
var WEB3FORMS_ACCESS_KEY = "";

/* --- CRM / IDX NOTE ---------------------------------------
Listings below are a static demo array. To go live, replace
this array with a feed from your CRM / portal (AgentBox, Rex,
LockedOn, or an IDX/MLS feed) — fetch it and map to the same
shape. Lead forms post to Web3Forms; add a Web3Forms webhook
(Pro) or a serverless function to push leads into your CRM too.
---------------------------------------------------------- */
var AGENTS = [
  {
    in: "DW",
    name: "Daniel Whitmore",
    role: "Principal & Auctioneer",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    in: "PS",
    name: "Priya Sharma",
    role: "Senior Sales Agent",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    in: "TC",
    name: "Tom Callahan",
    role: "Sales Associate",
    photo: "https://randomuser.me/api/portraits/men/52.jpg",
  },
];
var LISTINGS = [
  {
    id: "P01",
    addr: "24 Latrobe Terrace",
    sub: "Paddington",
    type: "House",
    price: 1650000,
    bed: 4,
    bath: 2,
    car: 2,
    land: 405,
    tag: ["3D Tour", "Auction"],
    ag: 0,
    img: [19344325, 5179534, 6035357],
    feat: [
      "Renovated Queenslander",
      "Stone chef\u2019s kitchen",
      "North-facing deck",
      "Pool & lush garden",
    ],
    desc: "A classic Paddington character home reimagined for modern family life \u2014 soaring VJ ceilings, a stone chef\u2019s kitchen and a north-facing deck overlooking the pool.",
  },
  {
    id: "N02",
    addr: "8/15 Welsby Street",
    sub: "New Farm",
    type: "Apartment",
    price: 895000,
    bed: 2,
    bath: 2,
    car: 1,
    land: 110,
    tag: ["Video"],
    ag: 1,
    img: [18423197, 28991200, 4857757],
    feat: [
      "Riverside precinct",
      "Secure parking",
      "Wrap-around balcony",
      "Walk to Powerhouse",
    ],
    desc: "A light-filled two-bedroom apartment moments from New Farm Park and the Powerhouse, with a wrap-around balcony and secure basement parking.",
  },
  {
    id: "B03",
    addr: "12 Quay Street",
    sub: "Bulimba",
    type: "House",
    price: 2250000,
    bed: 5,
    bath: 3,
    car: 2,
    land: 612,
    tag: ["3D Tour"],
    ag: 0,
    img: [323780, 1643383, 10168692],
    feat: [
      "Walk to Oxford St",
      "Resort-style pool",
      "Dedicated home office",
      "CityCat to CBD",
    ],
    desc: "An elegant family residence a short stroll from Oxford Street and the CityCat \u2014 five bedrooms, a resort-style pool and a dedicated home office.",
  },
  {
    id: "A04",
    addr: "47 Lansdowne Street",
    sub: "Ascot",
    type: "House",
    price: 1980000,
    bed: 4,
    bath: 3,
    car: 2,
    land: 506,
    tag: ["Just listed"],
    ag: 2,
    img: [33213827, 5179534, 1643383],
    feat: [
      "Tightly held street",
      "Soaring ceilings",
      "Butler\u2019s pantry",
      "Leafy outlook",
    ],
    desc: "Set in one of Ascot\u2019s most tightly held streets, this refined four-bedroom home pairs soaring ceilings with a butler\u2019s pantry and a private, leafy outlook.",
  },
  {
    id: "H05",
    addr: "3 Riverview Terrace",
    sub: "Hawthorne",
    type: "House",
    price: 1420000,
    bed: 3,
    bath: 2,
    car: 2,
    land: 380,
    tag: ["Video"],
    ag: 1,
    img: [7031581, 4857757, 6035357],
    feat: [
      "Quiet terrace",
      "Open-plan living",
      "Covered alfresco",
      "Near Hawthorne ferry",
    ],
    desc: "A move-in-ready three-bedroom home on a quiet Hawthorne terrace \u2014 open-plan living flows to a covered alfresco, minutes from the ferry and cafes.",
  },
  {
    id: "T06",
    addr: "102/60 Riverwalk Avenue",
    sub: "Teneriffe",
    type: "Apartment",
    price: 1150000,
    bed: 2,
    bath: 2,
    car: 1,
    land: 128,
    tag: ["3D Tour"],
    ag: 2,
    img: [16631149, 28991200, 10168692],
    feat: [
      "River views",
      "Concierge building",
      "Floor-to-ceiling glass",
      "Entertainer\u2019s terrace",
    ],
    desc: "A sophisticated riverfront apartment in a concierge building \u2014 floor-to-ceiling glass frames the water, with a generous entertainer\u2019s terrace.",
  },
  {
    id: "C07",
    addr: "19 Cracknell Road",
    sub: "Coorparoo",
    type: "Townhouse",
    price: 785000,
    bed: 3,
    bath: 2,
    car: 1,
    land: 210,
    tag: ["Just listed"],
    ag: 1,
    img: [13771880, 4857757, 28991200],
    feat: [
      "Boutique complex",
      "Private courtyard",
      "Whitegoods included",
      "Near Coorparoo Square",
    ],
    desc: "A low-maintenance townhouse in a boutique complex \u2014 three bedrooms, a private courtyard and a short walk to Coorparoo Square dining and cinemas.",
  },
  {
    id: "M08",
    addr: "6 Eblin Drive",
    sub: "Hamilton",
    type: "House",
    price: 2950000,
    bed: 5,
    bath: 4,
    car: 3,
    land: 720,
    tag: ["3D Tour", "Auction"],
    ag: 0,
    img: [30580640, 1643383, 10168692],
    feat: [
      "Hamilton Hill",
      "City & river views",
      "Lift to all levels",
      "Wine cellar",
    ],
    desc: "A landmark Hamilton Hill residence capturing sweeping city and river views \u2014 five bedrooms, a lift to all levels and a temperature-controlled cellar.",
  },
  {
    id: "W09",
    addr: "55 Mackay Street",
    sub: "Wilston",
    type: "House",
    price: 1295000,
    bed: 4,
    bath: 2,
    car: 2,
    land: 455,
    tag: ["Video"],
    ag: 2,
    img: [15422346, 6035357, 5179534],
    feat: [
      "Dual-living option",
      "Established gardens",
      "Family friendly",
      "Wilston State catchment",
    ],
    desc: "A versatile four-bedroom home with a dual-living option, established gardens and the Wilston State School catchment \u2014 perfect for a growing family.",
  },
  {
    id: "P10",
    addr: "7 Beck Street",
    sub: "Paddington",
    type: "House",
    price: 1390000,
    bed: 3,
    bath: 2,
    car: 1,
    land: 303,
    tag: ["Just listed"],
    ag: 0,
    img: [7031581, 6035357, 5179534],
    feat: [
      "Hilltop position",
      "Breezy verandahs",
      "City glimpses",
      "Walk to Latrobe Tce",
    ],
    desc: "A charming hilltop Queenslander with breezy verandahs and city glimpses, a short walk to the cafes and boutiques of Latrobe Terrace.",
  },
  {
    id: "N11",
    addr: "12/40 Merthyr Road",
    sub: "New Farm",
    type: "Apartment",
    price: 1290000,
    bed: 3,
    bath: 2,
    car: 2,
    land: 140,
    tag: ["3D Tour"],
    ag: 1,
    img: [16631149, 4857757, 28991200],
    feat: [
      "Boutique block",
      "Two car spaces",
      "Chef\u2019s kitchen",
      "Steps to the park",
    ],
    desc: "A spacious three-bedroom apartment in a boutique block, with two secure car spaces and a chef\u2019s kitchen, steps from New Farm Park.",
  },
  {
    id: "C12",
    addr: "5 Cavendish Street",
    sub: "Coorparoo",
    type: "House",
    price: 1180000,
    bed: 4,
    bath: 2,
    car: 2,
    land: 410,
    tag: ["Video"],
    ag: 2,
    img: [33213827, 1643383, 6035357],
    feat: [
      "Renovated character home",
      "Wide side access",
      "Covered entertaining",
      "Top school catchment",
    ],
    desc: "A renovated character home with wide side access and a covered entertaining deck, in a sought-after Coorparoo school catchment.",
  },
  {
    id: "B13",
    addr: "30 Godwin Street",
    sub: "Bulimba",
    type: "Townhouse",
    price: 985000,
    bed: 3,
    bath: 2,
    car: 1,
    land: 190,
    tag: ["Just listed"],
    ag: 0,
    img: [13771880, 10168692, 4857757],
    feat: [
      "Low maintenance",
      "Private courtyard",
      "Walk to ferry",
      "Pet friendly",
    ],
    desc: "A low-maintenance townhouse with a private courtyard, an easy walk to the Bulimba ferry, Oxford Street and riverside parks.",
  },
  {
    id: "H14",
    addr: "21 Hawthorne Road",
    sub: "Hawthorne",
    type: "Apartment",
    price: 720000,
    bed: 2,
    bath: 1,
    car: 1,
    land: 96,
    tag: ["Video"],
    ag: 1,
    img: [18423197, 28991200, 4857757],
    feat: [
      "Smart entry buy",
      "North-east aspect",
      "Leafy outlook",
      "Near cafes",
    ],
    desc: "A smart entry-level apartment with a north-east aspect and leafy outlook, moments from Hawthorne\u2019s cafes and the ferry terminal.",
  },
  {
    id: "A15",
    addr: "9 Sutherland Avenue",
    sub: "Ascot",
    type: "House",
    price: 3250000,
    bed: 5,
    bath: 4,
    car: 3,
    land: 810,
    tag: ["3D Tour", "Auction"],
    ag: 0,
    img: [30580640, 1643383, 10168692],
    feat: [
      "Blue-ribbon address",
      "Tennis court",
      "Pool & cabana",
      "Triple garage",
    ],
    desc: "A statement family estate on a blue-ribbon Ascot avenue \u2014 five bedrooms, a full tennis court, pool with cabana and triple garaging.",
  },
  {
    id: "T16",
    addr: "507/55 Vernon Terrace",
    sub: "Teneriffe",
    type: "Apartment",
    price: 1480000,
    bed: 3,
    bath: 2,
    car: 2,
    land: 160,
    tag: ["3D Tour"],
    ag: 2,
    img: [323780, 28991200, 16631149],
    feat: [
      "Top-floor outlook",
      "Woolstore character",
      "Dual balconies",
      "Secure building",
    ],
    desc: "A top-floor Woolstore conversion with soaring ceilings, exposed beams and dual balconies framing the river and city skyline.",
  },
  {
    id: "W17",
    addr: "14 Lamington Street",
    sub: "Wilston",
    type: "House",
    price: 1560000,
    bed: 4,
    bath: 3,
    car: 2,
    land: 480,
    tag: ["Just listed"],
    ag: 1,
    img: [15422346, 5179534, 6035357],
    feat: [
      "Elevated block",
      "Dual living",
      "Designer kitchen",
      "Walk to village",
    ],
    desc: "An elevated four-bedroom home with flexible dual-living, a designer kitchen and a short stroll to the Wilston village and station.",
  },
  {
    id: "M18",
    addr: "3 Crescent Road",
    sub: "Hamilton",
    type: "House",
    price: 2680000,
    bed: 4,
    bath: 3,
    car: 2,
    land: 650,
    tag: ["Video"],
    ag: 0,
    img: [19344325, 1643383, 10168692],
    feat: [
      "River-precinct",
      "Entertainer\u2019s deck",
      "Chef\u2019s kitchen",
      "Lift-ready design",
    ],
    desc: "A refined Hamilton home in the river precinct, built for entertaining with a vast deck, chef\u2019s kitchen and a lift-ready design over two levels.",
  },
];
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

function img(id, w, h) {
  return (
    "https://images.pexels.com/photos/" +
    id +
    "/pexels-photo-" +
    id +
    ".jpeg?auto=compress&cs=tinysrgb&w=" +
    w +
    "&h=" +
    h +
    "&fit=crop"
  );
}
function money(n) {
  return "$" + Math.round(n).toLocaleString("en-AU");
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

/* ---- populate selects ---- */
(function () {
  var subs = Object.keys(MED)
    .filter(function (s) {
      return s !== "Other";
    })
    .sort();
  var fs = document.getElementById("f-suburb"),
    hs = document.getElementById("h-suburb"),
    vs = document.getElementById("v-suburb");
  fs.innerHTML = '<option value="">All suburbs</option>';
  hs.innerHTML = '<option value="">All suburbs</option>';
  vs.innerHTML = "";
  subs.forEach(function (s) {
    fs.insertAdjacentHTML("beforeend", "<option>" + s + "</option>");
    hs.insertAdjacentHTML("beforeend", "<option>" + s + "</option>");
    vs.insertAdjacentHTML("beforeend", "<option>" + s + "</option>");
  });
})();

/* ---- favourites (in-memory) ---- */
var fav = new Set();

/* ---- render + filter listings ---- */
var grid = document.getElementById("grid"),
  fcount = document.getElementById("fcount");
var loadmore = document.getElementById("loadmore"),
  PAGE = 6,
  shown = PAGE,
  lastOut = [];
function renderGrid() {
  if (!lastOut.length) {
    grid.innerHTML =
      '<div class="empty"><b>No homes match those filters</b>Try widening your price range or suburb — or reset to see everything.</div>';
    loadmore.style.display = "none";
    return;
  }
  grid.innerHTML = lastOut.slice(0, shown).map(cardHTML).join("");
  var remaining = lastOut.length - shown;
  if (remaining > 0) {
    loadmore.style.display = "";
    loadmore.textContent = "Load more homes (" + remaining + " more)";
  } else loadmore.style.display = "none";
}
function badgeHTML(t) {
  var cls =
    t === "Auction" ? "badge auc" : t === "Just listed" ? "badge new" : "badge";
  var ic = t === "3D Tour" ? "\u25E2 " : t === "Video" ? "\u25B7 " : "";
  return '<span class="' + cls + '">' + ic + t + "</span>";
}
function cardHTML(p) {
  return (
    '<article class="card" data-id="' +
    p.id +
    '">' +
    '<div class="card-media"><img src="' +
    img(p.img[0], 800, 600) +
    '" alt="' +
    p.addr +
    ", " +
    p.sub +
    '" loading="lazy">' +
    '<div class="badges">' +
    p.tag.map(badgeHTML).join("") +
    "</div>" +
    '<button class="card-fav' +
    (fav.has(p.id) ? " on" : "") +
    '" data-fav aria-label="Save home">' +
    (fav.has(p.id) ? "\u2665" : "\u2661") +
    "</button></div>" +
    '<div class="card-body"><div class="price mono">' +
    money(p.price) +
    "</div>" +
    '<h3 class="card-addr">' +
    p.addr +
    '</h3><div class="card-sub">' +
    p.sub +
    ", QLD</div>" +
    '<div class="spec"><span>' +
    p.bed +
    "<i>bd</i></span><span>" +
    p.bath +
    "<i>ba</i></span><span>" +
    p.car +
    "<i>car</i></span><span>" +
    p.land +
    "<i>m\u00B2</i></span></div>" +
    '<button class="card-view">View property</button></div></article>'
  );
}
function applyFilters() {
  var sub = document.getElementById("f-suburb").value,
    ty = document.getElementById("f-type").value,
    bd = +document.getElementById("f-beds").value,
    ba = +document.getElementById("f-baths").value,
    mn = +document.getElementById("f-min").value,
    mx = +document.getElementById("f-max").value,
    sort = document.getElementById("f-sort").value;
  var out = LISTINGS.filter(function (p) {
    if (sub && p.sub !== sub) return false;
    if (ty && p.type !== ty) return false;
    if (bd && p.bed < bd) return false;
    if (ba && p.bath < ba) return false;
    if (mn && p.price < mn) return false;
    if (mx && p.price > mx) return false;
    return true;
  });
  if (sort === "lo")
    out.sort(function (a, b) {
      return a.price - b.price;
    });
  else if (sort === "hi")
    out.sort(function (a, b) {
      return b.price - a.price;
    });
  else if (sort === "bed")
    out.sort(function (a, b) {
      return b.bed - a.bed;
    });
  fcount.textContent = out.length + (out.length === 1 ? " home" : " homes");
  lastOut = out;
  shown = PAGE;
  renderGrid();
}
document.getElementById("loadmore").addEventListener("click", function () {
  shown += PAGE;
  renderGrid();
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
  document.getElementById("f-suburb").value =
    document.getElementById("h-suburb").value;
  document.getElementById("f-type").value =
    document.getElementById("h-type").value;
  applyFilters();
  document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
});
applyFilters();

/* ---- card interactions (event delegation) ---- */
grid.addEventListener("click", function (e) {
  var card = e.target.closest(".card");
  if (!card) return;
  var p = LISTINGS.find(function (x) {
    return x.id === card.dataset.id;
  });
  if (e.target.closest("[data-fav]")) {
    e.stopPropagation();
    var on = fav.has(p.id);
    if (on) fav.delete(p.id);
    else fav.add(p.id);
    var b = e.target.closest("[data-fav]");
    b.classList.toggle("on", !on);
    b.textContent = on ? "\u2661" : "\u2665";
    window.__toast(on ? "Removed from saved" : "Saved to your shortlist");
    return;
  }
  openModal(p);
});

/* ---- property modal ---- */
var modal = document.getElementById("pmodal");
function openModal(p) {
  var ag = AGENTS[p.ag];
  document.getElementById("mprice").textContent = money(p.price);
  document.getElementById("maddr").textContent = p.addr;
  document.getElementById("msub").textContent =
    p.sub + ", QLD \u00B7 " + p.type;
  document.getElementById("mspec").innerHTML =
    '<div class="ms"><span>' +
    p.bed +
    '</span><small>Beds</small></div><div class="ms"><span>' +
    p.bath +
    '</span><small>Baths</small></div><div class="ms"><span>' +
    p.car +
    '</span><small>Car</small></div><div class="ms"><span>' +
    p.land +
    "</span><small>m\u00B2 land</small></div>";
  document.getElementById("mdesc").textContent = p.desc;
  document.getElementById("mfeat").innerHTML = p.feat
    .map(function (f) {
      return "<li>" + f + "</li>";
    })
    .join("");
  document.getElementById("magent").innerHTML =
    '<div class="av"><img src="' +
    ag.photo +
    '" alt="' +
    ag.name +
    '"></div><div><b>' +
    ag.name +
    "</b><span>" +
    ag.role +
    "</span></div>";
  document.getElementById("mprop").value =
    p.addr + ", " + p.sub + " (" + money(p.price) + ")";
  document.querySelector("#mform [name=subject]").value =
    "Property enquiry: " + p.addr + ", " + p.sub;
  var thumbs = document.getElementById("mhthumbs"),
    mainimg = document.getElementById("mhimg");
  mainimg.src = img(p.img[0], 1100, 620);
  mainimg.alt = p.addr;
  thumbs.innerHTML = p.img
    .map(function (id, i) {
      return (
        '<button data-i="' +
        i +
        '" class="' +
        (i === 0 ? "on" : "") +
        '"><img src="' +
        img(id, 120, 90) +
        '" alt=""></button>'
      );
    })
    .join("");
  thumbs.querySelectorAll("button").forEach(function (b) {
    b.addEventListener("click", function () {
      mainimg.src = img(p.img[+b.dataset.i], 1100, 620);
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
