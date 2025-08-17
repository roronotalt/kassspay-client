import { KSupportedNetworks, KNetworkToAddressKind } from "../networks";

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
