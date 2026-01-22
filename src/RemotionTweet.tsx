import { Img, staticFile } from "remotion";

export const RemotionTweet: React.FC = () => {
  return (
    <Img
      src={staticFile("remotion-tweet.jpg")}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};
