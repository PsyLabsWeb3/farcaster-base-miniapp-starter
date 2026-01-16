import { useState, useEffect } from 'react';

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

        if (cache[address]) {
            setProfile(cache[address]);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                // Using Warpcast public API for reliable verification lookups
                const response = await fetch(`https://api.warpcast.com/v2/user-by-verification?address=${address.toLowerCase()}`);
                const data = await response.json();

                if (data.result && data.result.user) {
                    const newProfile = {
                        username: data.result.user.username,
                        pfpUrl: data.result.user.pfp.url,
                        fid: data.result.user.fid,
                    };
                    cache[address] = newProfile;
                    setProfile(newProfile);
                } else {
                    // Fallback if no profile is found
                    setProfile({ username: null, pfpUrl: null, fid: null });
                }
            } catch (error) {
                console.error('Error fetching Farcaster profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [address]);

    return { profile, loading };
}
