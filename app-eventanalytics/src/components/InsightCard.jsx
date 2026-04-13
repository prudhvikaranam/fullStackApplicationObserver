import PropTypes from "prop-types";
export default function InsightCard({ text }) {
  return (
    <div style={{
      background: "#eef2ff",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "8px"
    }}>
      {text}
    </div>
  );
}
InsightCard.propTypes = {
  text: PropTypes.string.isRequired
};