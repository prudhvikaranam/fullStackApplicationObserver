export const trackEvent = (event, metadata = {}) => {
  const payload = {
    event,
    metadata,
    page: window.location.pathname,
    sessionId: localStorage.getItem("sessionId") || "demo-session",
    username: localStorage.getItem("user") || "Guest",
    timestamp: new Date().toISOString()
  };

  console.log("TRACK EVENT:", payload);
  fetch("https://8080-edfeacdaaaeceedaedbacbbbaecafbaeaaad.premiumproject.examly.io/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch((err) => {
    console.error("Tracking failed:", err);
  });
};