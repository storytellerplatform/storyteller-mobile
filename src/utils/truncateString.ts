export default function truncateString(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.slice(0, maxLength - suffix.length) + suffix;
  }
}