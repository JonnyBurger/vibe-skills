import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

export type MediaMetadata = {
  durationInSeconds: number;
};

export const getMediaMetadata = async (src: string): Promise<MediaMetadata> => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  const durationInSeconds = await input.computeDuration();

  return {
    durationInSeconds,
  };
};
