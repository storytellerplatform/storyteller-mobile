import { Alert } from "react-native";

export default function getcIdFromUrl (url: string)  {
  const aidRegex = /cid=(\d+)/;
  const match = url.match(aidRegex);
  if (match && match[1]) {
    return match[1].toString();
  } else {
    Alert.alert('aid value not found');
    return null;
  }
};