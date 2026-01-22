import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { RemotionTweet } from "./RemotionTweet";
import { Remotion3DLogo } from "./Remotion3DLogo";

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
    </>
  );
};
