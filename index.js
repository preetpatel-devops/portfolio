/* ==========================================================================
   VISITOR COUNTER
   Fetches the view count from the AWS Lambda function URL and shows it
   in the footer. Plain JavaScript: no jQuery or Typed.js needed.
   ========================================================================== */

(function () {
  "use strict";

  var COUNTER_API =
    "https://zwoozioi5pdjvpgm7frminh6xa0iipfi.lambda-url.us-east-1.on.aws/";

  var counterEl = document.querySelector(".counter-number");

  if (!counterEl) {
    return;
  }

  /* The Lambda may return a bare number (42) or an object ({ count: 42 }). */
  function extractCount(data) {
    if (typeof data === "number" || typeof data === "string") {
      return data;
    }

    if (data && typeof data === "object") {
      var value = data.count !== undefined ? data.count
                : data.views !== undefined ? data.views
                : data.visitors !== undefined ? data.visitors
                : null;

      if (value !== null) {
        return value;
      }
    }

    return null;
  }

  async function updateCounter() {
    try {
      var response = await fetch(COUNTER_API);

      if (!response.ok) {
        throw new Error("Counter request failed: " + response.status);
      }

      var data = await response.json();
      var count = extractCount(data);

      if (count === null) {
        throw new Error("Unexpected counter response");
      }

      counterEl.textContent = "👀 Views: " + Number(count).toLocaleString();
    } catch (error) {
      console.error("Visitor counter error:", error);
      counterEl.textContent = "👀 Views: --";
    }
  }

  updateCounter();
})();
