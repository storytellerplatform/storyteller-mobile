export default function replaceSpecialChars(inputString: string): string {
  // 定義要替換的特殊符號列表
  const specialChars = ['\t', '\n', '\r', '\d'];

  // 將特殊符號替換為空格
  let result = inputString;
  specialChars.forEach(char => {
    result = result.replace(new RegExp(char, 'g'), ' ');
  });

  return result;
}
