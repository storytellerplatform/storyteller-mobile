export default function createIdxArray(id: number): number[] {
    const arr: number[] = [];
    for (let i = 0; i <= id; i++) {
        arr.push(i);
    }
    return arr;
}