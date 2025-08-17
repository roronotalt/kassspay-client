// copied from https://github.com/wevm/viem/blob/main/src/utils/unit/formatUnits.ts
// MIT License

// Copyright (c) 2023-present weth, LLC

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// formatUnits(420000000000n, 9)
// '420'
export const KformatUnits = (
    value: bigint,
    precision: number,
    decimals?: number
): string => {
    let display = value.toString();

    const negative = display.startsWith("-");
    if (negative) display = display.slice(1);

    display = display.padStart(precision, "0");

    let [integer, fraction] = [
        display.slice(0, display.length - precision),
        display.slice(display.length - precision),
    ];

    fraction = fraction.replace(/(0+)$/, "");

    // truncate if positive, round up if negative
    if (decimals === 0) {
        if (negative && Number(fraction) > 0) {
            integer = `${BigInt(integer!) + 1n}`;
        }
        fraction = "";
    } else if (decimals && fraction.length > decimals) {
        const [left, unit, right] = [
            fraction.slice(0, decimals - 1),
            fraction.slice(decimals - 1, decimals),
            fraction.slice(decimals),
        ];

        if (negative && Number(right) > 0) {
            const rounded = BigInt(unit) + 1n;
            if (rounded > 9n)
                fraction = `${BigInt(left) + BigInt(1)}0`.padStart(
                    left.length + 1,
                    "0"
                );
            else fraction = `${left}${rounded}`;

            if (fraction.length > decimals) {
                fraction = fraction.slice(1);
                integer = `${BigInt(integer!) + 1n}`;
            }
        }

        fraction = fraction.slice(0, decimals);
        fraction = fraction.replace(/(0+)$/, "");
    }

    return `${negative ? "-" : ""}${integer || "0"}${
        fraction ? `.${fraction}` : ""
    }`;
};

// copied from https://github.com/wevm/viem/blob/main/src/utils/unit/parseUnits.ts
/**
 * Multiplies a string representation of a number by a given exponent of base 10 (10exponent).
 *
 * - Docs: https://viem.sh/docs/utilities/parseUnits
 *
 * @example
 * import { parseUnits } from 'viem'
 *
 * parseUnits('420', 9)
 * // 420000000000n
 */
export const KparseUnits = (value: string, decimals: number): bigint => {
    if (!/^(-?)([0-9]*)\.?([0-9]*)$/.test(value))
        throw new Error("Invalid decimal number");

    let [integer, fraction = "0"] = value.split(".");

    const negative = integer!.startsWith("-");
    if (negative) integer = integer!.slice(1);

    // trim trailing zeros.
    fraction = fraction.replace(/(0+)$/, "");

    // round off if the fraction is larger than the number of decimals.
    if (decimals === 0) {
        if (Math.round(Number(`.${fraction}`)) === 1)
            integer = `${BigInt(integer!) + 1n}`;
        fraction = "";
    } else if (fraction.length > decimals) {
        const [left, unit, right] = [
            fraction.slice(0, decimals - 1),
            fraction.slice(decimals - 1, decimals),
            fraction.slice(decimals),
        ];

        const rounded = Math.round(Number(`${unit}.${right}`));
        if (rounded > 9)
            fraction = `${BigInt(left) + BigInt(1)}0`.padStart(
                left.length + 1,
                "0"
            );
        else fraction = `${left}${rounded}`;

        if (fraction.length > decimals) {
            fraction = fraction.slice(1);
            integer = `${BigInt(integer!) + 1n}`;
        }

        fraction = fraction.slice(0, decimals);
    } else {
        fraction = fraction.padEnd(decimals, "0");
    }

    return BigInt(`${negative ? "-" : ""}${integer}${fraction}`);
};
