import { writeFileSync, readFileSync } from "fs";
import { createTikTokStyleCaptions } from "@remotion/captions";

const VIDEO_DATA = [
  { file: "IMG_6896.MOV", trimStart: 1.14, trimEnd: 4.23 },
  { file: "IMG_6898.MOV", trimStart: 3.09, trimEnd: 13.59 },
  { file: "IMG_6899.MOV", trimStart: 0.95, trimEnd: 7.62 },
  { file: "IMG_6900.MOV", trimStart: 0.90, trimEnd: 5.27 },
  { file: "IMG_6901.MOV", trimStart: 4.49, trimEnd: 19.23 },
];

type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};

type CaptionData = {
  file: string;
  captions: Caption[];
};

const SWITCH_CAPTIONS_EVERY_MS = 1500;

function formatSrtTime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor(ms % 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${milliseconds.toString().padStart(3, "0")}`;
}

function main() {
  const captionsData: CaptionData[] = JSON.parse(
    readFileSync("./src/captions/captions.json", "utf-8")
  );

  const srtEntries: string[] = [];
  let entryIndex = 1;
  let timeOffset = 0;

  for (const videoInfo of VIDEO_DATA) {
    const trimStartMs = videoInfo.trimStart * 1000;
    const trimEndMs = videoInfo.trimEnd * 1000;
    const trimmedDuration = trimEndMs - trimStartMs;

    const videoCaptions = captionsData.find((c) => c.file === videoInfo.file);
    if (!videoCaptions) continue;

    // Filter and adjust captions for this video segment
    const adjustedCaptions = videoCaptions.captions
      .filter((c) => c.endMs > trimStartMs && c.startMs < trimEndMs)
      .map((c) => ({
        ...c,
        startMs: Math.max(0, c.startMs - trimStartMs),
        endMs: Math.min(trimmedDuration, c.endMs - trimStartMs),
        timestampMs: c.timestampMs ? c.timestampMs - trimStartMs : null,
      }));

    if (adjustedCaptions.length === 0) {
      timeOffset += trimmedDuration;
      continue;
    }

    // Create TikTok-style pages for grouping
    const { pages } = createTikTokStyleCaptions({
      captions: adjustedCaptions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });

    // Convert pages to SRT entries
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const nextPage = pages[i + 1];

      const startMs = timeOffset + page.startMs;
      const endMs = nextPage
        ? timeOffset + nextPage.startMs
        : timeOffset + Math.min(page.startMs + SWITCH_CAPTIONS_EVERY_MS, trimmedDuration);

      const text = page.tokens.map((t) => t.text).join("").trim();

      if (text) {
        srtEntries.push(
          `${entryIndex}\n${formatSrtTime(startMs)} --> ${formatSrtTime(endMs)}\n${text}\n`
        );
        entryIndex++;
      }
    }

    timeOffset += trimmedDuration;
  }

  const srtContent = srtEntries.join("\n");
  writeFileSync("./out/VideoSequence.srt", srtContent);
  console.log("SRT file exported to ./out/VideoSequence.srt");
}

main();
