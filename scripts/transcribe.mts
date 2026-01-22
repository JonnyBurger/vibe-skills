import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import path from "path";

const WHISPER_PATH = "./whisper.cpp";
const MODEL = "medium.en";

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

type WhisperToken = {
  text: string;
  timestamps: { from: string; to: string };
  offsets: { from: number; to: number };
  id: number;
  p: number;
};

type WhisperSegment = {
  text: string;
  timestamps: { from: string; to: string };
  offsets: { from: number; to: number };
  tokens: WhisperToken[];
};

type WhisperOutput = {
  transcription: WhisperSegment[];
};

function convertWhisperToCaptions(whisperOutput: WhisperOutput): Caption[] {
  const captions: Caption[] = [];

  for (const segment of whisperOutput.transcription) {
    const text = segment.text.trim();
    // Skip empty segments and special tokens like [BLANK_AUDIO]
    if (!text || text.startsWith("[") || text.startsWith("_")) {
      continue;
    }

    captions.push({
      text: text,
      startMs: segment.offsets.from,
      endMs: segment.offsets.to,
      timestampMs: Math.round((segment.offsets.from + segment.offsets.to) / 2),
      confidence: segment.tokens[0]?.p ?? null,
    });
  }

  return captions;
}

async function main() {
  const tempDir = "./temp-audio";
  const outputDir = "./src/captions";
  if (!existsSync(tempDir)) mkdirSync(tempDir, { recursive: true });
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const whisperBinary = path.join(WHISPER_PATH, "main");
  const modelPath = path.join(WHISPER_PATH, `ggml-${MODEL}.bin`);

  const allCaptions: Array<{
    file: string;
    captions: Caption[];
    trimStart: number;
  }> = [];

  for (const video of VIDEO_DATA) {
    const videoPath = path.join("./public", video.file);
    const audioPath = path.join(tempDir, `${video.file}.wav`);
    const jsonPath = path.join(tempDir, video.file);

    console.log(`\nProcessing ${video.file}...`);

    // Extract audio as 16kHz mono WAV (required by whisper)
    console.log("  Extracting audio...");
    execSync(
      `ffmpeg -y -i "${videoPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${audioPath}"`,
      { stdio: "pipe" }
    );

    // Transcribe using whisper binary directly
    console.log("  Transcribing...");
    execSync(
      `"${whisperBinary}" -m "${modelPath}" -f "${audioPath}" -of "${jsonPath}" --output-json-full -ml 1`,
      { stdio: "pipe" }
    );

    // Read the JSON output
    const whisperOutput: WhisperOutput = JSON.parse(
      readFileSync(`${jsonPath}.json`, "utf-8")
    );

    // Convert to captions format
    const captions = convertWhisperToCaptions(whisperOutput);

    allCaptions.push({
      file: video.file,
      captions,
      trimStart: video.trimStart,
    });

    console.log(`  Found ${captions.length} caption words`);
  }

  // Save captions
  writeFileSync(
    path.join(outputDir, "captions.json"),
    JSON.stringify(allCaptions, null, 2)
  );

  console.log("\nCaptions saved to src/captions/captions.json");

  // Keep temp files for debugging
  // execSync(`rm -rf "${tempDir}"`);
}

main().catch(console.error);
