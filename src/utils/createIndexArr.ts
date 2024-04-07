export default function createIdxArray(id: number): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= id; i++) {
        arr.push(i);
    }
    return arr;
}