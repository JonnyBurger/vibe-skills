import { AbsoluteFill, Img, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { visualControl } from "@remotion/studio";

export const RemotionTweet: React.FC = () => {
  const top = visualControl("video-top", 734);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding: 20,
          backgroundColor: "#ffffff",
          borderRadius: 24,
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 1178,
            height: 1754,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
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
              borderRadius: 30,
              border: "2px solid rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
