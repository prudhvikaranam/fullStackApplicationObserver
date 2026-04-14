import { useEffect, useState } from "react";
import "./styles.css";
import Chatbot from "../components/Chatbot";

export default function App() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [selectedUser, setSelectedUser] = useState("ALL");

  useEffect(() => {
    fetch("http://localhost:5000/analytics")
      .then((res) => res.json())
      .then((data) => setPages(data.pages));
  }, []);

  const toggle = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 🔥 Extract unique users
  const users = [
    "ALL",
    ...new Set(
      pages.flatMap((p) =>
        p.timeline.map((t) => t.user || "anonymous")
      )
    )
  ];

  // 🔥 Filter pages based on user
  const filteredPages =
    selectedUser === "ALL"
      ? pages
      : pages.map((p) => ({
        ...p,
        timeline: p.timeline.filter(
          (t) => t.user === selectedUser
        )
      }));

  const getClickBreakdown = (clicks) => {
    const map = {};
    clicks.forEach((c) => (map[c] = (map[c] || 0) + 1));
    return map;
  };

  return (
    <div className="container">
      <h1>📊 Analytics Dashboard</h1>

      {/* 🔥 USER FILTER */}
      <div className="filter-bar">
        <label>👤 Filter by User:</label>
        <select
          value={selectedUser}
          onChange={(e) => {
            setSelectedUser(e.target.value);
            setSelectedPage(null); // reset view
          }}
        >
          {users.map((u, i) => (
            <option key={i} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      <br />
      <br />
      <hr />

        {/* CARDS */}
      <div className="card-grid">
        {filteredPages.map((p) => {
          const totalVisits = p.timeline.length;

          return (
            <div
              key={p.page}
              className="card"
              onClick={() => setSelectedPage(p)}
            >
              <h2>📄 {p.page}</h2>

              <p>👁 Visits: {totalVisits}</p>
              <p>🖱 Clicks: {p.totalClicks}</p>

              <hr />

              <p>🔌 APIs: {p.api.total}</p>
              <p className="success">✅ {p.api.success}</p>
              <p className="failure">❌ {p.api.failure}</p>
            </div>
          );
        })}
      </div>

      {/* DETAIL VIEW */}
      {selectedPage && (
        <div className="timeline">
          <div className="timeline-header">
            <h2>📍 {selectedPage.page}</h2>
            <button onClick={() => setSelectedPage(null)}>❌</button>
          </div>

          {selectedPage.timeline
            .filter(
              (t) =>
                selectedUser === "ALL" ||
                t.user === selectedUser
            )
            .map((t, index) => {
              const clickKey = `click-${index}`;
              const apiKey = `api-${index}`;

              return (
                <div key={index} className="timeline-item">
                  <p>🕒 {new Date(t.ts).toLocaleString()}</p>
                  <p>👤 {t.user}</p>

                  {/* CLICKS */}
                  <p
                    className="clickable"
                    onClick={() => toggle(clickKey)}
                  >
                    🖱 Clicks: {t.clicks}{" "}
                    {t.clicks > 0 &&
                      (expanded[clickKey] ? "⬆️" : "⬇️")}
                  </p>

                  {expanded[clickKey] && (
                    <div className="sub-block">
                      {Object.entries(
                        getClickBreakdown(t.uniqueClicks)
                      ).map(([k, v]) => (
                        <p key={k}>
                          🎯 {k} → {v}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* APIs */}
                  <p
                    className="clickable"
                    onClick={() => toggle(apiKey)}
                  >
                    🔌 APIs: {t.apis.length}{" "}
                    {t.apis.length > 0 &&
                      (expanded[apiKey] ? "⬆️" : "⬇️")}
                  </p>

                  {expanded[apiKey] && (
                    <div className="api-block">
                      {t.apis.map((api, i) => (
                        <div key={i} className="api-item">
                          <p>🔗 {api.name}</p>
                          <p>Status: {api.status}</p>
                          <p>⏱ {api.duration} ms</p>
                          <p
                            className={
                              api.success
                                ? "success"
                                : "failure"
                            }
                          >
                            {api.success
                              ? "✅ Success"
                              : "❌ Failure"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}





      <Chatbot />
    </div>
  );
}










// import { useEffect, useState } from "react";
// import "./styles.css";

// export default function App() {
//   const [pages, setPages] = useState([]);
//   const [selectedPage, setSelectedPage] = useState(null);
//   const [expanded, setExpanded] = useState({});

//   useEffect(() => {
//     fetch("http://localhost:5000/analytics")
//       .then((res) => res.json())
//       .then((data) => setPages(data.pages));
//   }, []);

//   const toggle = (key) => {
//     setExpanded((prev) => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const getClickBreakdown = (clicks) => {
//     const map = {};
//     clicks.forEach((c) => (map[c] = (map[c] || 0) + 1));
//     return map;
//   };

//   return (
//     <div className="container">
//       <h1>📊 Analytics Dashboard</h1>

//       {/* CARDS */}
//       <div className="card-grid">
//         {pages.map((p) => (
//           <div
//             key={p.page}
//             className="card"
//             onClick={() => setSelectedPage(p)}
//           >
//             <h2>📄 {p.page}</h2>

//             <p>👁 {p.totalVisits} Visits</p>
//             <p>👤 {p.users} Users</p>
//             <p>🖱 {p.totalClicks} Clicks</p>
//             <p>🧭 {p.sessions} Sessions</p>

//             <hr />

//             <p>🔌 APIs: {p.api.total}</p>
//             <p>⚡ Avg: {p.api.avgDuration} ms</p>

//             <p className="success">✅ {p.api.success}</p>
//             <p className="failure">❌ {p.api.failure}</p>
//           </div>
//         ))}
//       </div>

//       {/* DETAIL VIEW */}
//       {selectedPage && (
//         <div className="timeline">
//           <div className="timeline-header">
//             <h2>📍 {selectedPage.page} Timeline</h2>
//             <button onClick={() => setSelectedPage(null)}>❌ Close</button>
//           </div>

//           {selectedPage.timeline.map((t, index) => {
//             const clickKey = `click-${index}`;
//             const searchKey = `search-${index}`;
//             const filterKey = `filter-${index}`;
//             const apiKey = `api-${index}`;

//             return (
//               <div key={index} className="timeline-item">
//                 <p>🕒 {new Date(t.ts).toLocaleString()}</p>
//                 <p>👤 {t.user}</p>
//                 <p>🧑‍💻 {t.sessionId}</p>

//                 {/* CLICKS */}
//                 <p
//                   className="clickable"
//                   onClick={() => toggle(clickKey)}
//                 >
//                   🖱 Clicks: {t.clicks}{" "}
//                   {t.clicks > 0 && (
//                     <span>{expanded[clickKey] ? "⬆️" : "⬇️"}</span>
//                   )}
//                 </p>

//                 {expanded[clickKey] && (
//                   <div className="sub-block">
//                     {Object.entries(
//                       getClickBreakdown(t.uniqueClicks)
//                     ).map(([k, v]) => (
//                       <p key={k}>
//                         🎯 {k} → {v}
//                       </p>
//                     ))}
//                   </div>
//                 )}

//                 {/* SEARCHES */}
//                 <p
//                   className="clickable"
//                   onClick={() => toggle(searchKey)}
//                 >
//                   🔍 Searches: {t.searches.count || 0}{" "}
//                   {t.searches.count > 0 && (
//                     <span>{expanded[searchKey] ? "⬆️" : "⬇️"}</span>
//                   )}
//                 </p>

//                 {expanded[searchKey] && (
//                   <div className="sub-block">
//                     {t.searches.queries.map((q, i) => (
//                       <p key={i}>🔎 {q}</p>
//                     ))}
//                   </div>
//                 )}

//                 {/* FILTERS */}
//                 <p
//                   className="clickable"
//                   onClick={() => toggle(filterKey)}
//                 >
//                   🧩 Filters:{" "}
//                   {Object.keys(t.filters).length}{" "}
//                   {Object.keys(t.filters).length > 0 && (
//                     <span>{expanded[filterKey] ? "⬆️" : "⬇️"}</span>
//                   )}
//                 </p>

//                 {expanded[filterKey] && (
//                   <div className="sub-block">
//                     {Object.entries(t.filters).map(([k, v]) => (
//                       <p key={k}>
//                         🏷 {k}:{" "}
//                         {Array.isArray(v) ? v.join(", ") : v}
//                       </p>
//                     ))}
//                   </div>
//                 )}

//                 {/* APIs */}
//                 <p
//                   className="clickable"
//                   onClick={() => toggle(apiKey)}
//                 >
//                   🔌 APIs: {t.apis.length}{" "}
//                   {t.apis.length > 0 && (
//                     <span>{expanded[apiKey] ? "⬆️" : "⬇️"}</span>
//                   )}
//                 </p>

//                 {expanded[apiKey] && (
//                   <div className="api-block">
//                     {t.apis.map((api, i) => (
//                       <div key={i} className="api-item">
//                         <p className="api-name">🔗 {api.name}</p>
//                         <p>📡 {api.method}</p>
//                         <p>Status: {api.status}</p>
//                         <p>⏱ {api.duration} ms</p>

//                         <p
//                           className={
//                             api.success ? "success" : "failure"
//                           }
//                         >
//                           {api.success ? "✅ Success" : "❌ Failure"}
//                         </p>

//                         {api.error && (
//                           <p className="error">
//                             ⚠ {api.error}
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

