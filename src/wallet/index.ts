export const KWalletTypes = ["user", "developer", "project"] as const;
export type KWalletTypes = (typeof KWalletTypes)[number];
