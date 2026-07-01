/* ===== Web3Forms ===== */
var WEB3FORMS_ACCESS_KEY =
  ""; /* ← paste your Web3Forms access key (free at web3forms.com) */
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

/* ============ TEAM BIO TOGGLE ============ */
/* Cards are static HTML; this just opens/closes the bio on the About page. */
document.getElementById("teamFull").addEventListener("click", function (e) {
  var c = e.target.closest(".tm");
  if (c) c.classList.toggle("open");
});

/* ============ FAQ TOGGLE ============ */
/* FAQ items are static HTML; this expands/collapses each answer. */
document.addEventListener("click", function (e) {
  var q = e.target.closest(".qa-q");
  if (!q) return;
  var qa = q.parentElement,
    a = qa.querySelector(".qa-a");
  var open = qa.classList.toggle("open");
  a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
});

/* ============ ROUTER ============ */
var VIEWS = [
  "home",
  "family",
  "civil",
  "migration",
  "about",
  "resources",
  "contact",
];
var META = {
  home: [
    "Brightwater Legal — Family, Civil & Migration Lawyers in Brisbane",
    "Brisbane law firm for family & divorce, civil litigation and migration. Confidential first consultation.",
  ],
  family: [
    "Family & Divorce Lawyers Brisbane | Brightwater Legal",
    "Brisbane family lawyers for divorce, property settlements and parenting. Book a confidential consultation.",
  ],
  civil: [
    "Civil Litigation & Dispute Lawyers Brisbane | Brightwater Legal",
    "Brisbane civil litigation lawyers for breach of contract, debt recovery and building disputes.",
  ],
  migration: [
    "Migration & Visa Lawyers Brisbane | Brightwater Legal",
    "Registered migration agents in Brisbane for partner, skilled and employer-sponsored visas and appeals.",
  ],
  about: [
    "About Brightwater Legal | Brisbane Lawyers",
    "Meet the family, civil and migration team at Brightwater Legal, Brisbane. Credentials and languages.",
  ],
  resources: [
    "Legal Resources & Guides | Brightwater Legal",
    "Free legal checklists and guides on family law, civil disputes and migration in Queensland.",
  ],
  contact: [
    "Contact Brightwater Legal | Book a Consultation",
    "Send a secure enquiry or book a consultation with Brightwater Legal in Brisbane.",
  ],
};
var pendingMatter = null;
function showView(name, push) {
  if (VIEWS.indexOf(name) < 0) name = "home";
  VIEWS.forEach(function (v) {
    document.getElementById("v-" + v).classList.toggle("active", v === name);
  });
  document.querySelectorAll("[data-go]").forEach(function (b) {
    b.classList.toggle("active", b.dataset.go === name);
  });
  document.title = META[name][0];
  var md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", META[name][1]);
  if (push !== false && location.hash !== "#/" + name)
    history.pushState(null, "", "#/" + name);
  window.scrollTo({ top: 0, behavior: "auto" });
  if (name === "contact" && pendingMatter) {
    applyMatter(pendingMatter);
    pendingMatter = null;
  }
  closeMobileNav();
}
function applyMatter(m) {
  var map = {
    family: "Family & Divorce",
    civil: "Civil Litigation",
    migration: "Migration & Visas",
  };
  var sel = document.getElementById("fMatter");
  if (map[m]) {
    sel.value = map[m];
    updateConditional();
  }
}
window.addEventListener("popstate", function () {
  showView((location.hash || "#/home").replace("#/", ""), false);
});
document.addEventListener("click", function (e) {
  var go = e.target.closest("[data-go]");
  if (!go) return;
  if (go.dataset.matter) pendingMatter = go.dataset.matter;
  showView(go.dataset.go);
});

/* ============ CONDITIONAL FORM ============ */
var fMatter = document.getElementById("fMatter");
function updateConditional() {
  var v = fMatter.value;
  document
    .getElementById("condFamily")
    .classList.toggle("show", v === "Family & Divorce");
  document
    .getElementById("condCivil")
    .classList.toggle("show", v === "Civil Litigation");
  document
    .getElementById("condMigration")
    .classList.toggle("show", v === "Migration & Visas");
}
fMatter.addEventListener("change", updateConditional);

document.getElementById("enquiryForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var msg = document.getElementById("formMsg"),
    btn = document.getElementById("submitBtn");
  msg.className = "form-msg";
  if (!fMatter.value) {
    msg.className = "form-msg err";
    msg.textContent = "Please choose how we can help.";
    return;
  }
  if (
    !document.getElementById("fName").value.trim() ||
    !document.getElementById("fEmail").value.trim() ||
    !document.getElementById("fPhone").value.trim() ||
    !document.getElementById("fMsg").value.trim()
  ) {
    msg.className = "form-msg err";
    msg.textContent =
      "Please complete your name, email, phone and a short description.";
    return;
  }
  if (!document.getElementById("fConsent").checked) {
    msg.className = "form-msg err";
    msg.textContent =
      "Please confirm you've read the Privacy Policy to continue.";
    return;
  }

  var fd = new FormData(e.target);
  var sub = "Website enquiry — " + fMatter.value;
  var detail =
    fd.get("family_matter_type") ||
    fd.get("dispute_type") ||
    fd.get("visa_type");
  if (detail) sub += " (" + detail + ")";
  fd.set("subject", sub);
  fd.set("from_name", "Brightwater Legal website");

  if (!WEB3FORMS_ACCESS_KEY) {
    /* demo mode: no key configured yet */
    btn.disabled = true;
    btn.textContent = "Sending…";
    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = "Send secure enquiry";
      msg.className = "form-msg ok";
      msg.innerHTML =
        "Thanks — your enquiry is ready to send. <b>Demo mode:</b> add your Web3Forms access key to deliver it to your inbox. We'd normally confirm receipt within one business day.";
      e.target.reset();
      updateConditional();
    }, 900);
    return;
  }
  btn.disabled = true;
  btn.textContent = "Sending…";
  sendToWeb3Forms(fd)
    .then(function (data) {
      btn.disabled = false;
      btn.textContent = "Send secure enquiry";
      if (data.success) {
        msg.className = "form-msg ok";
        msg.textContent =
          "Thank you — your enquiry has been received. The right specialist will respond within one business day.";
        e.target.reset();
        updateConditional();
        toast("Enquiry sent");
      } else {
        msg.className = "form-msg err";
        msg.textContent =
          "Something went wrong sending your enquiry. Please call us on (07) 3123 4567.";
      }
    })
    .catch(function () {
      btn.disabled = false;
      btn.textContent = "Send secure enquiry";
      msg.className = "form-msg err";
      msg.textContent =
        "Network error. Please try again or call (07) 3123 4567.";
    });
});

/* ============ RESOURCE DOWNLOADS ============ */
document.addEventListener("click", function (e) {
  var d = e.target.closest("[data-download]");
  if (!d) return;
  openModal("download", d.dataset.download);
});

/* ============ BOOKING ============ */
document.getElementById("bookBtn").addEventListener("click", function () {
  openModal("booking");
});

/* ============ MODALS ============ */
var MODALS = {
  privacy: {
    t: "Privacy Policy",
    h: '<p>Brightwater Legal is committed to protecting your privacy in accordance with the <b>Privacy Act 1988 (Cth)</b> and the Australian Privacy Principles.</p><h4>What we collect</h4><p>Through this website we collect only the details you choose to provide in an enquiry — such as your name, contact details and a description of your matter.</p><h4>How we use it</h4><p>Your information is used solely to respond to your enquiry, assess any conflict of interest, and provide legal services if you engage us. It is transmitted over an encrypted (TLS) connection.</p><h4>Disclosure</h4><p>We do not sell your information. It is shared only with our intake team and, where necessary, third parties directly involved in your matter.</p><h4>Access &amp; contact</h4><p>You may request access to, or correction of, your information at any time by emailing hello@brightwaterlegal.com.au.</p><p style="font-size:.8rem;margin-top:14px"><em>This is a sample policy for demonstration. Replace with your firm\u2019s reviewed privacy policy before publishing.</em></p>',
  },
  terms: {
    t: "Terms & Legal Disclaimer",
    h: '<p>The content on this website is general information only and does <b>not</b> constitute legal advice. Laws change and every situation is different.</p><h4>No lawyer–client relationship</h4><p>Using this site, or submitting an enquiry, does not create a lawyer–client relationship. That relationship begins only when we formally agree to act for you in a signed costs agreement.</p><h4>No reliance</h4><p>You should not act, or refrain from acting, on the basis of anything on this site without obtaining advice specific to your circumstances.</p><h4>Professional standards</h4><p>Liability limited by a scheme approved under Professional Standards Legislation.</p><p style="font-size:.8rem;margin-top:14px"><em>Sample wording for demonstration. Have your disclaimers reviewed for your jurisdiction before publishing.</em></p>',
  },
};
function openModal(kind, extra) {
  var body = document.getElementById("modalBody");
  if (kind === "download") {
    body.innerHTML =
      '<span class="kicker">Free guide</span><h2 style="margin:8px 0 6px">' +
      extra +
      '</h2><p class="muted" style="margin-bottom:18px">Enter your email and we\u2019ll send the guide right away.</p>' +
      '<div class="fld"><label>Name</label><input id="dlName" placeholder="Your name"></div>' +
      '<div class="fld"><label>Email</label><input id="dlEmail" type="email" placeholder="you@email.com"></div>' +
      '<button class="btn btn-forest btn-block btn-lg" id="dlSend">Email me the guide</button>' +
      '<div class="form-msg" id="dlMsg"></div>';
    document.getElementById("dlSend").addEventListener("click", function () {
      var em = document.getElementById("dlEmail").value.trim(),
        m = document.getElementById("dlMsg");
      if (!em) {
        m.className = "form-msg err";
        m.textContent = "Please enter your email.";
        return;
      }
      m.className = "form-msg ok";
      m.innerHTML =
        "Thanks! In production this captures your email (Web3Forms) and emails the guide. <b>Demo:</b> add your access key to enable delivery.";
      toast("Guide on its way");
    });
  } else if (kind === "booking") {
    body.innerHTML =
      '<span class="kicker">Book a consultation</span><h2 style="margin:8px 0 6px">Choose a time</h2><p class="muted" style="margin-bottom:18px">In production this is a live Calendly or Acuity scheduler embedded right here, so clients book and pay (if required) without leaving the page.</p>' +
      '<div style="background:var(--bone-2);border:1px dashed var(--line-2);border-radius:14px;padding:30px;text-align:center">' +
      '<svg viewBox="0 0 24 24" style="width:42px;height:42px;stroke:var(--forest);fill:none;stroke-width:1.5;margin:0 auto 12px"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4M8 14h3"/></svg>' +
      '<p style="color:var(--text)">Calendly / Acuity scheduler embeds here</p>' +
      '<p style="font-size:.82rem;margin-top:6px">Replace the placeholder in the booking card with your scheduling embed code.</p>' +
      "</div>" +
      '<button class="btn btn-ghost btn-block" style="margin-top:16px" id="bkContact">Or send an enquiry instead</button>';
    document.getElementById("bkContact").addEventListener("click", function () {
      closeModal();
      showView("contact");
    });
  } else if (MODALS[kind]) {
    body.innerHTML = "<h2>" + MODALS[kind].t + "</h2>" + MODALS[kind].h;
  }
  document.getElementById("modalScrim").classList.add("open");
}
function closeModal() {
  document.getElementById("modalScrim").classList.remove("open");
}
document.addEventListener("click", function (e) {
  var m = e.target.closest("[data-modal]");
  if (m) {
    e.preventDefault();
    openModal(m.dataset.modal);
  }
});
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalScrim").addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});

/* ============ LANGUAGE ============ */
var I18N = {
  en: {
    practice: "Practice areas ▾",
    about: "About",
    resources: "Resources",
    contact: "Contact",
    book: "Book a consultation",
    herokick: "Family · Civil · Migration law",
    callback: "",
  },
  ar: {
    practice: "مجالات الممارسة ▾",
    about: "من نحن",
    resources: "الموارد",
    contact: "اتصل بنا",
    book: "احجز استشارة",
    herokick: "قانون الأسرة · المدني · الهجرة",
    callback: "لدينا محامون يتحدثون العربية. اطلب معاودة الاتصال بلغتك.",
  },
  zh: {
    practice: "业务领域 ▾",
    about: "关于我们",
    resources: "资源",
    contact: "联系我们",
    book: "预约咨询",
    herokick: "家庭 · 民事 · 移民法",
    callback: "我们有讲中文的律师。请用您的语言申请回电。",
  },
  vi: {
    practice: "Lĩnh vực ▾",
    about: "Giới thiệu",
    resources: "Tài nguyên",
    contact: "Liên hệ",
    book: "Đặt lịch tư vấn",
    herokick: "Luật Gia đình · Dân sự · Di trú",
    callback:
      "Chúng tôi có luật sư nói tiếng Việt. Yêu cầu gọi lại bằng ngôn ngữ của bạn.",
  },
};
var langBtn = document.getElementById("langBtn"),
  langMenu = document.getElementById("langMenu");
langBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  langMenu.classList.toggle("open");
});
document.addEventListener("click", function () {
  langMenu.classList.remove("open");
});
langMenu.addEventListener("click", function (e) {
  var b = e.target.closest("[data-lang]");
  if (b) setLang(b.dataset.lang);
});
function setLang(code) {
  var dict = I18N[code] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    var k = el.dataset.i18n;
    if (dict[k] != null && dict[k] !== "") el.textContent = dict[k];
    else if (I18N.en[k]) el.textContent = I18N.en[k];
  });
  document.getElementById("langCur").textContent = code.toUpperCase();
  var banner = document.getElementById("cbBanner"),
    txt = document.getElementById("cbText");
  if (code !== "en" && dict.callback) {
    txt.textContent = dict.callback;
    banner.classList.add("show");
    banner.setAttribute("dir", code === "ar" ? "rtl" : "ltr");
  } else banner.classList.remove("show");
  langMenu.classList.remove("open");
}
document.getElementById("cbCta").addEventListener("click", function () {
  showView("contact");
});

/* ============ MISC UI ============ */
var hdr = document.getElementById("hdr");
addEventListener(
  "scroll",
  function () {
    hdr.classList.toggle("solid", scrollY > 10);
  },
  { passive: true }
);
var burger = document.getElementById("burger"),
  nav = document.getElementById("nav");
burger.addEventListener("click", function (e) {
  e.stopPropagation();
  nav.classList.toggle("mobile");
});
function closeMobileNav() {
  nav.classList.remove("mobile");
}
document.addEventListener("click", function (e) {
  if (!e.target.closest("#nav") && !e.target.closest("#burger"))
    closeMobileNav();
});

var toastEl = document.getElementById("toast"),
  toastT;
function toast(t) {
  document.getElementById("toastTx").textContent = t;
  toastEl.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(function () {
    toastEl.classList.remove("show");
  }, 2600);
}

/* reveal on scroll */
var io = new IntersectionObserver(
  function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".rv").forEach(function (el) {
  io.observe(el);
});

/* boot */
showView((location.hash || "#/home").replace("#/", ""), false);
console.log(
  "%cBrightwater Legal",
  "font:600 22px Spectral,serif;color:#16463A"
);
