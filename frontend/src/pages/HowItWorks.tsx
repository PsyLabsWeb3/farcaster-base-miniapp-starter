// HowItWorks.tsx
// Explanation page - mobile-first responsive design.

import { Link } from "react-router-dom";

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Connect Your Wallet",
            description: "Link your Ethereum wallet through Farcaster or any browser wallet.",
            icon: "🔐",
        },
        {
            number: "02",
            title: "Write Your Message",
            description: "Compose the message you want to leave on the blockchain forever.",
            icon: "✍️",
        },
        {
            number: "03",
            title: "Sign the Transaction",
            description: "Confirm the transaction to record your message on Base.",
            icon: "📝",
        },
        {
            number: "04",
            title: "Share to Farcaster",
            description: "Let everyone know you signed! Cast your signature directly.",
            icon: "📣",
        },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5 md:gap-8">
            {/* Header */}
            <div className="w-full bg-[#1E1E1E] border-4 border-[#0052FF] p-5 md:p-8 text-center shadow-[4px_4px_0px_0px_#0052FF] md:shadow-[8px_8px_0px_0px_#0052FF]">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">How It Works</h1>
                <p className="text-gray-400 text-sm md:text-base">Sign the guestbook in 4 simple steps.</p>
            </div>

            {/* Steps */}
            <div className="w-full flex flex-col gap-3 md:gap-4">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className="w-full bg-[#1E1E1E] border-l-4 border-[#0052FF] p-4 md:p-6 flex gap-4 md:gap-6 items-start hover:bg-[#252525] transition-colors"
                    >
                        <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-[#0052FF] flex items-center justify-center text-2xl md:text-3xl shadow-[2px_2px_0px_0px_#FFFFFF] md:shadow-[4px_4px_0px_0px_#FFFFFF]">
                            {step.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 md:gap-3 mb-1 md:mb-2">
                                <span className="text-[#0052FF] font-mono text-xs md:text-sm">{step.number}</span>
                                <h3 className="font-black uppercase text-sm md:text-lg">{step.title}</h3>
                            </div>
                            <p className="text-gray-400 text-xs md:text-base">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Technical Details */}
            <div className="w-full bg-[#0A0B0D] border-2 border-[#0052FF] p-4 md:p-6">
                <h3 className="font-black uppercase text-[#0052FF] mb-3 md:mb-4 text-sm md:text-base">Technical Details</h3>
                <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
                    <li className="flex items-start gap-2">
                        <span className="text-[#0052FF]">▸</span>
                        <span>Smart contract deployed on <strong className="text-white">Base</strong> (L2)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[#0052FF]">▸</span>
                        <span>Messages stored permanently on-chain</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[#0052FF]">▸</span>
                        <span>Low gas fees (usually less than $0.01)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[#0052FF]">▸</span>
                        <span>Farcaster integration for social sharing</span>
                    </li>
                </ul>
            </div>

            {/* CTA */}
            <Link
                to="/guestbook"
                className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-[#0052FF] border-4 border-white text-white font-black uppercase text-sm md:text-base tracking-wide shadow-[4px_4px_0px_0px_#FFFFFF] hover:shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center"
            >
                Ready to Sign →
            </Link>
        </div>
    );
}
