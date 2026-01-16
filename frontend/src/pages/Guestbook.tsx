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
import { useFarcasterProfile } from "../hooks/useFarcasterProfile";
import { baseSepolia } from "../viemChains";

// Address of the deployed Guestbook contract
// Update this after deploying your own contract
const CONTRACT_ADDRESS = "0x840417f643A9f35b0Fa435E8bf98CE335B2BF879";

type GuestbookEntry = {
    signer: string;
    message: string;
    timestamp: string;
};

const SignerProfile = ({ address: signerAddress }: { address: string }) => {
    const { address: currentAccountAddress } = useAccount();
    const { profile, loading } = useFarcasterProfile(signerAddress);
    const [sdkProfile, setSdkProfile] = useState<{ username: string, pfpUrl: string } | null>(null);

    useEffect(() => {
        const fetchContext = async () => {
            try {
                // If this is the current user's address, we can use their SDK profile immediately
                const isMe = currentAccountAddress && currentAccountAddress.toLowerCase() === signerAddress.toLowerCase();

                if (isMe) {
                    const context = await sdk.context;
                    if (context?.user) {
                        setSdkProfile({
                            username: context.user.username,
                            pfpUrl: context.user.pfpUrl || ""
                        });
                    }
                }
            } catch (e) {
                console.warn("Could not load SDK context in SignerProfile", e);
            }
        };
        fetchContext();
    }, [signerAddress, currentAccountAddress]);

    const displayUsername = sdkProfile?.username || profile.username;
    const displayPfp = sdkProfile?.pfpUrl || profile.pfpUrl;

    if (loading && !displayUsername) {
        return <div className="font-mono text-[10px] md:text-xs text-gray-400 bg-[#1E1E1E] px-2 py-1 animate-pulse">Resolving...</div>;
    }

    if (displayUsername) {
        return (
            <div className="flex items-center gap-2 bg-[#1E1E1E] px-2 py-1 border border-[#0052FF]/30">
                {displayPfp && (
                    <img
                        src={displayPfp}
                        alt={displayUsername}
                        className="w-5 h-5 rounded-full border border-[#0052FF] object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                )}
                <span className="font-mono text-[10px] md:text-xs text-[#0052FF] font-black">
                    @{displayUsername}
                </span>
            </div>
        );
    }

    // Fallback to truncated address with a cleaner design
    return (
        <div className="font-mono text-[10px] md:text-xs text-[#0052FF] bg-[#1E1E1E] px-2 py-1 border border-[#0052FF]/20 truncate">
            {signerAddress.slice(0, 6)}...{signerAddress.slice(-4)}
        </div>
    );
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
        fetchEntries();
    }, [isConnected, isSigned]);

    const handleSign = () => {
        if (!message.trim()) return;
        writeContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: GuestbookAbi.abi,
            functionName: "signBook",
            args: [message],
            chainId: baseSepolia.id,
        });
    };

    const handleShare = () => {
        sdk.actions.composeCast({
            text: `Just signed the guestbook on @base Sepolia! 🔵\n\nLeave your mark here: https://farcaster-base-miniapp-starter-fron.vercel.app`,
        });
        success("Opening Farcaster...");
    };

    const handleShareX = () => {
        const text = encodeURIComponent(`Just signed the guestbook on @base Sepolia! 🔵\n\nLeave your mark here: https://farcaster-base-miniapp-starter-fron.vercel.app`);
        window.open(`https://x.com/intent/post?text=${text}`, '_blank');
        success("Opening X...");
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
                            <div className="flex flex-col gap-2">
                                <button
                                    className="w-full px-4 py-3 md:px-6 bg-[#7C65C1] border-4 border-white text-white font-black uppercase text-sm md:text-base tracking-wide shadow-[4px_4px_0px_0px_#FFFFFF] hover:shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                    onClick={handleShare}
                                >
                                    Share to Farcaster
                                </button>
                                <button
                                    className="w-full px-4 py-3 md:px-6 bg-[#000000] border-4 border-white text-white font-black uppercase text-sm md:text-base tracking-wide shadow-[4px_4px_0px_0px_#FFFFFF] hover:shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                    onClick={handleShareX}
                                >
                                    Share to X (Twitter)
                                </button>
                            </div>
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
                                    <SignerProfile address={entry.signer} />
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
