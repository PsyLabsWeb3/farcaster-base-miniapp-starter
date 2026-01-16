# Common Modification Tasks

> Step-by-step guides for common changes.

---

## Task: Deploy Contract to Base Sepolia (Testnet)

**Goal:** Deploy the Guestbook contract to Base Sepolia for testing.

### Prerequisites

- Wallet with Base Sepolia ETH (get from [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia))
- Private key of deployer wallet

### Step-by-Step

**Step 1: Configure environment**

Create `packages/contracts/.env`:
```env
PRIVATE_KEY=your_private_key_without_0x_prefix
```

**Step 2: Uncomment network config**

Edit `packages/contracts/hardhat.config.ts`, uncomment:
```typescript
baseSepolia: {
  url: "https://sepolia.base.org",
  accounts: [process.env.PRIVATE_KEY || ""]
}
```

**Step 3: Compile contracts**
```bash
cd packages/contracts
npx hardhat compile
```

**Step 4: Deploy**
```bash
npx hardhat run scripts/deploy.ts --network baseSepolia
```

**Step 5: Copy deployed address**

Update `frontend/src/pages/Guestbook.tsx`:
```typescript
const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_ADDRESS";
```

**Step 6: Copy ABI to frontend**
```bash
cp packages/contracts/artifacts/contracts/Guestbook.sol/Guestbook.json frontend/src/abi/
```

### Verify Deployment

Check on [Base Sepolia Explorer](https://sepolia.basescan.org/):
```
https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
```

---

## Task: Run Contract Tests

**Goal:** Test the Guestbook contract locally.

### Step-by-Step

**Step 1: Create test file**

Create `packages/contracts/test/Guestbook.test.ts`:
```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Guestbook", function () {
  it("Should allow signing the guestbook", async function () {
    const Guestbook = await ethers.getContractFactory("Guestbook");
    const guestbook = await Guestbook.deploy();
    
    await guestbook.signBook("Hello World!");
    
    const total = await guestbook.getTotalSignatures();
    expect(total).to.equal(1);
  });

  it("Should reject empty messages", async function () {
    const Guestbook = await ethers.getContractFactory("Guestbook");
    const guestbook = await Guestbook.deploy();
    
    await expect(guestbook.signBook("")).to.be.revertedWith("Message cannot be empty");
  });

  it("Should return last signatures", async function () {
    const Guestbook = await ethers.getContractFactory("Guestbook");
    const guestbook = await Guestbook.deploy();
    
    await guestbook.signBook("First");
    await guestbook.signBook("Second");
    
    const entries = await guestbook.getLastSignatures(2);
    expect(entries.length).to.equal(2);
    expect(entries[0].message).to.equal("Second"); // Newest first
  });
});
```

**Step 2: Run tests**
```bash
cd packages/contracts
npx hardhat test
```

### Expected Output
```
Guestbook
  ✔ Should allow signing the guestbook
  ✔ Should reject empty messages
  ✔ Should return last signatures

3 passing
```

---

## Task: Test Locally in Farcaster (with ngrok)

**Goal:** Preview and test your mini-app inside the actual Farcaster environment.

### Prerequisites

- [ngrok](https://ngrok.com/) installed and authenticated
- Frontend dev server running

### Step-by-Step

**Step 1: Start the frontend**
```bash
cd frontend
pnpm dev
```

**Step 2: Start ngrok tunnel**
```bash
ngrok http 5173
```

**Step 3: Get your ngrok URL**
ngrok will display:
```
Forwarding  https://a1b2-xxx.ngrok.app -> http://localhost:5173
```

**Step 4: Update Farcaster manifest**

Edit `frontend/public/.well-known/farcaster.json`:
```json
{
  "frame": {
    "homeUrl": "https://a1b2-xxx.ngrok.app",
    "iconUrl": "https://a1b2-xxx.ngrok.app/icon.png",
    "splashImageUrl": "https://a1b2-xxx.ngrok.app/splash.png"
  }
}
```

**Step 5: Update frame meta tag**

Edit `frontend/index.html`, update URLs in `<meta name="fc:frame">`.

**Step 6: Test in Farcaster**

Go to: https://farcaster.xyz/~/developers/mini-apps/preview

### After Testing: Revert Changes!

```bash
git checkout frontend/public/.well-known/farcaster.json
git checkout frontend/index.html
```

---

## Task: Deploy to Production (Base Mainnet)

**Goal:** Deploy the app for real users.

### Step-by-Step

**Step 1: Configure mainnet in Hardhat**

Edit `packages/contracts/hardhat.config.ts`, uncomment:
```typescript
base: {
  url: "https://mainnet.base.org",
  accounts: [process.env.PRIVATE_KEY || ""]
}
```

**Step 2: Deploy contract to Base**
```bash
cd packages/contracts
npx hardhat run scripts/deploy.ts --network base
```

**Step 3: Update contract address**

Edit `frontend/src/pages/Guestbook.tsx`:
```typescript
const CONTRACT_ADDRESS = "0xYOUR_MAINNET_CONTRACT_ADDRESS";
```

**Step 4: Copy ABI**
```bash
cp packages/contracts/artifacts/contracts/Guestbook.sol/Guestbook.json frontend/src/abi/
```

**Step 5: Update Farcaster URLs**

Edit `frontend/public/.well-known/farcaster.json`:
```json
{
  "frame": {
    "homeUrl": "https://your-production-url.com",
    "iconUrl": "https://your-production-url.com/icon.png",
    "splashImageUrl": "https://your-production-url.com/splash.png"
  }
}
```

**Step 6: Update index.html meta tags**

Replace all `YOUR_APP_URL` placeholders.

**Step 7: Build and deploy**
```bash
cd frontend
pnpm build
# Deploy dist/ folder to Vercel, Netlify, etc.
```

### Verify

1. Visit your production URL
2. Connect wallet (should prompt for Base network)
3. Sign the guestbook
4. Share to Farcaster

---

## Task: Update Frontend Styling

**Goal:** Change colors, layout, or design.

### Files to Modify

| File | Purpose |
|------|---------|
| `frontend/src/components/Layout.tsx` | Navbar, footer, global layout |
| `frontend/src/pages/*.tsx` | Individual page styling |
| `frontend/tailwind.config.ts` | Custom colors/themes |
| `frontend/src/index.css` | Global CSS variables |

### Key Colors Used

```
#0A0B0D  ← Background (dark)
#1E1E1E  ← Card background
#0052FF  ← Base blue (accent)
#F7D731  ← Psy_Labs yellow
#FFFFFF  ← White text/borders
```

### Adding Custom Colors

Edit `frontend/tailwind.config.ts`:
```typescript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#your-color',
          accent: '#your-color',
        }
      }
    }
  }
}
```
