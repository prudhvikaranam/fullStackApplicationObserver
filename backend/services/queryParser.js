import axios from "axios";

export async function parseQuery(message) {
    const prompt = `
You are an analytics assistant.

Convert the user question into JSON.

Available fields:
- page <string>
- metric (visits, clicks, api, apis, apiTime)

Return ONLY JSON. No explanation.

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


