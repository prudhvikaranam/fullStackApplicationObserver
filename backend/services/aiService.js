import axios from "axios";

export async function generateAnswer(question, result) {
  const prompt = `
You are a product analytics assistant.

Convert the result into a clear, human-readable answer.

Rules:
- Be concise
- Highlight key insights
- If result is empty → say "No data available"
- If metric is mostVisitedPage → clearly mention page and count
- If metric is mostActiveUser → mention user and sessions

User question: "${question}"
Data: ${JSON.stringify(result)}
`;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3",
    prompt,
    stream: false
  });

  return res.data.response;
}



// export async function generateAnswer(question, result) {
//   const prompt = `
// You are an analytics assistant.

// Convert the data into a human readable insight.

// Rules:
// - Be concise
// - Highlight key numbers
// - Mention page/user if relevant

// User question: "${question}"
// Data: ${JSON.stringify(result)}
// `;

// const res = await axios.post("http://localhost:11434/api/generate", {
//     model: "llama3",
//     prompt,
//     stream: false,
//     format: "json" // Forces JSON output
// });

//   return res.data.response;
// }




// import axios from "axios";

// export async function generateAnswer(message, result) {
//     const prompt = `
// User asked: "${message}"

// Result: ${JSON.stringify(result)}

// Explain clearly:
// - If APIs → mention names & counts
// - If performance → mention avg & max
// - Keep it short and clear
// - If you don't have data, say "there is no data available for that query"
// - Keep the answer relevant to the question. Don't add extra info.
// - Keep the answer relevant to the metrics asked. Don't add extra info.

// `;

//     console.log('------------------')
//     console.log('message in generate answer:', message)

//     const res = await axios.post("http://localhost:11434/api/generate", {
//         model: "llama3",
//         prompt,
//         stream: false
//     });


//     console.log('****response:', res.data.response);



//     return res.data.response;
// }