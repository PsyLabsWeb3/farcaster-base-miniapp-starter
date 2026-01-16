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

        const normalizedAddress = address.toLowerCase();

        if (cache[normalizedAddress]) {
            setProfile(cache[normalizedAddress]);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                // We'll try a very reliable public Hub that often has good CORS support
                // Standard Crypto's Hub is a good candidate
                const hubUrl = 'https://hub.farcaster.standardcrypto.vc:2281';

                const response = await fetch(`${hubUrl}/v1/verificationsByAddress?address=${normalizedAddress}`);

                if (!response.ok) throw new Error(`Hub API error: ${response.status}`);

                const data = await response.json();

                if (data.messages && data.messages.length > 0) {
                    const fid = data.messages[0].data.fid;

                    // Fetch user data (Username and PFP)
                    const userResponse = await fetch(`${hubUrl}/v1/userDataByFid?fid=${fid}`);
                    const userData = await userResponse.json();

                    if (userData.messages) {
                        const usernameMsg = userData.messages.find((m: any) => m.data.userDataBody.type === 'USER_DATA_TYPE_USERNAME');
                        const pfpMsg = userData.messages.find((m: any) => m.data.userDataBody.type === 'USER_DATA_TYPE_PFP');

                        const newProfile = {
                            username: usernameMsg ? usernameMsg.data.userDataBody.value : null,
                            pfpUrl: pfpMsg ? pfpMsg.data.userDataBody.value : null,
                            fid: fid,
                        };
                        cache[normalizedAddress] = newProfile;
                        setProfile(newProfile);
                    }
                } else {
                    // Triggers the fallback in UI
                    setProfile({ username: null, pfpUrl: null, fid: null });
                }
            } catch (error) {
                console.warn(`Farcaster profile resolution failed for ${address}:`, error);
                setProfile({ username: null, pfpUrl: null, fid: null });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [address]);

    return { profile, loading };
}
