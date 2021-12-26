export default (word) => {
    if (word === undefined || word === null) return "orange"

    const alphabet = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5,
        g: 6,
        h: 7,
        i: 8,
        j: 9,
        k: 10,
        l: 11,
        m: 12,
        n: 13,
        o: 14,
        p: 15,
        q: 16,
        r: 17,
        s: 18,
        t: 19,
        u: 20,
        v: 21,
        w: 22,
        x: 23,
        y: 24,
        z: 25,
    }
    const numbers = []

    const chararray = [...word]
    const odd = []
    const even = []

    for (let i = 0; i < chararray.length; i++) {
        if (i % 2 == 0) {
            even.push(chararray[i])
        } else {
            odd.push(chararray[i])
        }
    }
    const mixedchars = [...odd, ...even]
    for (let char of mixedchars) {
        const number = alphabet[char.toLowerCase()]
        if (number) {
            numbers.push(number)
        } else {
            numbers.push(0)
        }
    }

    let numberFromArray = parseInt(numbers.join("")) * 0.98987
    for (;;) {
        if (numberFromArray > 360) {
            numberFromArray = numberFromArray / 6.78
        } else {
            break
        }
    }

    const h = numberFromArray.toFixed(0)
    const s = 30
    const l = 70 / 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = (n) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0") // convert to Hex and prefix "0" if needed
    }
    return `#${f(0)}${f(8)}${f(4)}`
}
