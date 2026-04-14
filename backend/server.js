import express from "express";
import fs from "fs";
import { parseQuery } from "./services/queryParser.js";
import { runQuery } from "./services/dataService.js";
import { generateAnswer } from "./services/aiService.js";
import cors from "cors";
import { normalizeQuery } from "./utils/normalizeQuery.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.text());
const FILE_PATH = "./data/events.json";


// Save event
// app.post("/track", (req, res) => {
//   let data = [];

//   const readFile = fs.readFileSync(FILE_PATH, "utf-8");

//   console.log("Received event:", JSON.parse(req.body));

//   readFile && readFile.length > 0 && (data = JSON.parse(readFile));

//   try {
//     if (fs.existsSync(FILE_PATH)) {
//       const content = fs.readFileSync(FILE_PATH, "utf-8");
//       data = content ? JSON.parse(content) : [];
//     }
//   } catch (err) {
//     return res.status(500).json({ error: "File read error" });
//   }

//   data.push(req.body);

//   try {
//     fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
//   } catch (err) {
//     return res.status(500).json({ error: "File write error" });
//   }

//   res.json({ status: "event saved" });
// });



app.get('/products', (req, res) => {
  res.json({ status: 'success', message: 'products loaded' });
})


app.get('/viewproducts', (req, res) => {
  res.json({ status: 'success', message: 'view products loaded' });
})


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.get('/cart', async (req, res) => {
  await delay(20000);
  res.json({ status: 'success', message: 'products loaded' });
});

app.get('/orders', (req, res) => {
  res.status(400).json({ status: 'error', message: 'Bad request' });
});

app.get('/checkouts', (req, res) => {
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});


app.post("/track", (req, res) => {
  let data = [];

  let parsedBody;

  try {
    parsedBody = JSON.parse(req.body);
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  console.log("Received event:", parsedBody);

  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      data = content ? JSON.parse(content) : [];
    }
  } catch (err) {
    return res.status(500).json({ error: "File read error" });
  }

  // ✅ push parsed object, not string
  data.push(parsedBody);

  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    return res.status(500).json({ error: "File write error" });
  }

  res.json({ status: "event saved" });
});



app.get("/analytics", (req, res) => {
  let data = [];

  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      data = content ? JSON.parse(content) : [];
    }
  } catch (err) {
    return res.status(500).json({ error: "File read error" });
  }

  const pageMap = {};

  data.forEach((event) => {
    if (event.eventName !== "PAGE_SUMMARY") return;

    const {
      page,
      duration,
      clicks,
      uniqueClicks,
      searches,
      filters,
      apis
    } = event.data;

    const { sessionId, ts, user } = event;

    if (!pageMap[page]) {
      pageMap[page] = {
        page,
        totalVisits: 0,
        totalDuration: 0,
        totalClicks: 0,
        sessions: new Set(),
        users: new Set(),

        apiSummary: {
          total: 0,
          success: 0,
          failure: 0,
          totalDuration: 0,
          maxDuration: 0
        },

        timeline: []
      };
    }

    const pageObj = pageMap[page];

    // PAGE METRICS
    pageObj.totalVisits += 1;
    pageObj.totalDuration += duration;
    pageObj.totalClicks += clicks;
    pageObj.sessions.add(sessionId);
    if (user) pageObj.users.add(user);

    // API AGGREGATION
    if (apis?.length) {
      apis.forEach((api) => {
        pageObj.apiSummary.total++;
        pageObj.apiSummary.totalDuration += api.duration;

        if (api.success) pageObj.apiSummary.success++;
        else pageObj.apiSummary.failure++;

        if (api.duration > pageObj.apiSummary.maxDuration) {
          pageObj.apiSummary.maxDuration = api.duration;
        }
      });
    }

    // TIMELINE ENTRY (🔥 enriched)
    pageObj.timeline.push({
      ts,
      sessionId,
      user: user || "anonymous",
      duration,
      clicks,
      uniqueClicks: uniqueClicks || [],
      searches: searches || { count: 0, queries: [] },
      filters: filters || {},
      apis: apis || []
    });
  });

  const pages = Object.values(pageMap).map((p) => ({
    page: p.page,
    totalVisits: p.totalVisits,
    totalDuration: p.totalDuration,
    totalClicks: p.totalClicks,
    sessions: p.sessions.size,
    users: p.users.size,

    api: {
      total: p.apiSummary.total,
      success: p.apiSummary.success,
      failure: p.apiSummary.failure,
      avgDuration:
        p.apiSummary.total > 0
          ? Math.round(p.apiSummary.totalDuration / p.apiSummary.total)
          : 0,
      maxDuration: p.apiSummary.maxDuration
    },

    // 🔥 latest first
    timeline: p.timeline.sort((a, b) => b.ts - a.ts)
  }));

  

  res.json({ pages });
});


// app.get("/analytics", (req, res) => {
//   let data = [];

//   try {
//     if (fs.existsSync(FILE_PATH)) {
//       const content = fs.readFileSync(FILE_PATH, "utf-8");
//       data = content ? JSON.parse(content) : [];
//     }
//   } catch (err) {
//     return res.status(500).json({ error: "File read error" });
//   }

//   const pageMap = {};

//   data.forEach((event) => {
//     if (event.eventName !== "PAGE_SUMMARY") return;

//     const { page, duration, clicks, api, apis } = event.data;
//     const { sessionId, ts } = event;

//     if (!pageMap[page]) {
//       pageMap[page] = {
//         page,
//         totalVisits: 0,
//         totalDuration: 0,
//         totalClicks: 0,
//         sessions: new Set(),

//         // ✅ API Aggregation
//         apiSummary: {
//           total: 0,
//           success: 0,
//           failure: 0,
//           totalDuration: 0,
//           maxDuration: 0
//         },

//         timeline: []
//       };
//     }

//     const pageObj = pageMap[page];

//     // 🔹 Page metrics
//     pageObj.totalVisits += 1;
//     pageObj.totalDuration += duration;
//     pageObj.totalClicks += clicks;
//     pageObj.sessions.add(sessionId);

//     // 🔹 API Aggregation
//     if (apis && apis.length > 0) {
//       apis.forEach((apiCall) => {
//         pageObj.apiSummary.total += 1;
//         pageObj.apiSummary.totalDuration += apiCall.duration;

//         if (apiCall.success) {
//           pageObj.apiSummary.success += 1;
//         } else {
//           pageObj.apiSummary.failure += 1;
//         }

//         if (apiCall.duration > pageObj.apiSummary.maxDuration) {
//           pageObj.apiSummary.maxDuration = apiCall.duration;
//         }
//       });
//     }

//     // 🔹 Timeline (include API details)
//     pageObj.timeline.push({
//       ts,
//       duration,
//       clicks,
//       sessionId,
//       apis: apis || []
//     });
//   });

//   const pages = Object.values(pageMap).map((p) => ({
//     page: p.page,
//     totalVisits: p.totalVisits,
//     totalDuration: p.totalDuration,
//     totalClicks: p.totalClicks,
//     sessions: p.sessions.size,

//     // ✅ Final API Summary
//     api: {
//       total: p.apiSummary.total,
//       success: p.apiSummary.success,
//       failure: p.apiSummary.failure,
//       avgDuration:
//         p.apiSummary.total > 0
//           ? Math.round(p.apiSummary.totalDuration / p.apiSummary.total)
//           : 0,
//       maxDuration: p.apiSummary.maxDuration
//     },

//     timeline: p.timeline.sort((a, b) => a.ts - b.ts)
//   }));

//   res.json({ pages });
// });

// Chat endpoint
// app.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     const query = await parseQuery(message);
//     const result = runQuery(query);
//     const response = await generateAnswer(message, result);

//     res.json({ response });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });


app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const rawQuery = await parseQuery(message);
    const query = normalizeQuery(rawQuery);

    const result = runQuery(query);

    const response = await generateAnswer(message, result);

    res.json({ query, result, response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));