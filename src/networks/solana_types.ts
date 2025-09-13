export namespace KSolanaNativeTokenExtentions {
    export type ImmutableOwner = {};
    export type CpiGuard = {};

    export type TokenMetadata = {
        name: string;
        symbol: string;
        uri: string;
    };
}

export const KSupportedSolanaExtensions = [
    "ImmutableOwner",
    "CpiGuard",
    "TokenMetadata",
] as const;

export type KSolanaNativeTokenMetadata = {
    program_id: "spl-token" | "spl-token-2022";
    freeze_authority?: string | null;
    mint_authority?: string | null;
    extensions: Partial<
        Record<
            (typeof KSupportedSolanaExtensions)[number],
            | KSolanaNativeTokenExtentions.ImmutableOwner
            | KSolanaNativeTokenExtentions.CpiGuard
            | KSolanaNativeTokenExtentions.TokenMetadata
        >
    >;
};
