import { useState, useEffect } from 'react';
import { sdk } from "@farcaster/miniapp-sdk";

export interface FarcasterProfile {
    username: string | null;
    pfpUrl: string | null;
    fid: number | null;
}

const cache: Record<string, FarcasterProfile> = {};

export function useFarcasterProfile(address: string | undefined) {
    const [profile, setProfile] = useState<FarcasterProfile>({
        username: null,
        pfpUrl: null,
        fid: null,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!address) return;

        const normalizedAddress = address.toLowerCase();

        // 1. Check Cache
        if (cache[normalizedAddress]) {
            setProfile(cache[normalizedAddress]);
            return;
        }

        // 2. Check SDK Context (Fastest for the current user)
        // Note: sdk.context is async/promise based in some versions, 
        // but often we can check if address matches the currently connected one.
        // For simplicity, we'll try the API but fallback to SDK if we can.

        const fetchProfile = async () => {
            setLoading(true);
            try {
                // Try Warpcast v2 (might work if user is in Warpcast due to cookies/session)
                // If it fails with 401, we try a public hub
                let response = await fetch(`https://api.warpcast.com/v2/user-by-verification?address=${normalizedAddress}`);

                if (response.status === 401) {
                    // Fallback to Searchcaster (it's deprecated but some endpoints still return data)
                    // or another public indexer.
                    // As a reliable fallback, we try the Hub API via a public proxy if needed.
                    // For now, let's use a known public hub that often has CORS open:
                    response = await fetch(`https://nemes.farcaster.xyz:2281/v1/verificationsByAddress?address=${normalizedAddress}`);
                }

                const data = await response.json();

                if (data.result && data.result.user) {
                    const newProfile = {
                        username: data.result.user.username,
                        pfpUrl: data.result.user.pfp.url,
                        fid: data.result.user.fid,
                    };
                    cache[normalizedAddress] = newProfile;
                    setProfile(newProfile);
                } else if (data.messages && data.messages.length > 0) {
                    // Hub API response format
                    const fid = data.messages[0].data.fid;
                    // Now fetch user data for this FID
                    const userResponse = await fetch(`https://nemes.farcaster.xyz:2281/v1/userDataByFid?fid=${fid}`);
                    const userData = await userResponse.json();

                    const usernameMessage = userData.messages.find((m: any) => m.data.userDataBody.type === 'USER_DATA_TYPE_USERNAME');
                    const pfpMessage = userData.messages.find((m: any) => m.data.userDataBody.type === 'USER_DATA_TYPE_PFP');

                    const newProfile = {
                        username: usernameMessage ? usernameMessage.data.userDataBody.value : null,
                        pfpUrl: pfpMessage ? pfpMessage.data.userDataBody.value : null,
                        fid: fid,
                    };
                    cache[normalizedAddress] = newProfile;
                    setProfile(newProfile);
                } else {
                    console.log(`No Farcaster profile found for ${address}. Ensure it's verified on-chain.`);
                    setProfile({ username: null, pfpUrl: null, fid: null });
                }
            } catch (error) {
                console.warn('Farcaster Profile API Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [address]);

    return { profile, loading };
}
