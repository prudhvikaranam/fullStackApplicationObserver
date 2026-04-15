import { useEffect, useState, useMemo } from "react";
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

  const users = [
    "ALL",
    ...new Set(
      pages.flatMap((p) =>
        p.timeline.map((t) => t.user || "anonymous")
      )
    )
  ];

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

  // 🔥 TOP INSIGHTS CALCULATION
  const insights = useMemo(() => {
    let pageVisits = {};
    let clickMap = {};
    let apiMap = {};
    let durationMap = {};

    filteredPages.forEach((p) => {
      const visits = p.timeline.length;
      pageVisits[p.page] = (pageVisits[p.page] || 0) + visits;

      p.timeline.forEach((t) => {
        // clicks
        t.uniqueClicks.forEach((c) => {
          clickMap[c] = (clickMap[c] || 0) + 1;
        });

        // apis
        t.apis.forEach((a) => {
          apiMap[a.name] = (apiMap[a.name] || 0) + 1;
        });

        // duration
        durationMap[p.page] =
          (durationMap[p.page] || 0) + t.duration;
      });
    });

    const getTop = (obj) =>
      Object.entries(obj).sort((a, b) => b[1] - a[1])[0];

    return {
      topPage: getTop(pageVisits),
      topClick: getTop(clickMap),
      topApi: getTop(apiMap),
      topDuration: getTop(durationMap)
    };
  }, [filteredPages]);

  return (
    <div className="container">
      <h1>📊 Analytics Dashboard</h1>

      {/* USER FILTER */}
      <div className="filter-bar">
        <label>👤 Filter by User:</label>
        <select
          value={selectedUser}
          onChange={(e) => {
            setSelectedUser(e.target.value);
            setSelectedPage(null);
          }}
        >
          {users.map((u, i) => (
            <option key={i} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      {/* 🔥 TOP INSIGHT CARDS */}
      <div className="top-cards">
        <div className="top-card">
          <h3>🏆 Top Page</h3>
          <p>{insights.topPage?.[0] || "-"}</p>
          <span>{insights.topPage?.[1] || 0} visits</span>
        </div>

        <div className="top-card">
          <h3>🖱 Top Click</h3>
          <p>{insights.topClick?.[0] || "-"}</p>
          <span>{insights.topClick?.[1] || 0} clicks</span>
        </div>

        <div className="top-card">
          <h3>🔌 Top API</h3>
          <p>{insights.topApi?.[0] || "-"}</p>
          <span>{insights.topApi?.[1] || 0} calls</span>
        </div>

        <div className="top-card">
          <h3>⏱ Max Time Page</h3>
          <p>{insights.topDuration?.[0] || "-"}</p>
          <span>
            {Math.round((insights.topDuration?.[1] || 0) / 1000)}s
          </span>
        </div>
      </div>

      <hr />

      {/* EXISTING PAGE CARDS */}
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

      {/* TIMELINE (unchanged) */}
      {selectedPage && (
        <div className="timeline">
          <div className="timeline-header">
            <h2>📍 {selectedPage.page}</h2>
            <button onClick={() => setSelectedPage(null)}>❌</button>
          </div>

          {selectedPage.timeline.map((t, index) => {
            const clickKey = `click-${index}`;
            const apiKey = `api-${index}`;

            return (
              <div key={index} className="timeline-item">
                <p>🕒 {new Date(t.ts).toLocaleString()}</p>
                <p>👤 {t.user}</p>

                <p
                  className="clickable"
                  onClick={() => toggle(clickKey)}
                >
                  🖱 Clicks: {t.clicks}
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

                <p
                  className="clickable"
                  onClick={() => toggle(apiKey)}
                >
                  🔌 APIs: {t.apis.length}
                </p>

                {expanded[apiKey] && (
                  <div className="api-block">
                    {t.apis.map((api, i) => (
                      <div key={i} className="api-item">
                        <p>🔗 {api.name}</p>
                        <p>Status: {api.status}</p>
                        <p>⏱ {api.duration} ms</p>
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
// import Chatbot from "../components/Chatbot";

// export default function App() {
//   const [pages, setPages] = useState([]);
//   const [selectedPage, setSelectedPage] = useState(null);
//   const [expanded, setExpanded] = useState({});
//   const [selectedUser, setSelectedUser] = useState("ALL");

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

//   // 🔥 Extract unique users
//   const users = [
//     "ALL",
//     ...new Set(
//       pages.flatMap((p) =>
//         p.timeline.map((t) => t.user || "anonymous")
//       )
//     )
//   ];

//   // 🔥 Filter pages based on user
//   const filteredPages =
//     selectedUser === "ALL"
//       ? pages
//       : pages.map((p) => ({
//         ...p,
//         timeline: p.timeline.filter(
//           (t) => t.user === selectedUser
//         )
//       }));

//   const getClickBreakdown = (clicks) => {
//     const map = {};
//     clicks.forEach((c) => (map[c] = (map[c] || 0) + 1));
//     return map;
//   };

//   return (
//     <div className="container">
//       <h1>📊 Analytics Dashboard</h1>

//       {/* 🔥 USER FILTER */}
//       <div className="filter-bar">
//         <label>👤 Filter by User:</label>
//         <select
//           value={selectedUser}
//           onChange={(e) => {
//             setSelectedUser(e.target.value);
//             setSelectedPage(null); // reset view
//           }}
//         >
//           {users.map((u, i) => (
//             <option key={i} value={u}>
//               {u}
//             </option>
//           ))}
//         </select>
//       </div>
//       <br />
//       <br />
//       <hr />

//         {/* CARDS */}
//       <div className="card-grid">
//         {filteredPages.map((p) => {
//           const totalVisits = p.timeline.length;

//           return (
//             <div
//               key={p.page}
//               className="card"
//               onClick={() => setSelectedPage(p)}
//             >
//               <h2>📄 {p.page}</h2>

//               <p>👁 Visits: {totalVisits}</p>
//               <p>🖱 Clicks: {p.totalClicks}</p>

//               <hr />

//               <p>🔌 APIs: {p.api.total}</p>
//               <p className="success">✅ {p.api.success}</p>
//               <p className="failure">❌ {p.api.failure}</p>
//             </div>
//           );
//         })}
//       </div>

//       {/* DETAIL VIEW */}
//       {selectedPage && (
//         <div className="timeline">
//           <div className="timeline-header">
//             <h2>📍 {selectedPage.page}</h2>
//             <button onClick={() => setSelectedPage(null)}>❌</button>
//           </div>

//           {selectedPage.timeline
//             .filter(
//               (t) =>
//                 selectedUser === "ALL" ||
//                 t.user === selectedUser
//             )
//             .map((t, index) => {
//               const clickKey = `click-${index}`;
//               const apiKey = `api-${index}`;

//               return (
//                 <div key={index} className="timeline-item">
//                   <p>🕒 {new Date(t.ts).toLocaleString()}</p>
//                   <p>👤 {t.user}</p>

//                   {/* CLICKS */}
//                   <p
//                     className="clickable"
//                     onClick={() => toggle(clickKey)}
//                   >
//                     🖱 Clicks: {t.clicks}{" "}
//                     {t.clicks > 0 &&
//                       (expanded[clickKey] ? "⬆️" : "⬇️")}
//                   </p>

//                   {expanded[clickKey] && (
//                     <div className="sub-block">
//                       {Object.entries(
//                         getClickBreakdown(t.uniqueClicks)
//                       ).map(([k, v]) => (
//                         <p key={k}>
//                           🎯 {k} → {v}
//                         </p>
//                       ))}
//                     </div>
//                   )}

//                   {/* APIs */}
//                   <p
//                     className="clickable"
//                     onClick={() => toggle(apiKey)}
//                   >
//                     🔌 APIs: {t.apis.length}{" "}
//                     {t.apis.length > 0 &&
//                       (expanded[apiKey] ? "⬆️" : "⬇️")}
//                   </p>

//                   {expanded[apiKey] && (
//                     <div className="api-block">
//                       {t.apis.map((api, i) => (
//                         <div key={i} className="api-item">
//                           <p>🔗 {api.name}</p>
//                           <p>Status: {api.status}</p>
//                           <p>⏱ {api.duration} ms</p>
//                           <p
//                             className={
//                               api.success
//                                 ? "success"
//                                 : "failure"
//                             }
//                           >
//                             {api.success
//                               ? "✅ Success"
//                               : "❌ Failure"}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//         </div>
//       )}





//       <Chatbot />
//     </div>
//   );
// }










// // import { useEffect, useState } from "react";
// // import "./styles.css";

// // export default function App() {
// //   const [pages, setPages] = useState([]);
// //   const [selectedPage, setSelectedPage] = useState(null);
// //   const [expanded, setExpanded] = useState({});

// //   useEffect(() => {
// //     fetch("http://localhost:5000/analytics")
// //       .then((res) => res.json())
// //       .then((data) => setPages(data.pages));
// //   }, []);

// //   const toggle = (key) => {
// //     setExpanded((prev) => ({
// //       ...prev,
// //       [key]: !prev[key]
// //     }));
// //   };

// //   const getClickBreakdown = (clicks) => {
// //     const map = {};
// //     clicks.forEach((c) => (map[c] = (map[c] || 0) + 1));
// //     return map;
// //   };

// //   return (
// //     <div className="container">
// //       <h1>📊 Analytics Dashboard</h1>

// //       {/* CARDS */}
// //       <div className="card-grid">
// //         {pages.map((p) => (
// //           <div
// //             key={p.page}
// //             className="card"
// //             onClick={() => setSelectedPage(p)}
// //           >
// //             <h2>📄 {p.page}</h2>

// //             <p>👁 {p.totalVisits} Visits</p>
// //             <p>👤 {p.users} Users</p>
// //             <p>🖱 {p.totalClicks} Clicks</p>
// //             <p>🧭 {p.sessions} Sessions</p>

// //             <hr />

// //             <p>🔌 APIs: {p.api.total}</p>
// //             <p>⚡ Avg: {p.api.avgDuration} ms</p>

// //             <p className="success">✅ {p.api.success}</p>
// //             <p className="failure">❌ {p.api.failure}</p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* DETAIL VIEW */}
// //       {selectedPage && (
// //         <div className="timeline">
// //           <div className="timeline-header">
// //             <h2>📍 {selectedPage.page} Timeline</h2>
// //             <button onClick={() => setSelectedPage(null)}>❌ Close</button>
// //           </div>

// //           {selectedPage.timeline.map((t, index) => {
// //             const clickKey = `click-${index}`;
// //             const searchKey = `search-${index}`;
// //             const filterKey = `filter-${index}`;
// //             const apiKey = `api-${index}`;

// //             return (
// //               <div key={index} className="timeline-item">
// //                 <p>🕒 {new Date(t.ts).toLocaleString()}</p>
// //                 <p>👤 {t.user}</p>
// //                 <p>🧑‍💻 {t.sessionId}</p>

// //                 {/* CLICKS */}
// //                 <p
// //                   className="clickable"
// //                   onClick={() => toggle(clickKey)}
// //                 >
// //                   🖱 Clicks: {t.clicks}{" "}
// //                   {t.clicks > 0 && (
// //                     <span>{expanded[clickKey] ? "⬆️" : "⬇️"}</span>
// //                   )}
// //                 </p>

// //                 {expanded[clickKey] && (
// //                   <div className="sub-block">
// //                     {Object.entries(
// //                       getClickBreakdown(t.uniqueClicks)
// //                     ).map(([k, v]) => (
// //                       <p key={k}>
// //                         🎯 {k} → {v}
// //                       </p>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {/* SEARCHES */}
// //                 <p
// //                   className="clickable"
// //                   onClick={() => toggle(searchKey)}
// //                 >
// //                   🔍 Searches: {t.searches.count || 0}{" "}
// //                   {t.searches.count > 0 && (
// //                     <span>{expanded[searchKey] ? "⬆️" : "⬇️"}</span>
// //                   )}
// //                 </p>

// //                 {expanded[searchKey] && (
// //                   <div className="sub-block">
// //                     {t.searches.queries.map((q, i) => (
// //                       <p key={i}>🔎 {q}</p>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {/* FILTERS */}
// //                 <p
// //                   className="clickable"
// //                   onClick={() => toggle(filterKey)}
// //                 >
// //                   🧩 Filters:{" "}
// //                   {Object.keys(t.filters).length}{" "}
// //                   {Object.keys(t.filters).length > 0 && (
// //                     <span>{expanded[filterKey] ? "⬆️" : "⬇️"}</span>
// //                   )}
// //                 </p>

// //                 {expanded[filterKey] && (
// //                   <div className="sub-block">
// //                     {Object.entries(t.filters).map(([k, v]) => (
// //                       <p key={k}>
// //                         🏷 {k}:{" "}
// //                         {Array.isArray(v) ? v.join(", ") : v}
// //                       </p>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {/* APIs */}
// //                 <p
// //                   className="clickable"
// //                   onClick={() => toggle(apiKey)}
// //                 >
// //                   🔌 APIs: {t.apis.length}{" "}
// //                   {t.apis.length > 0 && (
// //                     <span>{expanded[apiKey] ? "⬆️" : "⬇️"}</span>
// //                   )}
// //                 </p>

// //                 {expanded[apiKey] && (
// //                   <div className="api-block">
// //                     {t.apis.map((api, i) => (
// //                       <div key={i} className="api-item">
// //                         <p className="api-name">🔗 {api.name}</p>
// //                         <p>📡 {api.method}</p>
// //                         <p>Status: {api.status}</p>
// //                         <p>⏱ {api.duration} ms</p>

// //                         <p
// //                           className={
// //                             api.success ? "success" : "failure"
// //                           }
// //                         >
// //                           {api.success ? "✅ Success" : "❌ Failure"}
// //                         </p>

// //                         {api.error && (
// //                           <p className="error">
// //                             ⚠ {api.error}
// //                           </p>
// //                         )}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             );
// //           })}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

