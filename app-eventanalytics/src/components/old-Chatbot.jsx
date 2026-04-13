import { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const CHAT_API =
  "https://8081-edfeacdaaaeceedaedbacbbbaecafbaeaaad.premiumproject.examly.io/ask";

const NUMBER_PREFIX_REGEX = /^\d+[.)]\s*/;

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${crypto.randomUUID()}`;
  }

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    const hex = Array.from(bytes, (b) =>
      b.toString(16).padStart(2, "0")
    ).join("");

    return `${hex}`;
  }

  return `${Date.now().toString(36)}`;
};

function parseAnswerToNode(answer) {
  if (!answer || typeof answer !== "string") return answer;

  const rawLines = answer.split("\n");
  const lines = rawLines.map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return "";

  let header = "";
  let items = [];

  if (lines.length > 0 && !NUMBER_PREFIX_REGEX.test(lines[0])) {
    header = lines[0];
    items = lines.slice(1);
  } else {
    items = lines;
  }

  const parsed = items.map((line) =>
    line.replace(NUMBER_PREFIX_REGEX, "").trim()
  );

  return (
    <div>
      {header && (
        <p style={{ margin: "0 0 6px 0", whiteSpace: "pre-wrap" }}>
          {header}
        </p>
      )}
      {parsed.length > 0 ? (
        <ol style={{ margin: 0, paddingLeft: "18px" }}>
          {parsed.map((it) => (
            <li key={it} style={{ marginBottom: 4, whiteSpace: "pre-wrap" }}>
              {it}
            </li>
          ))}
        </ol>
      ) : (
        <div style={{ whiteSpace: "pre-wrap" }}>{answer}</div>
      )}
    </div>
  );
}

const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.error("JSON parse failed", err);
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

  const handleStreamResponse = async (res) => {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let accumulated = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (value) {
        accumulated += decoder.decode(value, { stream: !done });
        appendBotMessage(accumulated, true);
      }
    }

    const parsed = safeJsonParse(accumulated);
    if (parsed?.answer) {
      appendBotMessage(parseAnswerToNode(parsed.answer), true);
    } else {
      appendBotMessage(accumulated, true);
    }
  };

  const handleNormalResponse = async (res) => {
    const ct = res.headers.get("content-type") || "";

    if (ct.includes("application/json")) {
      const json = await res.json();

      if (json?.answer) {
        appendBotMessage(parseAnswerToNode(json.answer), true);
      } else {
        appendBotMessage(JSON.stringify(json, null, 2), true);
      }
    } else {
      const text = await res.text();
      const parsed = safeJsonParse(text);

      if (parsed?.answer) {
        appendBotMessage(parseAnswerToNode(parsed.answer), true);
      } else {
        appendBotMessage(text, true);
      }
    }
  };

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
        body: JSON.stringify({ query: trimmed }),
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
    } catch (err) {
      appendBotMessage(
        err.name === "AbortError"
          ? "Request cancelled"
          : "Failed to fetch response",
        true
      );
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
        aria-label="Toggle chatbot"
      >
        💬
      </button>

      {open && (
        <div className="chatbot-container">
          <div className="chat-header">
            <span>Event Trackers Analytics Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close chatbot">
              <span aria-hidden="true">✖</span>
            </button>
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
            <button onClick={handleSend} aria-label="send">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}