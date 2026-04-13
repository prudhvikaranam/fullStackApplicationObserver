import fs from "fs";

export function runQuery(query) {
  const data = JSON.parse(fs.readFileSync("./data/events.json"));

  let filtered = data.filter(e => e.eventName === "PAGE_SUMMARY");

//   console.log(filtered);
  // Filter by page
  if (query.page  && query.page.trim() !== "") {
    filtered = filtered.filter(
      e => e.data.page.toLowerCase() === query.page.toLowerCase()
    );
  }else{
   return filtered;
  }

  let result = {};

  // ✅ 1. Sessions (count of entries)
  if (query.metric === "sessions") {
    result.value = filtered.length;
  }

  // ✅ 2. Clicks
  else if (query.metric === "clicks") {
    console.log('filtered data for clicked metric:', filtered.map(e => e.data.clicks));
    result.value = filtered.reduce((sum, e) => sum + e.data.clicks, 0);
  }

  // ✅ 3. Total Duration
  else if (query.metric === "duration") {
    result.value = filtered.reduce((sum, e) => sum + e.data.duration, 0);
  }

  // ✅ 4. API Calls Count + Names
  else if (query.metric === "apis") {
    const apiMap = {};

    filtered.forEach(e => {
      e.data.apis.forEach(api => {
        if (!apiMap[api.name]) {
          apiMap[api.name] = 0;
        }
        apiMap[api.name]++;
      });
    });

    result.apis = apiMap;
  }

  // ✅ 5. API Performance (avg + max)
  else if (query.metric === "apiTime") {
    let total = 0;
    let count = 0;
    let max = 0;

    filtered.forEach(e => {
      e.data.apis.forEach(api => {
        total += api.duration;
        count++;
        if (api.duration > max) max = api.duration;
      });
    });

    result.avg = count ? Math.round(total / count) : 0;
    result.max = max;
    result.totalCalls = count;
  }

  // ✅ 6. Errors
  else if (query.metric === "errors") {
    result.value = filtered.reduce((sum, e) => sum + e.data.errors, 0);
  }

  return result;
}