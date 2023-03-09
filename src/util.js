export function randomInt(max) {
    return Math.floor(Math.random() * max);
}

export function isSorted(list) {
    return list.every((x, i) => i === 0 || x > list[i - 1]);
}

export function one_to_n(n) {
    return [...Array(n).keys()].map(n => n + 1);
}

export function ping_pong(x, max) {
    return (x % (2 * max)) - 2 * (x % max) * (Math.floor(x / max) % 2)
}