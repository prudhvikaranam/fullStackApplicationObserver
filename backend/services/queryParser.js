import axios from "axios";

export async function parseQuery(message) {
    const prompt = `
You are a STRICT JSON generator.

Return ONLY JSON in this format:

{
  "page": "<page_name or *>",
  "metric": "sessions | clicks | duration | errors | apis | apiTime"
}

Rules:
- page = "*" if user asks for all pages
- metric must be ONE value
- NEVER return arrays
- NEVER return "pages" or "metrics"
- NO explanation
- Give response only with the metric requested
- Do no give any extra information
- Do not return data on un asked metrics

Examples:

User: "How many clicks on Home?"
Output:
{
  "page": "Home",
  "metric": "clicks"
}

User: "Total clicks?"
Output:
{
  "page": "*",
  "metric": "clicks"
}

User: "${message}"
`;

    const res = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3",
        prompt,
        stream: false
    });

    try {
        console.log('***************');

        console.log('Prudhvi - parseQuery response:', res.data.response);
        return JSON.parse(res.data.response);
    } catch {
        return {};
    }
}


