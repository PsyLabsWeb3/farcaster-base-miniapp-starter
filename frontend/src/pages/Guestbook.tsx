// Guestbook.tsx
// Guestbook page with toast notifications and loading states.

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import GuestbookAbi from "../abi/Guestbook.json";
import { publicClient } from "../hooks/usePublicClient";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import { Spinner } from "../components/Spinner";

// Address of the deployed Guestbook contract
// Update this after deploying your own contract
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

type GuestbookEntry = {
    signer: string;
    message: string;
    timestamp: string;
};

export default function Guestbook() {
    const { isConnected, address } = useAccount();
    const { connect, connectors, error, status } = useConnect();
    const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isSigned } = useWaitForTransactionReceipt({
        hash: txHash as `0x${string}` | undefined,
    });

    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [loadingEntries, setLoadingEntries] = useState(false);
    const [message, setMessage] = useState("");

    // Toast notifications
    const { toasts, removeToast, success, error: showError, info } = useToast();

    const fetchEntries = async () => {
        setLoadingEntries(true);
        try {
            try {
                const data = await publicClient.readContract({
                    address: CONTRACT_ADDRESS as `0x${string}`,
                    abi: GuestbookAbi.abi,
                    functionName: "getLastSignatures",
                    args: [20n],
                }) as any[];

                const formattedEntries = data.map((entry: any) => ({
                    signer: entry.signer,
                    message: entry.message,
                    timestamp: new Date(Number(entry.timestamp) * 1000).toLocaleString(),
                }));

                setEntries(formattedEntries);
            } catch (readError) {
                console.warn("Could not read from contract helper, trying events...", readError);
                const eventSig = GuestbookAbi.abi.find(
                    (e: any) => e.type === "event" && e.name === "NewSignature"
                );
                if (!eventSig) throw new Error("Event signature not found");

                const logs = await publicClient.getLogs({
                    address: CONTRACT_ADDRESS as `0x${string}`,
                    event: eventSig as any,
                    fromBlock: 0n,
                    toBlock: 'latest',
                });

                const logEntries = logs.map((log: any) => ({
                    signer: log.args.signer,
                    message: log.args.message,
                    timestamp: new Date(Number(log.args.timestamp) * 1000).toLocaleString(),
                })).reverse();

                setEntries(logEntries);
            }
        } catch (err) {
            console.error("Error fetching guestbook entries:", err);
        }
        setLoadingEntries(false);
    };

    // Show toasts based on transaction state
    useEffect(() => {
        if (isSigned) {
            success("Message signed successfully! 🎉");
            setMessage("");
        }
    }, [isSigned]);

    useEffect(() => {
        if (writeError) {
            showError(writeError.message.slice(0, 100));
        }
    }, [writeError]);

    useEffect(() => {
        if (isConnected) {
            info("Wallet connected!");
        }
    }, [isConnected]);

    useEffect(() => {
        fetchEntries();
    }, [isConnected, isSigned]);

    const handleSign = () => {
        if (!message.trim()) return;
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: GuestbookAbi.abi,
            functionName: "signBook",
            args: [message],
        });
    };

    const handleShare = () => {
        sdk.actions.composeCast({
            text: `I just signed the on-chain Guestbook!`,
        });
        success("Opening Farcaster...");
    };

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 md:gap-6">
            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Header */}
            <div className="w-full bg-[#1E1E1E] border-4 border-[#0052FF] p-4 md:p-6 text-center shadow-[4px_4px_0px_0px_#0052FF] md:shadow-[8px_8px_0px_0px_#0052FF]">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">Sign the Guestbook</h1>
                <p className="text-gray-400 text-xs md:text-sm">Leave your mark on the blockchain forever.</p>
            </div>

            {/* Action Area */}
            <div className="w-full bg-[#1E1E1E] border-4 border-[#0052FF] p-4 md:p-6 shadow-[4px_4px_0px_0px_#0052FF] md:shadow-[8px_8px_0px_0px_#0052FF] flex flex-col gap-3 md:gap-4">
                {!isConnected ? (
                    <button
                        className="w-full px-4 py-3 md:px-6 bg-[#0052FF] border-4 border-white text-white font-black uppercase text-sm md:text-base tracking-wide shadow-[4px_4px_0px_0px_#FFFFFF] hover:shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                        disabled={status === 'pending' || !connectors.length}
                        onClick={() => connect({ connector: connectors[0] })}
                    >
                        {status === 'pending' ? (
                            <>
                                <Spinner size="sm" />
                                <span>Connecting...</span>
                            </>
                        ) : (
                            'Connect Wallet'
                        )}
                    </button>
                ) : (
                    <>
                        <div className="w-full bg-[#0A0B0D] border-2 border-[#0052FF] p-2 mb-1 md:mb-2">
                            <span className="block w-full truncate font-mono text-[#0052FF] text-[10px] md:text-xs" title={address}>
                                ✓ Connected: {address}
                            </span>
                        </div>

                        <textarea
                            className="w-full bg-[#0A0B0D] border-2 border-[#0052FF] p-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] resize-none"
                            placeholder="Type your message here..."
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isPending || isConfirming || isSigned}
                        />

                        <button
                            className="w-full px-4 py-3 md:px-6 bg-[#0052FF] border-4 border-white text-white font-black uppercase text-sm md:text-base tracking-wide shadow-[4px_4px_0px_0px_#FFFFFF] hover:shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            onClick={handleSign}
                            disabled={isPending || isConfirming || isSigned || !message.trim()}
                        >
                            {isPending ? (
                                <>
                                    <Spinner size="sm" />
                                    <span>Signing...</span>
                                </>
                            ) : isConfirming ? (
                                <>
                                    <Spinner size="sm" />
                                    <span>Confirming...</span>
                                </>
                            ) : isSigned ? (
                                '✓ Signed!'
                            ) : (
                                'Sign Guestbook'
                            )}
                        </button>

                        {isSigned && (
                            <button
                                className="w-full px-4 py-3 md:px-6 bg-white border-4 border-[#0052FF] text-[#0A0B0D] font-black uppercase text-sm md:text-base tracking-wide shadow-[4px_4px_0px_0px_#0052FF] hover:shadow-[2px_2px_0px_0px_#0052FF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                onClick={handleShare}
                            >
                                Share to Farcaster
                            </button>
                        )}
                    </>
                )}
                {error && <div className="bg-[#FF4D4D] border-2 border-white p-2 font-bold text-white text-xs md:text-sm">{error.message}</div>}
            </div>

            {/* Guestbook Wall */}
            <div className="w-full">
                <h2 className="text-lg md:text-xl font-black mb-3 md:mb-4 text-white uppercase border-b-4 border-[#0052FF] pb-2 inline-block pr-6 md:pr-8">Recent Signatures</h2>

                {loadingEntries ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                        <Spinner size="lg" />
                        <span className="text-[#0052FF] font-bold uppercase text-sm">Loading Wall...</span>
                    </div>
                ) : entries.length > 0 ? (
                    <div className="flex flex-col gap-3 md:gap-4">
                        {entries.map((entry, idx) => (
                            <div key={idx} className="bg-[#0A0B0D] border-l-4 border-[#0052FF] p-3 md:p-4 shadow-[2px_2px_0px_0px_#1E1E1E] md:shadow-[4px_4px_0px_0px_#1E1E1E]">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                                    <div className="font-mono text-[10px] md:text-xs text-[#0052FF] bg-[#1E1E1E] px-2 py-1 truncate max-w-full sm:max-w-[150px]">{entry.signer}</div>
                                    <div className="text-gray-500 text-[9px] md:text-[10px] uppercase font-bold">{entry.timestamp}</div>
                                </div>
                                <p className="text-white text-base md:text-lg font-bold break-words">"{entry.message}"</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 font-bold text-center uppercase border-2 border-dashed border-gray-700 p-6 md:p-8 text-sm">
                        Be the first to sign!
                    </div>
                )}
            </div>
        </div>
    );
}
