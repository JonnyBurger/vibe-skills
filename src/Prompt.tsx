import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Thinking } from "./Thinking";

const CHAR_FRAMES = 2;
const CURSOR_BLINK_FRAMES = 16;
const FONT_SIZE = 38;
const CHAR_WIDTH = 23; // approximate monospace character width at 38px
const CONTENT_WIDTH = 1200 - 56 * 2; // width minus horizontal padding
const LINE_HEIGHT = 50;

export type PromptProps = {
  title: string;
  thinkingIndex: number;
};

const Cursor: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <span
      style={{
        opacity,
        display: "inline-block",
        width: 20,
        height: FONT_SIZE,
        backgroundColor: "white",
        marginLeft: 4,
        verticalAlign: "text-bottom",
      }}
    />
  );
};

export const Prompt: React.FC<PromptProps> = ({ title, thinkingIndex }) => {
  const frame = useCurrentFrame();

  const typedChars = Math.min(title.length, Math.floor(frame / CHAR_FRAMES));
  const typedText = title.slice(0, typedChars);
  const isTypingComplete = typedChars >= title.length;

  // Calculate height based on full title (so it doesn't change while typing)
  const fullTextWithPrefix = "❯ " + title;
  const charsPerLine = Math.floor(CONTENT_WIDTH / CHAR_WIDTH);
  const numLines = Math.ceil(fullTextWithPrefix.length / charsPerLine);
  const textHeight = numLines * LINE_HEIGHT;

  // Total height: padding (32*2) + text + divider margin (24) + divider (4) + thinking area (~60)
  const totalHeight = 32 * 2 + textHeight + 24 + 4 + 90;

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
          backgroundColor: "#292C34",
          padding: "32px 56px",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
          width: 1200,
          height: totalHeight,
          textAlign: "left",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: FONT_SIZE,
            fontFamily: "monospace",
            fontWeight: 500,
          }}
        >
          ❯ {typedText}
        </span>
        <Cursor frame={frame} />
        <div
          style={{
            height: 4,
            backgroundColor: "#595A5F",
            marginTop: 24,
          }}
        />
        {isTypingComplete && <Thinking index={thinkingIndex} />}
      </div>
    </AbsoluteFill>
  );
};
