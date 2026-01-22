import { AbsoluteFill, Img, staticFile } from "remotion";
import { Video } from "@remotion/media";

export const RemotionTweet: React.FC = () => {
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
          top: 446,
          left: 24,
          width: 1131,
          height: 443,
          objectFit: "contain",
          borderRadius: 12,
        }}
      />
    </AbsoluteFill>
  );
};
