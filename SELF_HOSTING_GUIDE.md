# Zero-Cost Self-Hosting Guide

So you want to host the website yourself without relying on Vercel or Render? This is powerful but requires a specific setup.

Here is how you can host the website from **Your Own Computer** (or a dedicated server/VPS you buy later).

## Architecture
We have combined your Frontend (React) and Backend (Node.js) into a single server app.
- **Server File**: `server/server.js` now serves BOTH the API and the Website.

## Step 1: Prepare the "Live" Version
You need to build the optimized version of your website (we just did this).
1.  Open Terminal in `client` folder.
2.  Run: `npm run build`
    *   This creates a `dist` folder with the real website files.

## Step 2: Run the Production Server
1.  Open Terminal in the `server` folder.
2.  Run: `node server.js`
3.  Your website is now running at `http://localhost:3001` (Note: It's port 3001 now for the full site).

## Step 3: Expose to the Internet (The "No 3rd Party" Part)
Since you are the host, you need to let the internet see your computer.
**You have two choices:**

### Option A: Cloudflare Tunnel (Recommended, Safer)
Even though Cloudflare is a company, this tool is a "utility" to connect your domain to your laptop securely.
1.  Buy your domain (e.g., `balajikundapura.com`).
2.  Sign up for Cloudflare (Free).
3.  Install `cloudflared` on your computer.
4.  Run command: `cloudflared tunnel --url http://localhost:3001`
5.  It will give you a public URL (or you connect your domain).
*Advantage*: You don't need to mess with your WiFi router settings.

### Option B: Port Forwarding (Traditional, Advanced)
This connects the internet DIRECTLY to your PC.
1.  Log into your WiFi Router (usually `192.168.1.1`).
2.  Find **Port Forwarding**.
3.  Forward external Port `80` to your computer's IP at Port `3001`.
4.  Get your Public IP (search "what is my ip" on Google).
5.  Point your Domain's "A Record" to that IP.
*Risk*: If your home IP changes (restart router), the site goes down. You need a "Static IP" from your ISP.

## Summary
To be truly "independent":
1.  Keep your laptop on 24/7.
2.  Run `node server.js`.
3.  Buy a domain.
4.  Point the domain to your laptop using Cloudflare Tunnel.

**If you turn off your laptop, the shop closes!**
