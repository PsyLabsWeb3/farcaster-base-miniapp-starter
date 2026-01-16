// Home.tsx
// Landing page with hero section and CTAs - mobile-first responsive design.

import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6 md:gap-8">
            {/* Hero Section */}
            <div className="w-full bg-[#1E1E1E] border-4 border-[#0052FF] p-5 md:p-8 text-center shadow-[4px_4px_0px_0px_#0052FF] md:shadow-[8px_8px_0px_0px_#0052FF]">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mb-3 md:mb-4">
                    Welcome to the <span className="text-[#0052FF]">On-Chain</span> Guestbook
                </h1>
                <p className="text-gray-400 text-sm md:text-lg mb-5 md:mb-6">
                    Leave your mark on the Base blockchain. Forever.
                </p>
                <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center">
                    <Link
                        to="/guestbook"
                        className="w-full md:w-auto px-6 py-3 md:px-8 md:py-4 bg-[#0052FF] border-4 border-white text-white font-black uppercase text-sm md:text-base tracking-wide shadow-[4px_4px_0px_0px_#FFFFFF] hover:shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center"
                    >
                        Sign Guestbook
                    </Link>
                    <Link
                        to="/howitworks"
                        className="w-full md:w-auto px-6 py-3 md:px-8 md:py-4 bg-transparent border-4 border-[#0052FF] text-[#0052FF] font-black uppercase text-sm md:text-base tracking-wide hover:bg-[#0052FF]/10 transition-all text-center"
                    >
                        How It Works
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-[#1E1E1E] border-l-4 border-[#0052FF] p-4 md:p-6">
                    <div className="text-xl md:text-2xl mb-2">🔗</div>
                    <h3 className="font-black uppercase text-sm md:text-base mb-1 md:mb-2">On-Chain</h3>
                    <p className="text-gray-400 text-xs md:text-sm">Your message lives forever on Base blockchain.</p>
                </div>
                <div className="bg-[#1E1E1E] border-l-4 border-[#0052FF] p-4 md:p-6">
                    <div className="text-xl md:text-2xl mb-2">🚀</div>
                    <h3 className="font-black uppercase text-sm md:text-base mb-1 md:mb-2">Fast & Cheap</h3>
                    <p className="text-gray-400 text-xs md:text-sm">Base L2 means low fees and quick transactions.</p>
                </div>
                <div className="bg-[#1E1E1E] border-l-4 border-[#0052FF] p-4 md:p-6 sm:col-span-2 md:col-span-1">
                    <div className="text-xl md:text-2xl mb-2">📣</div>
                    <h3 className="font-black uppercase text-sm md:text-base mb-1 md:mb-2">Share</h3>
                    <p className="text-gray-400 text-xs md:text-sm">Cast your signature directly to Farcaster.</p>
                </div>
            </div>

            {/* Stats Preview */}
            <div className="w-full bg-[#0A0B0D] border-2 border-dashed border-gray-700 p-4 md:p-6 text-center">
                <p className="text-gray-500 uppercase font-bold text-xs md:text-sm">
                    Join the growing community of signers
                </p>
            </div>
        </div>
    );
}
