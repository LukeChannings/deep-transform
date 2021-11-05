export function StringReplacer(map: { [key: string]: string }) {
  return (value: string) => map[value] ?? value;
}
