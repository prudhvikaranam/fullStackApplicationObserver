import fs from "fs";

// function applyFilters(data, query) {
//   let filtered = data.filter(e => e.eventName === "PAGE_SUMMARY");
//   console.log('Initial filtered query', query);
//   if (query.page && query.page !== "*") {
//     filtered = filtered.filter(
//       e => e.data.page.toLowerCase() === query.page.toLowerCase()
//     );
//   }
//   console.log('filtered data', filtered);



//   if (query.user) {
//     filtered = filtered.filter(
//       e => e.user.toLowerCase() === query.user.toLowerCase()
//     );
//   }

//   if (query.timeRange?.from && query.timeRange?.to) {
//     filtered = filtered.filter(
//       e => e.ts >= query.timeRange.from && e.ts <= query.timeRange.to
//     );
//   }

//   return filtered;
// }


function applyFilters(data, query) {
  let filtered = data.filter(e => e.eventName === "PAGE_SUMMARY");

  // 1. Page Filter
  if (query.page && query.page !== "*") {
    filtered = filtered.filter(
      e => e.data.page && e.data.page.toLowerCase() === query.page.toLowerCase()
    );
  }

  // 2. User Filter - ONLY filter if query.user is a non-null string
  if (query.user && typeof query.user === 'string') {
    filtered = filtered.filter(
      e => e.user && e.user.toLowerCase() === query.user.toLowerCase()
    );
  }

  // 3. Time Filter - Handle partial ranges
  if (query.timeRange) {
    if (query.timeRange.from) {
      filtered = filtered.filter(e => e.ts >= query.timeRange.from);
    }
    if (query.timeRange.to) {
      filtered = filtered.filter(e => e.ts <= query.timeRange.to);
    }
  }

  return filtered;
}

const metricHandlers = {
  sessions: (data) => data.length,

  clicks: (data) =>
    data.reduce((sum, e) => sum + (e.data.clicks || 0), 0),

  duration: (data) =>
    data.reduce((sum, e) => sum + (e.data.duration || 0), 0),

  apis: (data) => {
    const map = {};
    data.forEach(e => {
      (e.data.apis || []).forEach(api => {
        map[api.name] = (map[api.name] || 0) + 1;
      });
    });
    return map;
  },

  apiStats: (data) => {
    let total = 0, success = 0, failure = 0;

    data.forEach(e => {
      (e.data.apis || []).forEach(api => {
        total++;
        if (api.success) success++;
        else failure++;
      });
    });

    return { total, success, failure };
  },

  user: (data) => {
    const map = {};
    data.forEach(e => {
      map[e.user] = (map[e.user] || 0) + 1;
    });
    return map;
  },

  timeline: (data) =>
    data.map(e => ({
      page: e.data.page,
      ts: e.ts,
      duration: e.data.duration
    })),

  interactions: (data) => {
    const counts = {};
    data.forEach(e => {
      (e.data.uniqueClicks || []).forEach(click => {
        counts[click] = (counts[click] || 0) + 1;
      });
    });
    return counts;
  },

  // New: Extract search terms
  searchTerms: (data) => {
    let allQueries = [];
    data.forEach(e => {
      if (e.data.searches?.queries) {
        allQueries.push(...e.data.searches.queries);
      }
    });
    return { count: allQueries.length, terms: allQueries };
  },

  apiStats: (data) => {
    let total = 0, success = 0, failure = 0, slowCalls = 0;

    data.forEach(e => {
      (e.data.apis || []).forEach(api => {
        total++;
        if (api.success) success++;
        else failure++;

        if (api.duration > 1000) slowCalls++;
      });
    });

    return { total, success, failure, slowCalls };
  },

  mostVisitedPage: (data) => {
    const map = {};

    data.forEach(e => {
      const page = e.data.page;
      map[page] = (map[page] || 0) + 1;
    });

    let maxPage = null;
    let maxCount = 0;

    for (const page in map) {
      if (map[page] > maxCount) {
        maxCount = map[page];
        maxPage = page;
      }
    }

    return { page: maxPage, visits: maxCount };
  },

  mostActiveUser: (data) => {
    const map = {};

    data.forEach(e => {
      const user = e.user || "unknown";
      map[user] = (map[user] || 0) + 1;
    });

    let maxUser = null;
    let maxCount = 0;

    for (const user in map) {
      if (map[user] > maxCount) {
        maxCount = map[user];
        maxUser = user;
      }
    }

    return { user: maxUser, sessions: maxCount };
  },
};

export function runQuery(query) {
  const data = JSON.parse(fs.readFileSync("./data/events.json"));

  const filtered = applyFilters(data, query);

  console.log('query metric for metric', query.metric);
  const handler = metricHandlers[query.metric];


  console.log('Handler for metric', metricHandlers[query.metric], handler);

  if (!handler) return { error: "Unknown metric" };


  console.log('filtered data in run query', filtered);

  return handler(filtered);
}



// import fs from "fs";

// export function runQuery(query) {
//   const data = JSON.parse(fs.readFileSync("./data/events.json"));

//   let filtered = data.filter(e => e.eventName === "PAGE_SUMMARY");

// //   console.log(filtered);
//   // Filter by page
//   if (query.page  && query.page.trim() !== "") {
//     filtered = filtered.filter(
//       e => e.data.page.toLowerCase() === query.page.toLowerCase()
//     );
//   }else{
//    return filtered;
//   }

//   let result = {};

//   // ✅ 1. Sessions (count of entries)
//   if (query.metric === "sessions") {
//     result.value = filtered.length;
//   }

//   // ✅ 2. Clicks
//   else if (query.metric === "clicks") {
//     console.log('filtered data for clicked metric:', filtered.map(e => e.data.clicks));
//     result.value = filtered.reduce((sum, e) => sum + e.data.clicks, 0);
//   }

//   // ✅ 3. Total Duration
//   else if (query.metric === "duration") {
//     result.value = filtered.reduce((sum, e) => sum + e.data.duration, 0);
//   }

//   // ✅ 4. API Calls Count + Names
//   else if (query.metric === "apis") {
//     const apiMap = {};

//     filtered.forEach(e => {
//       e.data.apis.forEach(api => {
//         if (!apiMap[api.name]) {
//           apiMap[api.name] = 0;
//         }
//         apiMap[api.name]++;
//       });
//     });

//     result.apis = apiMap;
//   }

//   // ✅ 5. API Performance (avg + max)
//   else if (query.metric === "apiTime") {
//     let total = 0;
//     let count = 0;
//     let max = 0;

//     filtered.forEach(e => {
//       e.data.apis.forEach(api => {
//         total += api.duration;
//         count++;
//         if (api.duration > max) max = api.duration;
//       });
//     });

//     result.avg = count ? Math.round(total / count) : 0;
//     result.max = max;
//     result.totalCalls = count;
//   }

//   // ✅ 6. Errors
//   else if (query.metric === "errors") {
//     result.value = filtered.reduce((sum, e) => sum + e.data.errors, 0);
//   }

//   return result;
// }