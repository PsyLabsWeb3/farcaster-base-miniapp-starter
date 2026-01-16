# Deployment Guide

This guide covers deploying the Farcaster Mini-App to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:
1. ✅ Deployed your contract to Base (Sepolia or Mainnet)
2. ✅ Updated `CONTRACT_ADDRESS` in `frontend/src/pages/Guestbook.tsx`
3. ✅ Updated Farcaster URLs in `farcaster.json` and `index.html`

## Build the Frontend

All platforms use the same build output:

```bash
cd frontend
pnpm install
pnpm build
```

This creates a `dist/` folder with static files ready for deployment.

---

## Vercel (Recommended)

### Option A: CLI Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend folder
cd frontend
vercel --prod
```

### Option B: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set root directory to `frontend`
5. Framework preset: Vite
6. Deploy!

**Settings:**
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`

---

## Netlify

### Option A: Drag & Drop
1. Run `pnpm build` in `frontend/`
2. Go to [netlify.com](https://netlify.com)
3. Drag `dist/` folder to the deploy zone

### Option B: CLI Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy --dir=dist --prod
```

### Option C: GitHub Integration
1. Connect your GitHub repo on Netlify
2. Configure:
   - Base directory: `frontend`
   - Build command: `pnpm build`
   - Publish directory: `frontend/dist`

---

## Cloudflare Pages

### Via Dashboard
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > Pages
2. Create a project from GitHub
3. Configure:
   - Framework preset: Vite
   - Root directory: `frontend`
   - Build command: `pnpm build`
   - Build output directory: `dist`

### Via Wrangler CLI
```bash
# Install Wrangler
npm i -g wrangler

# Deploy
cd frontend
pnpm build
wrangler pages deploy dist --project-name=my-guestbook
```

---

## GitHub Pages

### Using GitHub Actions

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write

    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install and Build
        run: |
          cd frontend
          pnpm install
          pnpm build
          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/dist
          
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

**Note:** Enable GitHub Pages in repository settings (Settings > Pages > Source: GitHub Actions)

---

## Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
cd frontend
railway init
railway up
```

Configure in dashboard:
- Build Command: `pnpm build`
- Start Command: `npx serve dist`

---

## Any Static Host

The `dist/` folder contains pure static files (HTML, CSS, JS). You can host it on:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- DigitalOcean App Platform
- Surge.sh
- Your own Nginx/Apache server

### Basic Nginx Config
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/guestbook/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] App loads correctly at your URL
- [ ] Wallet connection works
- [ ] Contract interactions work (sign guestbook)
- [ ] Share to Farcaster works
- [ ] Farcaster manifest loads: `https://your-url/.well-known/farcaster.json`
- [ ] Test in [Farcaster Mini-App Preview](https://farcaster.xyz/~/developers/mini-apps/preview)

---

## Custom Domain

Most platforms support custom domains:

1. Add your domain in the platform dashboard
2. Configure DNS:
   - **A Record**: Point to platform IP
   - **CNAME**: Point to platform subdomain
3. Enable HTTPS (usually automatic)
4. Update Farcaster URLs to use your custom domain

---

## Environment Variables

For platforms that support environment variables, you may optionally set:

| Variable | Description |
|----------|-------------|
| `VITE_CONTRACT_ADDRESS` | Override contract address at build time |

**Note:** Since this is a static site, env vars are baked in at build time.
