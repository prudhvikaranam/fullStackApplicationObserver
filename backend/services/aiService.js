import axios from "axios";

export async function generateAnswer(message, result) {
    const prompt = `
User asked: "${message}"

Result: ${JSON.stringify(result)}

Explain clearly:
- If APIs → mention names & counts
- If performance → mention avg & max
- Keep it short and clear
- If you don't have data, say "there is no data available for that query"
- Keep the answer relevant to the question. Don't add extra info.
- Keep the answer relevant to the metrics asked. Don't add extra info.

`;

    console.log('------------------')
    console.log('message in generate answer:', message)

    const res = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3",
        prompt,
        stream: false
    });


    console.log('****response:', res.data.response);



    return res.data.response;
}