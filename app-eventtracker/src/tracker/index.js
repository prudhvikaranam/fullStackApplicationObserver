class Tracker {
  constructor(config) {
    this.config = config;
    this.sessionId = sessionStorage.getItem("sid") || crypto.randomUUID();
    sessionStorage.setItem("sid", this.sessionId);

    this.currentPage = null;
    this.user = config.user || null; // ✅ ADD THIS

    this.isPageActive = false;   // ✅ track active page
    this.isSending = false;      // ✅ prevent duplicate send


    this.initClickTracking();
    this.initSearchTracking();
    this.initFilterTracking();
    this.initErrorTracking();
    this.initLifecycleTracking(); // ✅ ADD THIS
  }

  startPage(name) {
    this.currentPage = {
      name,
      start: performance.now(),
      clicks: [],
      searches: [],
      filters: {},
      apis: [],
      errors: []
    };
    this.isPageActive = true;   // ✅ mark active
    this.isSending = false;     // reset
  }

  // endPage() {
  //   if (!this.currentPage) return;

  //   const page = this.currentPage;
  //   const durations = page.apis.map(a => a.duration);

  //   const summary = {
  //     page: page.name,
  //     duration: Math.round(performance.now() - page.start),

  //     clicks: page.clicks.length,
  //     uniqueClicks: [...new Set(page.clicks)],

  //     searches: {
  //       count: page.searches.length,
  //       queries: page.searches
  //     },

  //     filters: page.filters,

  //     api: {
  //       count: page.apis.length,
  //       avgDuration: durations.length
  //         ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
  //         : 0,
  //       maxDuration: durations.length ? Math.max(...durations) : 0
  //     },

  //     apis: page.apis,
  //     errors: page.errors.length
  //   };

  //   // navigator.sendBeacon(
  //   //   this.config.endpoint,
  //   //   JSON.stringify({
  //   //     eventName: "PAGE_SUMMARY",
  //   //     data: summary,
  //   //     sessionId: this.sessionId,
  //   //     ts: Date.now()
  //   //   })
  //   // );

  //   const payload = JSON.stringify({
  //     eventName: "PAGE_SUMMARY",
  //     data: summary,
  //     sessionId: this.sessionId,
  //     ts: Date.now()
  //   });

  //   // Try sendBeacon
  //   let sent = false;

  //   if (navigator.sendBeacon) {
  //     sent = navigator.sendBeacon(this.config.endpoint, payload);
  //   }

  //   // Fallback (critical for refresh)
  //   if (!sent) {
  //     fetch(this.config.endpoint, {
  //       method: "POST",
  //       body: payload,
  //       keepalive: true,
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     });
  //   }

  //   this.currentPage = null;
  // }


  setUser(user) {
    this.user = user;
  }


  endPage() {
    // ❌ No page
    if (!this.currentPage) return;

    // ❌ Already ended
    if (this.currentPage.ended) return;

    // ❌ Already sending
    if (this.isSending) return;

    // ❌ Ignore early lifecycle triggers
    if (!this.isPageActive) return;

    this.currentPage.ended = true;
    this.isSending = true;
    this.isPageActive = false;

    const page = this.currentPage;
    const duration = performance.now() - page.start;
    const durations = page.apis.map(a => a.duration);


    const hasInteraction =
      page.clicks.length > 0 ||
      page.searches.length > 0 ||
      (page.filters && Object.keys(page.filters).length > 0);

    if (duration < 10000 && !hasInteraction) {
      return; 
    }

    const summary = {
      page: page.name,
      duration: Math.round(duration),
      clicks: page.clicks.length,
      uniqueClicks: [...new Set(page.clicks)],
      searches: {
        count: page.searches.length,
        queries: page.searches
      },
      filters: page.filters,
      api: {
        count: page.apis.length,
        avgDuration: durations.length
          ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
          : 0,
        maxDuration: durations.length ? Math.max(...durations) : 0
      },
      apis: page.apis,
      errors: page.errors.length
    };

    const payload = JSON.stringify({
      eventName: "PAGE_SUMMARY",
      data: summary,
      sessionId: this.sessionId,
      user: this.user || "",   // ✅ ADD THIS
      ts: Date.now()
    });

    let sent = false;

    if (navigator.sendBeacon) {
      sent = navigator.sendBeacon(this.config.endpoint, payload);
    }

    if (!sent) {
      fetch(this.config.endpoint, {
        method: "POST",
        body: payload,
        keepalive: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    this.currentPage = null;
  }

  initClickTracking() {
    document.addEventListener("click", (e) => {



      const el = e.target.closest("[data-track]");


      console.log('Prudhvi el:', el);

      if (!el || !this.currentPage) return;

      this.currentPage.clicks.push(el.dataset.track);
    });
  }

  initSearchTracking() {
    document.addEventListener("keydown", (e) => {
      const el = e.target.closest("[data-search]");
      if (!el || !this.currentPage) return;

      if (e.key === "Enter") {
        this.currentPage.searches.push(el.value);
      }
    });

    document.addEventListener("submit", (e) => {
      try {
        const input = e.target.querySelector("[data-search]");
        if (!input || !this.currentPage) return;

        this.currentPage.searches.push(input.value);
      } catch (err) {
      }
    });
  }

  initFilterTracking() {
    document.addEventListener("change", (e) => {
      const el = e.target.closest("[data-filter]");
      if (!el || !this.currentPage) return;

      const key = el.dataset.filter || el.name || el.id;




      if (!key) return;

      if (el.type === "checkbox") {
        if (!this.currentPage.filters[key]) this.currentPage.filters[key] = [];
        if (el.checked) {
          if (!this.currentPage.filters[key].includes(el.value)) {
            this.currentPage.filters[key].push(el.value);
          }
        } else {
          const idx = this.currentPage.filters[key].indexOf(el.value);
          if (idx > -1) this.currentPage.filters[key].splice(idx, 1);
        }
      } else if (el.type === "radio") {
        if (el.checked) this.currentPage.filters[key] = el.value;
      } else {
        this.currentPage.filters[key] = el.value;
      }
    });
  }

  initErrorTracking() {
    window.onerror = () => {
      if (this.currentPage) {
        this.currentPage.errors.push(1);
      }
    };
  }


  initLifecycleTracking() {
    window.addEventListener("pagehide", () => {
      if (this.isPageActive) {
        this.endPage();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && this.isPageActive) {
        this.endPage();
      }
    });
  }

}

export default Tracker;

