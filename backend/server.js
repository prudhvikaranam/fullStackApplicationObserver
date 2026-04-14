import express from "express";
import fs from "fs";
import { parseQuery } from "./services/queryParser.js";
import { runQuery } from "./services/dataService.js";
import { generateAnswer } from "./services/aiService.js";
import cors from "cors";
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

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const query = await parseQuery(message);
    const result = runQuery(query);
    const response = await generateAnswer(message, result);

    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));