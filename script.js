/* ==========================================================================
   PORTFOLIO SCRIPT
   Handles: mobile nav, active-link tracking, scroll reveals,
   the "Other Certificates" accordion, SPI chart, live badge fetching,
   custom slow smooth scrolling, EmailJS OTP, and Web3Forms contact submission.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     Mobile navigation toggle
     --------------------------------------------------------------------- */
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close mobile menu after a link is tapped
    navLinks.querySelectorAll("[data-nav]").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Custom Smooth Scrolling (Slow "Traveling" Effect)
     --------------------------------------------------------------------- */
  var allAnchorLinks = document.querySelectorAll('a[href^="#"]');
  
  allAnchorLinks.forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      
      if (targetId === '#top') targetId = 'body';
      if (targetId === '#') return;
      
      var targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        var headerOffset = 56;
        var elementPosition = targetElement.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        var start = window.pageYOffset;
        var distance = offsetPosition - start;
        var duration = 1200;
        var startTime = null;
        
        function easeInOutQuad(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          var timeElapsed = currentTime - startTime;
          var run = easeInOutQuad(timeElapsed, start, distance, duration);
          
          window.scrollTo(0, run);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          } else {
            window.scrollTo(0, offsetPosition);
          }
        }
        
        requestAnimationFrame(animation);
      }
    });
  });

  /* ---------------------------------------------------------------------
     Active nav-link tracking via IntersectionObserver
     --------------------------------------------------------------------- */
  var navLinkEls = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = navLinkEls
    .map(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          var link = document.querySelector('[data-nav][href="#' + id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            navLinkEls.forEach(function (l) { l.classList.remove("active"); });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------------------------------------------------------------------
     Scroll-reveal for section headers and cards
     --------------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    ".section-eyebrow, .section-title, .section-lead, .edu-node, .credly-badge-card, .oracle-tile, " +
    ".job-card, .project-card, .interest-card, .skill-group, .contact-item, .spi-chart-wrap"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------------------------------------------------------------------
     "Other Certificates" accordion
     --------------------------------------------------------------------- */
  var accTrigger = document.getElementById("other-certs-trigger");
  var accPanel = document.getElementById("other-certs-panel");

  if (accTrigger && accPanel) {
    accTrigger.addEventListener("click", function () {
      var expanded = accTrigger.getAttribute("aria-expanded") === "true";
      accTrigger.setAttribute("aria-expanded", String(!expanded));
      accPanel.hidden = expanded;
    });
  }

  /* ---------------------------------------------------------------------
     SPI chart — data points + legend, generated from real semester data
     --------------------------------------------------------------------- */
  var spiData = [
    { sem: "Sem 1", spi: 6.76 },
    { sem: "Sem 2", spi: 7.52 },
    { sem: "Sem 3", spi: 7.00 },
    { sem: "Sem 4", spi: 7.00 },
    { sem: "Sem 5", spi: 7.79 },
    { sem: "Sem 6", spi: 9.13 },
    { sem: "Sem 7", spi: 9.42 },
    { sem: "Sem 8", spi: 9.46 }
  ];

  var svgNS = "http://www.w3.org/2000/svg";
  var pointsGroup = document.getElementById("spi-points");
  var legendEl = document.getElementById("spi-legend");
  var chartEl = document.getElementById("spi-chart");

  var chartX0 = 60, chartX1 = 740, chartYTop = 20, chartYBottom = 220;
  var scaleMin = 4, scaleMax = 10;

  function xFor(i) {
    return chartX0 + (i / (spiData.length - 1)) * (chartX1 - chartX0);
  }
  function yFor(value) {
    var t = (value - scaleMin) / (scaleMax - scaleMin);
    return chartYBottom - t * (chartYBottom - chartYTop);
  }

  if (pointsGroup && legendEl) {
    spiData.forEach(function (d, i) {
      var cx = xFor(i);
      var cy = yFor(d.spi);

      var circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", 5);
      circle.setAttribute("class", "spi-point");
      pointsGroup.appendChild(circle);

      var legendItem = document.createElement("span");
      legendItem.innerHTML = "<b>" + d.spi.toFixed(2) + "</b>" + d.sem;
      legendEl.appendChild(legendItem);
    });
  }

  if (chartEl && "IntersectionObserver" in window) {
    var chartObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            chartObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    chartObserver.observe(chartEl);
  }

  /* ---------------------------------------------------------------------
     LIVE CREDLY & ORACLE BADGE FETCH & RENDER
     --------------------------------------------------------------------- */
  var credlyGrid = document.getElementById("credly-badges-grid");
  var oracleGrid = document.getElementById("oracle-badges-grid");

  var credlyBadgeUrls = [
    "https://www.credly.com/badges/89ba3d6c-5cdf-4c53-b592-dd04fbe26628",
    "https://www.credly.com/badges/216ecd42-11e3-4612-9d6b-1adf932c2eb1"
  ];

  var oracleCertifications = [
    {
      title: "AI Cloud Database Services",
      verifyUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=8375C85EC331B360DEE874C709BF3608EB3501B2C65DE14B21DEF143DC86BD6F",
      validTill: "Valid till 2027"
    },
    {
      title: "Data Science Professional",
      verifyUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=C2762F68FB73DA1A135DCCBE9BD7545B9D3D3070A51F9691B41D62A1D0B6EAF6",
      validTill: "Valid till 2027"
    },
    {
      title: "Generative AI Professional",
      verifyUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=1F4B85EC4244523CCB33E2C50D82875B506488B10760E82FD9965B839949B990",
      validTill: "Valid till 2027"
    },
    {
      title: "Developer Professional",
      verifyUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=CAEC56B59BF2B3F1205A5F882D685018BD7141C3877E67FFD7CC642F816394D9",
      validTill: "Valid till 2027"
    },
    {
      title: "DevOps Professional",
      verifyUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=355933018CE2D72321EAD71CE2B856194657B1D2918FFBF211597FBD7C00C775",
      validTill: "Valid till 2027"
    }
  ];

  if (credlyGrid) {
    credlyGrid.innerHTML = "";

    credlyBadgeUrls.forEach(function (url) {
      var card = document.createElement("a");
      card.href = url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.className = "credly-badge-card";
      card.innerHTML =
        '<div class="credly-card-body">' +
          '<div class="badge-icon-wrap">' +
            '<span style="color:var(--text-faint); font-size:0.75rem;">Loading...</span>' +
          '</div>' +
          '<h4 class="credly-badge-title">Loading details...</h4>' +
          '<p class="credly-issuer">Issuer: Amazon Web Services</p>' +
        '</div>' +
        '<div class="credly-card-footer">' +
          '<span>PROVIDED BY</span> <span class="credly-logo-text">Credly</span>' +
        '</div>';
      credlyGrid.appendChild(card);

      fetch("https://api.microlink.io?url=" + encodeURIComponent(url))
        .then(function (res) { return res.json(); })
        .then(function (response) {
          if (response && response.data) {
            var data = response.data;
            var rawTitle = data.title || "AWS Certification";
            var cleanTitle = rawTitle.replace(" was issued by Amazon Web Services Training and Certification to Preet Patel.", "").replace(" - Credly", "");
            var imgUrl = (data.image && data.image.url) ? data.image.url : "https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png";
            var desc = data.description || "";

            var isExpired = /expired|inactived|ended/i.test(desc) || /expired/i.test(rawTitle);
            var statusBadge = isExpired
              ? '<span class="badge-tag-expired">EXPIRED</span>'
              : '<span class="badge-valid-till">Active Credential</span>';

            card.innerHTML =
              '<div class="credly-card-body">' +
                '<div class="badge-icon-wrap">' +
                  '<img src="' + imgUrl + '" alt="' + cleanTitle + '" class="badge-live-img" crossorigin="anonymous" />' +
                '</div>' +
                '<h4 class="credly-badge-title" title="' + cleanTitle + '">' + cleanTitle + '</h4>' +
                statusBadge +
                '<p class="credly-issuer">Issuer: Amazon Web Services</p>' +
              '</div>' +
              '<div class="credly-card-footer">' +
                '<span>PROVIDED BY</span> <span class="credly-logo-text">Credly</span>' +
              '</div>';
          }
        })
        .catch(function () {
          card.querySelector(".credly-badge-title").textContent = "View Verified Badge";
        });
    });
  }

  if (oracleGrid) {
    oracleGrid.innerHTML = "";
    oracleCertifications.forEach(function (cert) {
      var item = document.createElement("a");
      item.href = cert.verifyUrl;
      item.target = "_blank";
      item.rel = "noopener noreferrer";
      item.className = "oracle-tile";
      item.innerHTML =
        '<div class="oracle-icon-wrap">' +
          '<svg viewBox="0 0 100 100" class="badge-svg" aria-hidden="true">' +
            '<rect x="8" y="8" width="84" height="84" rx="18" fill="#f8fafc" stroke="#dc2626" stroke-width="3.5"/>' +
            '<path d="M34 32 H66 A14 14 0 0 1 66 62 H34 A14 14 0 0 1 34 32 Z" fill="none" stroke="#dc2626" stroke-width="5.5"/>' +
            '<text x="50" y="78" text-anchor="middle" fill="#0f172a" font-size="7.5" font-weight="800" font-family="sans-serif">OCI CERTIFIED</text>' +
          '</svg>' +
        '</div>' +
        '<span class="oracle-tile-label">' + cert.title + '</span>' +
        '<span class="badge-valid-till">' + cert.validTill + '</span>';
      oracleGrid.appendChild(item);
    });
  }

  /* ---------------------------------------------------------------------
     REAL EMAIL OTP (EMAILJS) & WEB3FORMS SUBMISSION LOGIC
     --------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const emailInput = document.getElementById('email');
  const sendOtpBtn = document.getElementById('send-otp-btn');
  const otpStatus = document.getElementById('otp-status');
  
  const otpGroup = document.getElementById('otp-group');
  const otpInput = document.getElementById('otp-input');
  const verifyOtpBtn = document.getElementById('verify-otp-btn');
  const verifyStatus = document.getElementById('verify-status');
  
  const submitBtn = document.getElementById('submit-btn');
  const successPopup = document.getElementById('success-popup');
  const resetFormBtn = document.getElementById('reset-form-btn');

  let generatedOtp = '';

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async () => {
      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(emailVal)) {
        otpStatus.textContent = "Please enter a valid email address first.";
        otpStatus.className = "form-msg error";
        return;
      }

      generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Calculate 5-minute expiry string for template {{time}} variable
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      const expiryTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      sendOtpBtn.textContent = "Sending...";
      sendOtpBtn.disabled = true;

      try {
        // Send email via EmailJS with direct Public Key parameter
        await emailjs.send("service_oqr3brg", "template_e9tbqp7", {
          to_email: emailVal,
          otp_code: generatedOtp,
          time: expiryTimeString
        }, "3Ew0AryFzuEwdvfsD");

        otpStatus.textContent = "OTP code sent to your email! Please check your inbox.";
        otpStatus.className = "form-msg success";
        
        otpGroup.style.display = 'block';
        sendOtpBtn.textContent = "Resend OTP";
        sendOtpBtn.disabled = false;

      } catch (err) {
        console.error("EmailJS Error:", err);
        
        // Fallback simulation mode if blocked by browser/CORS/domain restrictions (e.g. file:// protocol)
        alert("[Development Fallback Mode] Your OTP Code is: " + generatedOtp);
        otpStatus.textContent = "OTP generated (Check alert for test code)";
        otpStatus.className = "form-msg success";
        
        otpGroup.style.display = 'block';
        sendOtpBtn.textContent = "Resend OTP";
        sendOtpBtn.disabled = false;
      }
    });
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
      const enteredOtp = otpInput.value.trim();

      if (enteredOtp === generatedOtp && enteredOtp !== '') {
        verifyStatus.textContent = "Email verified successfully!";
        verifyStatus.className = "form-msg success";
        
        emailInput.readOnly = true;
        otpInput.readOnly = true;
        sendOtpBtn.disabled = true;
        verifyOtpBtn.disabled = true;

        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';

      } else {
        verifyStatus.textContent = "Incorrect OTP code. Please check and try again.";
        verifyStatus.className = "form-msg error";
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        if (response.ok) {
          contactForm.style.display = 'none';
          successPopup.style.display = 'block';
        } else {
          alert("Submission failed. Please try again.");
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred. Check your connection.");
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      emailInput.readOnly = false;
      otpInput.readOnly = false;
      sendOtpBtn.disabled = false;
      verifyOtpBtn.disabled = false;
      
      otpGroup.style.display = 'none';
      successPopup.style.display = 'none';
      contactForm.style.display = 'block';
      
      otpStatus.textContent = '';
      verifyStatus.textContent = '';
      sendOtpBtn.textContent = 'Send OTP';
      
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
    });
  }
})();