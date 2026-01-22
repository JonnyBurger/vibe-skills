import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";
import { createTikTokStyleCaptions, Caption } from "@remotion/captions";

type SubtitlesProps = {
  captions: Caption[];
  trimStartMs: number;
  trimEndMs: number;
};

const SWITCH_CAPTIONS_EVERY_MS = 1500;

export const Subtitles: React.FC<SubtitlesProps> = ({
  captions,
  trimStartMs,
  trimEndMs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Adjust captions to be relative to trim start and filter out-of-range
  const adjustedCaptions = useMemo(() => {
    return captions
      .filter((c) => c.startMs >= trimStartMs && c.endMs <= trimEndMs)
      .map((c) => ({
        ...c,
        startMs: c.startMs - trimStartMs,
        endMs: c.endMs - trimStartMs,
      }));
  }, [captions, trimStartMs, trimEndMs]);

  const { pages } = useMemo(() => {
    if (adjustedCaptions.length === 0) {
      return { pages: [] };
    }
    return createTikTokStyleCaptions({
      captions: adjustedCaptions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });
  }, [adjustedCaptions]);

  const currentTimeMs = (frame / fps) * 1000;

  // Find the current page
  const currentPage = pages.find((page, index) => {
    const nextPage = pages[index + 1];
    const pageEndMs = nextPage
      ? nextPage.startMs
      : page.startMs + SWITCH_CAPTIONS_EVERY_MS;
    return currentTimeMs >= page.startMs && currentTimeMs < pageEndMs;
  });

  if (!currentPage) {
    return null;
  }

  // Combine tokens into display text
  const displayText = currentPage.tokens.map((t) => t.text).join("");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 48,
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.6)",
          maxWidth: "80%",
          lineHeight: 1.3,
        }}
      >
        {displayText}
      </div>
    </AbsoluteFill>
  );
};
