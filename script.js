/* ==========================================================================
   PORTFOLIO SCRIPT
   Handles: mobile nav, active-link tracking, scroll reveals,
   the "Other Certificates" accordion, SPI chart, live badge fetching,
   custom smooth scrolling, EmailJS OTP, and Web3Forms contact submission.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ---------------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------------- */
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");

      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("[data-nav]").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* ---------------------------------------------------------------------
     Smooth scrolling
     --------------------------------------------------------------------- */
  var allAnchorLinks = document.querySelectorAll('a[href^="#"]');

  allAnchorLinks.forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");

      if (targetId === "#top") {
        targetId = "body";
      }

      if (targetId === "#") {
        return;
      }

      var targetElement = document.querySelector(targetId);

      if (!targetElement) {
        return;
      }

      e.preventDefault();

      var headerOffset = 56;
      var elementPosition = targetElement.getBoundingClientRect().top;
      var offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      var start = window.pageYOffset;
      var distance = offsetPosition - start;
      var duration = 1200;
      var startTime = null;

      function easeInOutQuad(t, b, c, d) {
        t /= d / 2;

        if (t < 1) {
          return (c / 2) * t * t + b;
        }

        t--;

        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      function animation(currentTime) {
        if (startTime === null) {
          startTime = currentTime;
        }

        var timeElapsed = currentTime - startTime;

        var run = easeInOutQuad(
          timeElapsed,
          start,
          distance,
          duration
        );

        window.scrollTo(0, run);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          window.scrollTo(0, offsetPosition);
        }
      }

      requestAnimationFrame(animation);
    });
  });


  /* ---------------------------------------------------------------------
     Active navigation tracking
     --------------------------------------------------------------------- */
  var navLinkEls = Array.prototype.slice.call(
    document.querySelectorAll("[data-nav]")
  );

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

          var link = document.querySelector(
            '[data-nav][href="#' + id + '"]'
          );

          if (!link) {
            return;
          }

          if (entry.isIntersecting) {
            navLinkEls.forEach(function (navLink) {
              navLink.classList.remove("active");
            });

            link.classList.add("active");
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }


  /* ---------------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    ".section-eyebrow, " +
    ".section-title, " +
    ".section-lead, " +
    ".edu-node, " +
    ".credly-badge-card, " +
    ".oracle-tile, " +
    ".job-card, " +
    ".project-card, " +
    ".interest-card, " +
    ".skill-group, " +
    ".contact-item, " +
    ".spi-chart-wrap"
  );

  revealTargets.forEach(function (element) {
    element.classList.add("reveal");
  });

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
      {
        threshold: 0.12
      }
    );

    revealTargets.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealTargets.forEach(function (element) {
      element.classList.add("in-view");
    });
  }


  /* ---------------------------------------------------------------------
     Other Certificates accordion
     --------------------------------------------------------------------- */
  var accTrigger = document.getElementById(
    "other-certs-trigger"
  );

  var accPanel = document.getElementById(
    "other-certs-panel"
  );

  if (accTrigger && accPanel) {
    accTrigger.addEventListener("click", function () {
      var expanded =
        accTrigger.getAttribute("aria-expanded") === "true";

      accTrigger.setAttribute(
        "aria-expanded",
        String(!expanded)
      );

      accPanel.hidden = expanded;
    });
  }


  /* ---------------------------------------------------------------------
     SPI chart
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

  var pointsGroup =
    document.getElementById("spi-points");

  var legendEl =
    document.getElementById("spi-legend");

  var chartEl =
    document.getElementById("spi-chart");

  var chartX0 = 60;
  var chartX1 = 740;

  var chartYTop = 20;
  var chartYBottom = 220;

  var scaleMin = 4;
  var scaleMax = 10;

  function xFor(i) {
    return (
      chartX0 +
      (i / (spiData.length - 1)) *
        (chartX1 - chartX0)
    );
  }

  function yFor(value) {
    var t =
      (value - scaleMin) /
      (scaleMax - scaleMin);

    return (
      chartYBottom -
      t * (chartYBottom - chartYTop)
    );
  }

  if (pointsGroup && legendEl) {
    spiData.forEach(function (data, i) {
      var cx = xFor(i);
      var cy = yFor(data.spi);

      var circle =
        document.createElementNS(
          svgNS,
          "circle"
        );

      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", 5);
      circle.setAttribute(
        "class",
        "spi-point"
      );

      pointsGroup.appendChild(circle);

      var legendItem =
        document.createElement("span");

      legendItem.innerHTML =
        "<b>" +
        data.spi.toFixed(2) +
        "</b>" +
        data.sem;

      legendEl.appendChild(legendItem);
    });
  }

  if (
    chartEl &&
    "IntersectionObserver" in window
  ) {
    var chartObserver =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "in-view"
              );

              chartObserver.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.3
        }
      );

    chartObserver.observe(chartEl);
  }


  /* ---------------------------------------------------------------------
     Credly + Oracle certifications
     --------------------------------------------------------------------- */
  var credlyGrid =
    document.getElementById(
      "credly-badges-grid"
    );

  var oracleGrid =
    document.getElementById(
      "oracle-badges-grid"
    );

  var credlyBadgeUrls = [
    "https://www.credly.com/badges/89ba3d6c-5cdf-4c53-b592-dd04fbe26628",
    "https://www.credly.com/badges/216ecd42-11e3-4612-9d6b-1adf932c2eb1"
  ];

  var oracleCertifications = [
    {
      title: "AI Cloud Database Services",
      verifyUrl:
        "https://catalog-education.oracle.com/pls/certview/sharebadge?id=8375C85EC331B360DEE874C709BF3608EB3501B2C65DE14B21DEF143DC86BD6F",
      validTill: "Valid till 2027"
    },

    {
      title: "Data Science Professional",
      verifyUrl:
        "https://catalog-education.oracle.com/pls/certview/sharebadge?id=C2762F68FB73DA1A135DCCBE9BD7545B9D3D3070A51F9691B41D62A1D0B6EAF6",
      validTill: "Valid till 2027"
    },

    {
      title: "Generative AI Professional",
      verifyUrl:
        "https://catalog-education.oracle.com/pls/certview/sharebadge?id=1F4B85EC4244523CCB33E2C50D82875B506488B10760E82FD9965B839949B990",
      validTill: "Valid till 2027"
    },

    {
      title: "Developer Professional",
      verifyUrl:
        "https://catalog-education.oracle.com/pls/certview/sharebadge?id=CAEC56B59BF2B3F1205A5F882D685018BD7141C3877E67FFD7CC642F816394D9",
      validTill: "Valid till 2027"
    },

    {
      title: "DevOps Professional",
      verifyUrl:
        "https://catalog-education.oracle.com/pls/certview/sharebadge?id=355933018CE2D72321EAD71CE2B856194657B1D2918FFBF211597FBD7C00C775",
      validTill: "Valid till 2027"
    }
  ];


  /* ---------------------------------------------------------------------
     Credly badges
     --------------------------------------------------------------------- */
  if (credlyGrid) {
    credlyGrid.innerHTML = "";

    credlyBadgeUrls.forEach(function (url) {
      var card =
        document.createElement("a");

      card.href = url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.className =
        "credly-badge-card";

      card.innerHTML =
        '<div class="credly-card-body">' +
          '<div class="badge-icon-wrap">' +
            '<span style="color:var(--text-faint);font-size:0.75rem;">Loading...</span>' +
          "</div>" +

          '<h4 class="credly-badge-title">' +
            "Loading details..." +
          "</h4>" +

          '<p class="credly-issuer">' +
            "Issuer: Amazon Web Services" +
          "</p>" +
        "</div>" +

        '<div class="credly-card-footer">' +
          "<span>PROVIDED BY</span> " +
          '<span class="credly-logo-text">' +
            "Credly" +
          "</span>" +
        "</div>";

      credlyGrid.appendChild(card);

      fetch(
        "https://api.microlink.io?url=" +
        encodeURIComponent(url)
      )
        .then(function (response) {
          return response.json();
        })

        .then(function (response) {
          if (
            !response ||
            !response.data
          ) {
            return;
          }

          var data = response.data;

          var rawTitle =
            data.title ||
            "AWS Certification";

          var cleanTitle =
            rawTitle
              .replace(
                " was issued by Amazon Web Services Training and Certification to Preet Patel.",
                ""
              )
              .replace(
                " - Credly",
                ""
              );

          var imgUrl =
            data.image &&
            data.image.url
              ? data.image.url
              : "https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png";

          var desc =
            data.description || "";

          var isExpired =
            /expired|inactived|ended/i.test(
              desc
            ) ||
            /expired/i.test(rawTitle);

          var statusBadge =
            isExpired
              ? '<span class="badge-tag-expired">EXPIRED</span>'
              : '<span class="badge-valid-till">Active Credential</span>';

          card.innerHTML =
            '<div class="credly-card-body">' +

              '<div class="badge-icon-wrap">' +
                '<img src="' +
                  imgUrl +
                  '" alt="' +
                  cleanTitle +
                  '" class="badge-live-img" crossorigin="anonymous">' +
              "</div>" +

              '<h4 class="credly-badge-title" title="' +
                cleanTitle +
                '">' +
                cleanTitle +
              "</h4>" +

              statusBadge +

              '<p class="credly-issuer">' +
                "Issuer: Amazon Web Services" +
              "</p>" +

            "</div>" +

            '<div class="credly-card-footer">' +
              "<span>PROVIDED BY</span> " +
              '<span class="credly-logo-text">' +
                "Credly" +
              "</span>" +
            "</div>";
        })

        .catch(function () {
          var title =
            card.querySelector(
              ".credly-badge-title"
            );

          if (title) {
            title.textContent =
              "View Verified Badge";
          }
        });
    });
  }


  /* ---------------------------------------------------------------------
     Oracle certifications
     --------------------------------------------------------------------- */
  if (oracleGrid) {
    oracleGrid.innerHTML = "";

    oracleCertifications.forEach(
      function (cert) {
        var item =
          document.createElement("a");

        item.href = cert.verifyUrl;
        item.target = "_blank";
        item.rel =
          "noopener noreferrer";

        item.className =
          "oracle-tile";

        item.innerHTML =
          '<div class="oracle-icon-wrap">' +

            '<svg viewBox="0 0 100 100" class="badge-svg" aria-hidden="true">' +

              '<rect x="8" y="8" width="84" height="84" rx="18" fill="#f8fafc" stroke="#dc2626" stroke-width="3.5"/>' +

              '<path d="M34 32 H66 A14 14 0 0 1 66 62 H34 A14 14 0 0 1 34 32 Z" fill="none" stroke="#dc2626" stroke-width="5.5"/>' +

              '<text x="50" y="78" text-anchor="middle" fill="#0f172a" font-size="7.5" font-weight="800" font-family="sans-serif">' +
                "OCI CERTIFIED" +
              "</text>" +

            "</svg>" +

          "</div>" +

          '<span class="oracle-tile-label">' +
            cert.title +
          "</span>" +

          '<span class="badge-valid-till">' +
            cert.validTill +
          "</span>";

        oracleGrid.appendChild(item);
      }
    );
  }


  /* =====================================================================
     CONTACT FORM + EMAIL OTP
     ===================================================================== */

  const contactForm =
    document.getElementById(
      "contact-form"
    );

  const emailInput =
    document.getElementById(
      "email"
    );

  const sendOtpBtn =
    document.getElementById(
      "send-otp-btn"
    );

  const otpStatus =
    document.getElementById(
      "otp-status"
    );

  const otpGroup =
    document.getElementById(
      "otp-group"
    );

  const otpInput =
    document.getElementById(
      "otp-input"
    );

  const verifyStatus =
    document.getElementById(
      "verify-status"
    );

  const submitBtn =
    document.getElementById(
      "submit-btn"
    );

  const successPopup =
    document.getElementById(
      "success-popup"
    );

  const resetFormBtn =
    document.getElementById(
      "reset-form-btn"
    );


  let generatedOtp = "";

  let otpExpiry = null;

  let emailVerified = false;


  /* ---------------------------------------------------------------------
     Reset verification if email changes
     --------------------------------------------------------------------- */
  if (emailInput) {
    emailInput.addEventListener(
      "input",
      function () {
        if (emailVerified) {
          return;
        }

        generatedOtp = "";
        otpExpiry = null;

        if (otpGroup) {
          otpGroup.style.display =
            "none";
        }

        if (otpInput) {
          otpInput.value = "";
        }

        if (verifyStatus) {
          verifyStatus.textContent =
            "";
        }

        if (otpStatus) {
          otpStatus.textContent =
            "";
        }

        if (submitBtn) {
          submitBtn.disabled = true;

          submitBtn.style.opacity =
            "0.6";

          submitBtn.style.cursor =
            "not-allowed";
        }
      }
    );
  }


  /* ---------------------------------------------------------------------
     Send OTP
     --------------------------------------------------------------------- */
  if (
    sendOtpBtn &&
    emailInput
  ) {
    sendOtpBtn.addEventListener(
      "click",
      async function () {
        const emailVal =
          emailInput.value.trim();

        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
          !emailRegex.test(emailVal)
        ) {
          otpStatus.textContent =
            "Please enter a valid email address first.";

          otpStatus.className =
            "form-msg error";

          emailInput.focus();

          return;
        }


        /* Generate OTP */

        generatedOtp =
          Math.floor(
            1000 +
            Math.random() * 9000
          ).toString();


        /* OTP expires after 5 minutes */

        otpExpiry =
          Date.now() +
          5 * 60 * 1000;


        const expiryDate =
          new Date(otpExpiry);

        const expiryTimeString =
          expiryDate.toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          );


        /* Loading state */

        sendOtpBtn.textContent =
          "Sending...";

        sendOtpBtn.disabled = true;

        otpStatus.textContent =
          "Sending verification code...";

        otpStatus.className =
          "form-msg";


        try {
          await emailjs.send(
            "service_oqr3brg",

            "template_e9tbqp7",

            {
              to_email: emailVal,

              otp_code:
                generatedOtp,

              time:
                expiryTimeString
            },

            "3Ew0AryFzuEwdvfsD"
          );


          /* Success */

          otpStatus.textContent =
            "OTP sent. Check your email.";

          otpStatus.className =
            "form-msg success";


          if (otpGroup) {
            otpGroup.style.display =
              "block";
          }


          if (otpInput) {
            otpInput.value = "";

            otpInput.readOnly =
              false;

            otpInput.focus();
          }


          if (verifyStatus) {
            verifyStatus.textContent =
              "Enter the 4-digit code. Verification is automatic.";

            verifyStatus.className =
              "form-msg";
          }


          sendOtpBtn.textContent =
            "Resend OTP";

          sendOtpBtn.disabled =
            false;
        }

        catch (error) {
          console.error(
            "EmailJS Error:",
            error
          );


          /*
           * Development fallback.
           *
           * IMPORTANT:
           * Remove this alert in production
           * because it exposes the OTP.
           */

          alert(
            "[Development Mode] OTP: " +
            generatedOtp
          );


          otpStatus.textContent =
            "Unable to send email. Development OTP generated.";

          otpStatus.className =
            "form-msg error";


          if (otpGroup) {
            otpGroup.style.display =
              "block";
          }


          if (otpInput) {
            otpInput.value = "";

            otpInput.focus();
          }


          sendOtpBtn.textContent =
            "Resend OTP";

          sendOtpBtn.disabled =
            false;
        }
      }
    );
  }


  /* ---------------------------------------------------------------------
     AUTO VERIFY OTP
     No separate Verify button required.
     --------------------------------------------------------------------- */
  if (
    otpInput &&
    emailInput
  ) {
    otpInput.addEventListener(
      "input",
      function () {

        /*
         * Only allow numbers
         * and maximum 4 digits.
         */

        otpInput.value =
          otpInput.value
            .replace(/\D/g, "")
            .slice(0, 4);


        const enteredOtp =
          otpInput.value.trim();


        /*
         * User hasn't entered
         * all four digits yet.
         */

        if (
          enteredOtp.length < 4
        ) {
          verifyStatus.textContent =
            "Enter the 4-digit code. Verification is automatic.";

          verifyStatus.className =
            "form-msg";

          return;
        }


        /*
         * No active OTP.
         */

        if (!generatedOtp) {
          verifyStatus.textContent =
            "Please request a new OTP.";

          verifyStatus.className =
            "form-msg error";

          return;
        }


        /*
         * Check OTP expiry.
         */

        if (
          otpExpiry &&
          Date.now() > otpExpiry
        ) {
          generatedOtp = "";

          otpExpiry = null;

          verifyStatus.textContent =
            "OTP expired. Please request a new code.";

          verifyStatus.className =
            "form-msg error";


          sendOtpBtn.disabled =
            false;

          sendOtpBtn.textContent =
            "Send New OTP";

          return;
        }


        /*
         * Correct OTP
         */

        if (
          enteredOtp === generatedOtp
        ) {
          emailVerified = true;


          verifyStatus.textContent =
            "Email verified ✓";

          verifyStatus.className =
            "form-msg success";


          otpStatus.textContent =
            "Email verified ✓";

          otpStatus.className =
            "form-msg success";


          /*
           * Lock verified fields.
           */

          emailInput.readOnly =
            true;

          otpInput.readOnly =
            true;


          /*
           * Hide Send/Resend OTP
           * after verification.
           */

          sendOtpBtn.style.display =
            "none";


          /*
           * Enable form submit.
           */

          if (submitBtn) {
            submitBtn.disabled =
              false;

            submitBtn.style.opacity =
              "1";

            submitBtn.style.cursor =
              "pointer";
          }


          /*
           * OTP no longer needed.
           */

          generatedOtp = "";

          otpExpiry = null;
        }

        else {
          /*
           * Incorrect OTP
           */

          verifyStatus.textContent =
            "Incorrect OTP. Please try again.";

          verifyStatus.className =
            "form-msg error";


          /*
           * Clear input so user
           * can immediately retry.
           */

          setTimeout(function () {
            if (!emailVerified) {
              otpInput.value = "";

              otpInput.focus();
            }
          }, 350);
        }
      }
    );
  }


  /* ---------------------------------------------------------------------
     Contact form submission
     --------------------------------------------------------------------- */
  if (
    contactForm &&
    submitBtn
  ) {
    contactForm.addEventListener(
      "submit",
      async function (event) {
        event.preventDefault();


        /*
         * Prevent bypassing
         * email verification.
         */

        if (!emailVerified) {
          if (otpStatus) {
            otpStatus.textContent =
              "Please verify your email before submitting.";

            otpStatus.className =
              "form-msg error";
          }

          return;
        }


        const originalText =
          submitBtn.textContent;


        submitBtn.textContent =
          "Submitting...";

        submitBtn.disabled =
          true;


        const formData =
          new FormData(contactForm);


        try {
          const response =
            await fetch(
              "https://api.web3forms.com/submit",
              {
                method: "POST",
                body: formData
              }
            );


          if (response.ok) {
            contactForm.style.display =
              "none";

            if (successPopup) {
              successPopup.style.display =
                "block";
            }
          }

          else {
            throw new Error(
              "Submission failed"
            );
          }
        }

        catch (error) {
          console.error(
            "Contact form error:",
            error
          );


          alert(
            "Submission failed. Please try again."
          );


          submitBtn.textContent =
            originalText;

          submitBtn.disabled =
            false;
        }
      }
    );
  }


  /* ---------------------------------------------------------------------
     Reset contact form
     --------------------------------------------------------------------- */
  if (
    resetFormBtn &&
    contactForm
  ) {
    resetFormBtn.addEventListener(
      "click",
      function () {

        contactForm.reset();


        /* Reset OTP state */

        generatedOtp = "";

        otpExpiry = null;

        emailVerified = false;


        /* Unlock email */

        if (emailInput) {
          emailInput.readOnly =
            false;
        }


        /* Reset OTP input */

        if (otpInput) {
          otpInput.readOnly =
            false;

          otpInput.value = "";
        }


        /* Hide OTP section */

        if (otpGroup) {
          otpGroup.style.display =
            "none";
        }


        /* Restore OTP button */

        if (sendOtpBtn) {
          sendOtpBtn.style.display =
            "";

          sendOtpBtn.disabled =
            false;

          sendOtpBtn.textContent =
            "Send OTP";
        }


        /* Clear messages */

        if (otpStatus) {
          otpStatus.textContent =
            "";

          otpStatus.className =
            "form-msg";
        }


        if (verifyStatus) {
          verifyStatus.textContent =
            "";

          verifyStatus.className =
            "form-msg";
        }


        /* Reset submit button */

        if (submitBtn) {
          submitBtn.disabled =
            true;

          submitBtn.style.opacity =
            "0.6";

          submitBtn.style.cursor =
            "not-allowed";

          submitBtn.textContent =
            "Submit Message";
        }


        /* Restore form */

        if (successPopup) {
          successPopup.style.display =
            "none";
        }

        contactForm.style.display =
          "block";
      }
    );
  }

})();