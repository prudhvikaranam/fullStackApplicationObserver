import { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const CHAT_API = "http://localhost:5000/chat";

const generateId = () => {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36);
};

// ✅ Improved formatter (supports sections + bullets)
function parseAnswerToNode(answer) {
  if (!answer || typeof answer !== "string") return answer;

  const lines = answer.split("\n").map((l) => l.trim()).filter(Boolean);

  let sections = [];
  let current = null;

  lines.forEach((line) => {
    // Section headers
    if (
      line.toLowerCase().includes("according to") ||
      line.toLowerCase().includes("regarding")
    ) {
      current = {
        title: line.replace(":", ""),
        items: []
      };
      sections.push(current);
      return;
    }

    // Bullet points
    if (line.startsWith("*")) {
      current?.items.push(line.replace("*", "").trim());
      return;
    }

    // Fallback text
    if (!current) {
      current = { title: "", items: [] };
      sections.push(current);
    }

    current.items.push(line);
  });

  return (
    <div>
      {sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          {sec.title && (
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {sec.title}
            </div>
          )}

          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {sec.items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: generateId(),
      from: "bot",
      text: "Hi! Ask me about analytics insights."
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const streamControllerRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const appendBotMessage = (textOrNode, replaceLast = false) => {
    setMessages((prev) => {
      if (
        replaceLast &&
        prev.length &&
        prev[prev.length - 1].from === "bot"
      ) {
        const copy = [...prev];
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          text: textOrNode
        };
        return copy;
      }

      return [
        ...prev,
        {
          id: generateId(),
          from: "bot",
          text: textOrNode
        }
      ];
    });
  };

  // ---------- Streaming ----------
  const handleStreamResponse = async (res) => {
    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();

    let done = false;
    let accumulated = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (value) {
        accumulated += decoder.decode(value, { stream: !done });
        appendBotMessage(accumulated, true); // raw while streaming
      }
    }

    const parsed = safeJsonParse(accumulated);
    const text = parsed?.response || parsed?.answer;

    if (text) {
      appendBotMessage(parseAnswerToNode(text), true);
    } else {
      appendBotMessage(accumulated, true);
    }
  };

  // ---------- Normal ----------
  const handleNormalResponse = async (res) => {
    const ct = res.headers.get("content-type") || "";

    if (ct.includes("application/json")) {
      const json = await res.json();
      const text = json?.response || json?.answer;

      if (text) {
        appendBotMessage(parseAnswerToNode(text), true);
      } else {
        appendBotMessage(JSON.stringify(json, null, 2), true);
      }
    } else {
      const text = await res.text();
      const parsed = safeJsonParse(text);

      if (parsed?.response || parsed?.answer) {
        appendBotMessage(
          parseAnswerToNode(parsed.response || parsed.answer),
          true
        );
      } else {
        appendBotMessage(text, true);
      }
    }
  };

  // ---------- Send ----------
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        from: "user",
        text: trimmed
      }
    ]);

    setInput("");
    setTyping(true);

    appendBotMessage("...");

    if (streamControllerRef.current) {
      streamControllerRef.current.abort();
      streamControllerRef.current = null;
    }

    const controller = new AbortController();
    streamControllerRef.current = controller;

    try {
      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
        signal: controller.signal
      });

      if (!res.ok) {
        appendBotMessage(`Error: ${await res.text()}`, true);
        return;
      }

      if (res.body?.getReader) {
        await handleStreamResponse(res);
      } else {
        await handleNormalResponse(res);
      }
    } catch {
      appendBotMessage("Failed to fetch response", true);
    } finally {
      setTyping(false);
      streamControllerRef.current = null;
    }
  };

  return (
    <>
      <button
        className="chatbot-button"
        onClick={() => setOpen((s) => !s)}
      >
        💬
      </button>

      {open && (
        <div className="chatbot-container">
          <div className="chat-header">
            <span>Event Trackers Analytics Assistant</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}

            {typing && <div className="chat-msg bot">Analysing...</div>}

            <div ref={chatEndRef} />
          </div>

          <div className="chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}