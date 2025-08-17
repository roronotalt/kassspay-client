import * as devalue from "devalue";

// stringify wrapper using svelte devalue https://github.com/sveltejs/devalue
export const Kstringify = (
    value: any,
    reducers?: Record<string, (value: any) => any>
): string => {
    return devalue.stringify(value, reducers);
};

// parse wrapper using svelte devalue https://github.com/sveltejs/devalue
export const Kparse = (
    serialized: string,
    revivers?: Record<string, (value: any) => any>
) => {
    return devalue.parse(serialized, revivers);
};

// heavily copied from https://github.com/wevm/viem/blob/main/src/utils/unit/formatUnits.ts
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

// Kasssandra supported networks
export const KSupportedDeveloperNetworks = [
    "kasssandra devnet",
    "solana devnet",
] as const;
export type KSupportedDeveloperNetworks =
    (typeof KSupportedDeveloperNetworks)[number];

export const KSupportedMainNetworks = ["kasssandra", "solana"] as const;
export type KSupportedMainNetworks = (typeof KSupportedMainNetworks)[number];

export const KSupportedNetworks = [
    ...KSupportedDeveloperNetworks,
    ...KSupportedMainNetworks,
] as const;
export type KSupportedNetworks = (typeof KSupportedNetworks)[number];

export const KAddressKinds = ["kasssandra", "solana"] as const;
export type KAddressKinds = (typeof KAddressKinds)[number];

export const KNetworkToAddressKindMap: Record<
    KSupportedNetworks,
    KAddressKinds
> = {
    "kasssandra devnet": "kasssandra",
    "solana devnet": "solana",
    kasssandra: "kasssandra",
    solana: "solana",
};

export const KNetworkToAddressKind = (network: KSupportedNetworks) => {
    return KNetworkToAddressKindMap[network];
};

export const KAddressKindToNetworksMap = Object.groupBy(
    Object.keys(KNetworkToAddressKindMap) as KSupportedNetworks[],
    (network) => KNetworkToAddressKindMap[network]
) as Record<KAddressKinds, KSupportedNetworks[]>;

export const KAddressKindToNetworks = (
    kind: KAddressKinds,
    type: "devnet" | "mainnet" | "all" = "all"
) => {
    switch (type) {
        case "devnet":
            return KAddressKindToNetworksMap[kind].filter((network) =>
                KSupportedDeveloperNetworks.find((devnet) => devnet == network)
            );
        case "mainnet":
            return KAddressKindToNetworksMap[kind].filter((network) =>
                KSupportedMainNetworks.find((mainnet) => mainnet == network)
            );
        case "all":
            return KAddressKindToNetworksMap[kind];
    }
};

export const KformatAddress = (
    address: string,
    network: KSupportedNetworks
) => {
    const network_kind = KNetworkToAddressKind(network);
    const is_hex_network = !(
        network_kind == "kasssandra" || network_kind == "solana"
    );
    return `${is_hex_network ? "0x" : ""}${address
        .replace(/^0x/i, "")
        .slice(0, 4)}...${address.slice(-4)}`;
};
