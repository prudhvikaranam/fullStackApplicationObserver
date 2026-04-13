export function isToday(ts) {
  const d = new Date(ts);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}