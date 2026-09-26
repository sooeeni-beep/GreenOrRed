import React, { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { useI18n } from "./i18n";
import { Modal } from "./components";
export function Blocks({ module, onNavigate }) {
  const { t, lang } = useI18n();
  const [video, setVideo] = useState(null);
  const blocks = (module.contentBlocks || []).filter((b) => b.enabled);
  return (
    <div className={"content-blocks layout-" + module.layout}>
      {blocks.map((b) => (
        <article className={"content-block block-" + b.type} key={b.id}>
          {b.media && b.type !== "video" && (
            <picture>
              {b.mobileMedia && (
                <source media="(max-width:540px)" srcSet={b.mobileMedia} />
              )}
              <img src={b.media} alt={t(b.title, b.titleFa)} loading="lazy" />
            </picture>
          )}
          {b.type === "video" && b.media && (
            <button className="block-play" onClick={() => setVideo(b)}>
              <Play />
              {t("Watch video", "تماشای ویدئو")}
            </button>
          )}
          <div>
            {b.title && <h3>{t(b.title, b.titleFa)}</h3>}
            {b.description && <p>{t(b.description, b.descriptionFa)}</p>}
            {b.cta && (
              <button
                className="primary"
                onClick={() =>
                  onNavigate
                    ? onNavigate(b)
                    : b.url
                      ? location.assign(b.url)
                      : null
                }
              >
                {t(b.cta, b.ctaFa)}
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </article>
      ))}
      {video && (
        <Modal
          title={t(video.title, video.titleFa)}
          onClose={() => setVideo(null)}
        >
          <video
            src={video.media}
            controls
            autoPlay
            playsInline
            className="expanded-video"
          />
        </Modal>
      )}
    </div>
  );
}
