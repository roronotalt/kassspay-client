import type { KSolanaNativeTokenMetadata } from "./solana";
export * from "./solana";

export const KVerificationStatuses = [
    "kasssandra",
    "verified",
    "pending",
    "rejected",
    "unverified",
    "deleted",
    "scam",
] as const;
export type KVerificationStatuses = (typeof KVerificationStatuses)[number];

export type KTokenMetadata = {
    id: number;
    verification_status: (typeof KVerificationStatuses)[number];
    name: string;
    description: string | null;
    ticker: string;
    precision: number;
    light_uri: string | null;
    dark_uri: string | null;
    kn_managed: boolean;
};

// types for metadata of tokens on supported networks
export type KNativeTokenMetadata = KSolanaNativeTokenMetadata | {};
