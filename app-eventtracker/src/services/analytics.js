export const trackEvent = (event, metadata = {}) => {
  const payload = {
    event,
    metadata,
    page: window.location.pathname,
    sessionId: localStorage.getItem("sessionId") || "demo-session",
    username: localStorage.getItem("user") || "Guest",
    timestamp: new Date().toISOString()
  };

  // console.log("Tracking event: created for hackathon project", payload);

  // fetch("http://localhost:5000/track", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(payload),
  //   keepalive: true
  // }).catch((err) => {
  //   console.error("Tracking failed:", err);
  // });
};