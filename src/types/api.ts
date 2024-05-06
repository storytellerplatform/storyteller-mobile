export type generateMusicRequest = {
  texts: string;
  duration: number;
};

export type ChapterResponse = {
  subtitle: string,
  url: string
}

export type BookContentResponse = {
  content: {
    [volume: string]: Array<ChapterResponse>;
  };
};