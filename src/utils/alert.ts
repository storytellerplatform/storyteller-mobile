import { Alert } from "react-native";

export const unableFetchBook = () => {
  Alert.alert('Error', 'Unable to fetch book');
};

export const unableFetchBookContent = () => {
  Alert.alert('Error', 'Unable to fetch book content');
};

export const bookNotFound = () => {
  Alert.alert('Error', 'Book not found');
};