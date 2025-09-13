import type { KSolanaNativeTokenMetadata } from "./solana_types";
export * from "./solana_types";

// kasssandra supported networks
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

export const KAddressKinds = ["kasssandra", "ed25519-base58"] as const;
export type KAddressKinds = (typeof KAddressKinds)[number];

export const KNetworkToAddressKindMap: Record<
    KSupportedNetworks,
    KAddressKinds
> = {
    "kasssandra devnet": "kasssandra",
    "solana devnet": "ed25519-base58",
    kasssandra: "kasssandra",
    solana: "ed25519-base58",
};

export const KNetworkToAddressKind = (network: KSupportedNetworks) => {
    return KNetworkToAddressKindMap[network];
};

export const KAddressKindToNetworksMap = Object.groupBy(
    Object.keys(KNetworkToAddressKindMap) as KSupportedNetworks[],
    (network) => KNetworkToAddressKindMap[network]
) as Record<KAddressKinds, KSupportedNetworks[]>;

export const KAddressKindToNetworks = (kind: KAddressKinds) => {
    return KAddressKindToNetworksMap[kind];
};

// types for metadata of tokens on supported networks
export type KNativeTokenMetadata = KSolanaNativeTokenMetadata | {};
