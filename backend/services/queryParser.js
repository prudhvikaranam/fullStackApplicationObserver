import axios from "axios";
import { extractJSON } from "../utils/extractJSON.js";

export async function parseQuery(message) {
  //   const prompt = `
  // You are a STRICT JSON generator for analytics queries.

  // Return ONLY JSON in this format:

  // {
  //   "page": "<string or *>",
  //   "metric": "clicks | sessions | duration | apis | apiStats | user | timeline",
  //   "user": "<optional>",
  //   "timeRange": {
  //     "from": "<optional timestamp>",
  //     "to": "<optional timestamp>"
  //   }
  // }

  // Rules:
  // - page = "*" if not mentioned
  // - metric must be ONE value
  // - user only if explicitly asked
  // - timeRange only if mentioned
  // - NO arrays
  // - NO extra keys
  // - NO explanation

  // User: "${message}"
  // `;


  //   const prompt = `
  // You are a specialized NL-to-JSON translator for product analytics. 
  // Your sole task is to convert the User's request into a single, valid JSON object.

  // ### SCHEMA:
  // {
  //   "page": "The specific page path or '*' if not specified",
  //   "metric": "Must be exactly one: clicks, sessions, duration, apis, apiStats, user, or timeline",
  //   "user": "The specific user ID/name or null",
  //   "timeRange": {
  //     "from": "ISO 8601 timestamp or null",
  //     "to": "ISO 8601 timestamp or null"
  //   }
  // }

  // ### STRICT CONSTRAINTS:
  // 1. **Output Format**: Return ONLY raw JSON. No Markdown blocks, no backticks, no prose.
  // 2. **Metric Mapping**: 
  //    - 'average time' or 'stayed' -> duration
  //    - 'active people' or 'who' -> user
  //    - 'performance' or 'errors' -> apiStats
  // 3. **Time Handling**: If the user says "last 24 hours" or "yesterday", calculate the timestamps based on current time: ${new Date().toISOString()}.
  // 4. **Defaults**: If a field is not mentioned, use "*" for page and null for others. Do not omit keys.

  // User Request: "${message}"
  // JSON Result:
  // `;




  const prompt = `
You are an expert Analytics Query Generator. Your job is to translate user questions into a structured JSON query based on the provided data schema.

### DATA SCHEMA REFERENCE:
- eventName: "PAGE_SUMMARY"
- user: (e.g., "uday123", "prudhvi123")
- data.page: ("Dashboard", "Cart", "Orders", "ProductDetail", "Checkout")
- data.apis: Array of API calls (status 200 = success, others = failure)
- data.clicks: Number of interactions
- ts: Epoch timestamp in milliseconds

### OUTPUT FORMAT (STRICT JSON ONLY):
{
  "page": "Specific page name or '*'",
  "metric": "sessions | clicks | duration | apis | apiStats | user | timeline",
  "user": "Exact user ID string or null",
  "timeRange": {
    "from": <number_ms_or_null>,
    "to": <number_ms_or_null>
  }
}

### RULES:
1. **Metric Mapping**: 
   - "What did [user] do?" or "activity" -> metric: "timeline"
   - "How many people" or "who" -> metric: "user"
   - "Performance" or "errors" -> metric: "apiStats"
2. **User Matching**: Normalize user IDs to lowercase (e.g., "UDay123" -> "uday123").
3. **Time Logic**: 
   - Current Reference Time: ${Date.now()}
   - If the user says "last hour", calculate (Current - 3600000).
   - If no time is mentioned, set "from" and "to" to null.
4. **No Prose**: Do not include explanations or markdown.

User: "${message}"
JSON Result:`;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3",
    prompt,
    stream: false
  });

  return extractJSON(res.data.response);
}


// import axios from "axios";

// export async function parseQuery(message) {
//     const prompt = `
// You are a STRICT JSON generator.

// Return ONLY JSON in this format:

// {
//   "page": "<page_name or *>",
//   "metric": "sessions | clicks | duration | errors | apis | apiTime"
// }

// Rules:
// - page = "*" if user asks for all pages
// - metric must be ONE value
// - NEVER return arrays
// - NEVER return "pages" or "metrics"
// - NO explanation
// - Give response only with the metric requested
// - Do no give any extra information
// - Do not return data on un asked metrics

// Examples:

// User: "How many clicks on Home?"
// Output:
// {
//   "page": "Home",
//   "metric": "clicks"
// }

// User: "Total clicks?"
// Output:
// {
//   "page": "*",
//   "metric": "clicks"
// }

// User: "${message}"
// `;

//     const res = await axios.post("http://localhost:11434/api/generate", {
//         model: "llama3",
//         prompt,
//         stream: false
//     });

//     try {
//         console.log('***************');

//         console.log('Prudhvi - parseQuery response:', res.data.response);
//         return JSON.parse(res.data.response);
//     } catch {
//         return {};
//     }
// }



// Review below ollama prompt which I used to develop product analytics application which is not returning results as expected when I chat with it, fine tune/rewrite  it as much as possible and relevant and final output



//   const prompt = `

// You are a STRICT JSON generator for analytics queries.



// Return ONLY JSON in this format:



// {

//   "page": "<string or *>",

//   "metric": "clicks | sessions | duration | apis | apiStats | user | timeline",

//   "user": "<optional>",

//   "timeRange": {

//     "from": "<optional timestamp>",

//     "to": "<optional timestamp>"

//   }

// }



// Rules:

// - page = "*" if not mentioned

// - metric must be ONE value

// - user only if explicitly asked

// - timeRange only if mentioned

// - NO arrays

// - NO extra keys

// - NO explanation



// User: "${message}"

// `;

