import { Series, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";

export type VideoSequenceProps = {
  videos: Array<{
    src: string;
    durationInFrames: number;
    trimStartFrame: number;
    trimEndFrame: number;
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
        </Series.Sequence>
      ))}
    </Series>
  );
};
