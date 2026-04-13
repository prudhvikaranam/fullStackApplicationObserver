import PropTypes from "prop-types";

export default function ActivityFeed({ data }) {
  return (
    <div style={{
      background: "#fff",
      padding: "16px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
    }}>
      <h3>Recent Activity</h3>
      {data.map((item) => (
        <div
          key={item.id}
          style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}

ActivityFeed.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      text: PropTypes.string.isRequired
    })
  ).isRequired
};