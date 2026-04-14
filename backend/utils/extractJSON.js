export function extractJSON(text) {
  try {
    const match = text.match(/{[\s\S]*}/);
    return match ? JSON.parse(match[0]) : {};
  } catch {
    return {};
  }
}