# 🚀 Launch & Test Guide

Now that your app is deployed to Vercel, follow these steps to see it live in Farcaster.

## 1. Test in Warpcast (Developer Tools)

Warpcast provides a preview tool to test frames and mini-apps before you shout them out to the world.

1.  Go to the [Farcaster Frame Preview](https://warpcast.com/~/developers/frames).
2.  Paste your Vercel URL: `https://farcaster-base-miniapp-starter-fron.vercel.app`
3.  Click **"Load"**.
4.  You should see your "Base Guestbook" frame. Click the **"Open Guestbook"** button.
5.  **Verify**: Try connecting your wallet and signing the guestbook inside the preview.

## 2. Verify your Manifest

Ensure your manifest is accessible by Farcaster's crawlers.
- Open: `https://farcaster-base-miniapp-starter-fron.vercel.app/.well-known/farcaster.json`
- You should see the JSON configuration we updated.

## 3. How to Launch (Make a Cast)

To "launch" your app, you simply need to share the URL in a Farcaster Cast.

1.  Open **Warpcast**.
2.  Start a new **Cast**.
3.  Write a cool message (e.g., "Just launched my first on-chain Guestbook on @base! Sign it here:").
4.  Paste your URL: `https://farcaster-base-miniapp-starter-fron.vercel.app`
5.  Wait a second for the **Frame Preview** to load automatically.
6.  **Cast!** 🚀

## 4. Native "Share" Button

Don't forget that we implemented a **"Share to Farcaster"** button inside your Guestbook page! 
Once a user signs, they can click that button, and it will automatically open the Warpcast composer with a link to your app.

---

### ⚠️ Troubleshooting
- **Frame doesn't load?** Check that your Vercel deployment is finished and public.
- **Wrong Network?** Remember the app is on **Base Sepolia**. Ensure your mobile wallet is on that network when testing.
