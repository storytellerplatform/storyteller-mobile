import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Page Types
export type RootStackParamList = {
  Home: undefined,
  Library: undefined,
  Search: undefined,
  Rank: undefined,
  Profile: undefined,
  Reading: { id: String },
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

export type LayoutStackProps = NativeStackScreenProps<RootStackParamList, 'Home' | 'Profile' | 'Search' | 'Rank' | 'Library'>;
export type BookListStackProps = NativeStackScreenProps<RootStackParamList, 'Library'>;

// Components
export type BookType = {
  id: string;
  title: string;
  author: string;
  subtitle: string;
  imageUrl: string;
  content: string[][];
};

export type StoryType = {
  id: string;
  title: string;
  img: string;
  brife_content: string;
  content: string;
};