import React, { useRef, useEffect, useState } from "react";
import { previewSegments } from "../shared/preview.mjs";
export default function HeroVideo({ item, expanded, autoplay }) {
  const ref = useRef(),
    segment = useRef(0),
    [visible, setVisible] = useState(false),
    [pageVisible, setPageVisible] = useState(!document.hidden);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    const change = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => {
      obs.disconnect();
      document.removeEventListener("visibilitychange", change);
    };
  }, []);
  const play = expanded || (autoplay && visible && pageVisible);
  const src = expanded ? item.media : item.previewMedia || item.media;
  useEffect(() => {
    if (!ref.current) return;
    if (play) ref.current.play().catch(() => {});
    else ref.current.pause();
  }, [play, src]);
  const start = () => {
    segment.current = 0;
    if (!expanded && !item.previewMedia && ref.current)
      ref.current.currentTime = 0;
  };
  const advance = () => {
    const v = ref.current;
    if (expanded || item.previewMedia || !v || v.seeking) return;
    const parts = previewSegments(v.duration);
    if (parts.length && v.currentTime >= parts[segment.current].end) {
      segment.current = (segment.current + 1) % parts.length;
      v.currentTime = parts[segment.current].start;
      if (play) v.play().catch(() => {});
    }
  };
  return (
    <video
      ref={ref}
      src={expanded || visible ? src : undefined}
      poster={item.poster || undefined}
      controls={expanded}
      muted={!expanded}
      autoPlay={play}
      loop={!expanded && !!item.previewMedia}
      playsInline
      preload={expanded ? "metadata" : visible ? "metadata" : "none"}
      onLoadedMetadata={start}
      onTimeUpdate={advance}
      onEnded={advance}
    />
  );
}
