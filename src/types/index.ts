import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageSourcePropType } from "react-native";

// Page Types
export type RootStackParamList = {
  Home: undefined,
  Library: undefined,
  Search: undefined,
  Rank: undefined,
  Profile: undefined,
  Reading: { id: String, chapter: string, url: string },
  BookInfo: { id: String },
  Tests: undefined,
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type HomeStackProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type LibraryStackProps = NativeStackScreenProps<RootStackParamList, 'Library'>;
export type SearchStackProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
export type RankStackProps = NativeStackScreenProps<RootStackParamList, 'Rank'>;
export type ProfileStackProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;
export type ReadingStackProps = NativeStackScreenProps<RootStackParamList, 'Reading'>;
export type BookInfoStackProps = NativeStackScreenProps<RootStackParamList, 'BookInfo'>;

export type LayoutStackProps = NativeStackScreenProps<RootStackParamList, 'Home' | 'Profile' | 'Search' | 'Rank' | 'Library' | 'BookInfo'>;
export type BookListStackProps = NativeStackScreenProps<RootStackParamList, 'Library'>;

// Components
export interface ChapterProps {
  cid: string | null;
  name: string;
  url: string;
};

export interface BookProps {
  title: string;
  img: string;
  brife_content: string;
  content: {
    [volume: string]: Array<ChapterProps>;
  };
}

export interface BookInfoProps {
  id: string;
  title: string;
  img: string;
  url: string;
  subtitle: string;
};

export type AllChapterProp = { [volume: string]: Array<ChapterProps> };

export interface BookContentProps {
  id: string;
  content: {
    [volume: string]: Array<ChapterProps>;
  };
}; 