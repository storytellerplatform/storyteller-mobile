export default function getLastSegment(str: string): string {
  const lastIndex = str.lastIndexOf('_');

  if (lastIndex !== -1) {
    return str.substring(0, lastIndex);
  } else {
    return str;
  }
}