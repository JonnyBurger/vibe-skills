import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { RemotionTweet } from "./RemotionTweet";

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
        durationInFrames={90}
        fps={30}
        width={1178}
        height={1754}
      />
    </>
  );
};
