export function randomInt(max) {
    return Math.floor(Math.random() * max);
}

export function isSorted(list) {
    return list.every((x, i) => i === 0 || x > list[i - 1]);
}

export function one_to_n(n) {
    return [...Array(n).keys()].map(n => n + 1);
}
