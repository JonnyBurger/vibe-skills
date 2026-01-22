import { AbsoluteFill, Img, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { visualControl } from "@remotion/studio";

export const RemotionTweet: React.FC = () => {
  const top = visualControl("video-top", 734);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("remotion-tweet.jpg")}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      <Video
        src={staticFile("skills-video.mp4")}
        style={{
          position: "absolute",
          top,
          left: 24,
          width: 1131,
          height: 733,
          borderRadius: 12,
        }}
      />
    </AbsoluteFill>
  );
};
