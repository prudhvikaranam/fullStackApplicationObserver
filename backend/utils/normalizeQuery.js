export function normalizeQuery(raw) {
  let query = raw.query || raw;

  return {
    page: query.page || "*",
    metric: Array.isArray(query.metric)
      ? query.metric[0]
      : query.metric,
    user: query.user,
    timeRange: query.timeRange
  };
}