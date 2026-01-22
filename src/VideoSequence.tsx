import { Series, useVideoConfig, AbsoluteFill } from "remotion";
import { Video } from "@remotion/media";
import { Caption } from "@remotion/captions";
import { Subtitles } from "./Subtitles";

export type VideoSequenceProps = {
  videos: Array<{
    src: string;
    durationInFrames: number;
    trimStartFrame: number;
    trimEndFrame: number;
    trimStartMs: number;
    trimEndMs: number;
    captions: Caption[];
  }>;
};

export const VideoSequence: React.FC<VideoSequenceProps> = ({ videos }) => {
  const { fps } = useVideoConfig();

  return (
    <Series>
      {videos.map((video) => (
        <Series.Sequence
          key={video.src}
          durationInFrames={video.durationInFrames}
          premountFor={fps}
        >
          <AbsoluteFill>
            <Video
              src={video.src}
              trimBefore={video.trimStartFrame}
              trimAfter={video.trimEndFrame}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Subtitles
              captions={video.captions}
              trimStartMs={video.trimStartMs}
              trimEndMs={video.trimEndMs}
            />
          </AbsoluteFill>
        </Series.Sequence>
      ))}
    </Series>
  );
};
