import "./index.css";
import { Composition, CalculateMetadataFunction, staticFile } from "remotion";
import { MyComposition } from "./Composition";
import { RemotionTweet } from "./RemotionTweet";
import { Remotion3DLogo } from "./Remotion3DLogo";
import { VideoSequence, VideoSequenceProps } from "./VideoSequence";
import { getMediaMetadata } from "./get-media-metadata";

const VIDEO_FILES = [
  "IMG_6898.MOV",
  "IMG_6899.MOV",
  "IMG_6901.MOV",
  "IMG_6900.MOV",
  "IMG_6896.MOV",
];

const calculateVideoSequenceMetadata: CalculateMetadataFunction<
  VideoSequenceProps
> = async () => {
  const fps = 30;
  const videoSources = VIDEO_FILES.map((file) => staticFile(file));
  const metadataPromises = videoSources.map((src) => getMediaMetadata(src));
  const allMetadata = await Promise.all(metadataPromises);

  const videos = allMetadata.map((meta, index) => ({
    src: videoSources[index],
    durationInFrames: Math.ceil(meta.durationInSeconds * fps),
  }));

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
