import fs from "fs";

function applyFilters(data, query) {
  let filtered = data.filter(e => e.eventName === "PAGE_SUMMARY");
  console.log('Initial filtered data count:', query);
  if (query.page && query.page !== "*") {
    filtered = filtered.filter(
      e => e.data.page.toLowerCase() === query.page.toLowerCase()
    );
  }

  if (query.user) {
    filtered = filtered.filter(
      e => e.user.toLowerCase() === query.user.toLowerCase()
    );
  }

  if (query.timeRange?.from && query.timeRange?.to) {
    filtered = filtered.filter(
      e => e.ts >= query.timeRange.from && e.ts <= query.timeRange.to
    );
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
    }))
};

export function runQuery(query) {
  const data = JSON.parse(fs.readFileSync("./data/events.json"));

  const filtered = applyFilters(data, query);

  const handler = metricHandlers[query.metric];

  if (!handler) return { error: "Unknown metric" };

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