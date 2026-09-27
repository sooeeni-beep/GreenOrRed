export function previewSegments(duration) {
  if (!Number.isFinite(duration) || duration <= 0) return [];
  const length = Math.min(2, duration / 3);
  return [
    0,
    Math.max(0, duration / 2 - length / 2),
    Math.max(0, duration - length - 0.1),
  ].map((start) => ({ start, end: Math.min(duration, start + length) }));
}
