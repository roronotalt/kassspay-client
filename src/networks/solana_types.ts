export namespace KSolanaNativeTokenExtentions {
    export type ImmutableOwner = {
        type: "ImmutableOwner";
    };

    export type CpiGuard = {
        type: "CpiGuard";
    };

    export type TokenMetadata = {
        type: "TokenMetadata";
        name: string;
        symbol: string;
        uri: string;
    };

    export type TransferFeeConfig = {
        type: "TransferFeeConfig";
        basisPoints: number;
        maxFee: bigint;

        transferFeeConfigAuthority?: string | null;
        withdrawWithheldAuthority?: string | null;
    };
}

export type KSolanaNativeTokenMetadata = {
    program_id: "spl-token" | "spl-token-2022";
    freeze_authority?: string | null;
    mint_authority?: string | null;
    extensions: (
        | KSolanaNativeTokenExtentions.ImmutableOwner
        | KSolanaNativeTokenExtentions.CpiGuard
        | KSolanaNativeTokenExtentions.TokenMetadata
        | KSolanaNativeTokenExtentions.TransferFeeConfig
    )[];
};
