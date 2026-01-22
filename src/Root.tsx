import "./index.css";
import { Composition, CalculateMetadataFunction, staticFile } from "remotion";
import { MyComposition } from "./Composition";
import { RemotionTweet } from "./RemotionTweet";
import { Remotion3DLogo } from "./Remotion3DLogo";
import { VideoSequence, VideoSequenceProps } from "./VideoSequence";

const VIDEO_DATA = [
  { file: "IMG_6898.MOV", trimStart: 3.24, trimEnd: 13.44 },
  { file: "IMG_6899.MOV", trimStart: 1.10, trimEnd: 7.47 },
  { file: "IMG_6901.MOV", trimStart: 4.64, trimEnd: 19.08 },
  { file: "IMG_6900.MOV", trimStart: 1.05, trimEnd: 5.12 },
  { file: "IMG_6896.MOV", trimStart: 1.29, trimEnd: 4.08 },
];

const calculateVideoSequenceMetadata: CalculateMetadataFunction<
  VideoSequenceProps
> = async () => {
  const fps = 30;

  const videos = VIDEO_DATA.map((data) => {
    const trimmedDuration = data.trimEnd - data.trimStart;
    return {
      src: staticFile(data.file),
      durationInFrames: Math.ceil(trimmedDuration * fps),
      trimStartFrame: Math.floor(data.trimStart * fps),
      trimEndFrame: Math.floor(data.trimEnd * fps),
    };
  });

  const totalDurationInFrames = videos.reduce(
    (sum, video) => sum + video.durationInFrames,
    0
  );

  return {
    durationInFrames: totalDurationInFrames,
    props: { videos },
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="RemotionTweet"
        component={RemotionTweet}
        durationInFrames={240}
        fps={30}
        width={1338}
        height={1914}
      />
      <Composition
        id="Remotion3DLogo"
        component={Remotion3DLogo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="VideoSequence"
        component={VideoSequence}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ videos: [] }}
        calculateMetadata={calculateVideoSequenceMetadata}
      />
    </>
  );
};
