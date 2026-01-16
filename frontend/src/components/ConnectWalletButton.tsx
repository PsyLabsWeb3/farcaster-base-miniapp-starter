// ConnectWalletButton.tsx
// Reusable component for wallet connection and disconnection.
// Uses Wagmi hooks to manage wallet state and network switching.

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { Spinner } from "./Spinner";

export default function ConnectWalletButton({ className = "" }: { className?: string }) {
    const { isConnected, address, chainId } = useAccount();
    const { connect, connectors, status } = useConnect();
    const { disconnect } = useDisconnect();
    const { chains, switchChain, isPending: isSwitching } = useSwitchChain();

    const handleConnect = () => {
        if (connectors.length > 0) {
            connect({ connector: connectors[0] });
        }
    };

    if (isConnected) {
        // Check if the current chain is supported
        const isSupported = chains.some((c) => c.id === chainId);

        if (!isSupported) {
            return (
                <button
                    onClick={() => switchChain({ chainId: chains[0].id })}
                    disabled={isSwitching}
                    className={`flex items-center gap-2 bg-[#FF4D4D] border-2 border-white px-3 py-2 text-white font-mono text-xs font-bold uppercase hover:bg-[#FF0000] transition-all ${className}`}
                    title="Switch Network"
                >
                    {isSwitching ? (
                        <>
                            <Spinner size="sm" />
                            <span>Switching...</span>
                        </>
                    ) : (
                        <span>Wrong Network</span>
                    )}
                </button>
            );
        }

        return (
            <button
                onClick={() => disconnect()}
                className={`flex items-center gap-2 bg-[#0A0B0D] border-2 border-[#0052FF] px-3 py-2 text-white font-mono text-xs font-bold uppercase hover:bg-[#0052FF] hover:text-white transition-all ${className}`}
                title="Disconnect Wallet"
            >
                <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse"></span>
                {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
        );
    }

    return (
        <button
            onClick={handleConnect}
            disabled={status === "pending"}
            className={`flex items-center justify-center gap-2 bg-white border-2 border-[#0052FF] text-black font-black uppercase text-xs px-4 py-2 shadow-[2px_2px_0px_0px_#0052FF] hover:shadow-[1px_1px_0px_0px_#0052FF] hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {status === "pending" ? (
                <>
                    <Spinner size="sm" />
                    <span>Connecting...</span>
                </>
            ) : (
                "Connect Wallet"
            )}
        </button>
    );
}
