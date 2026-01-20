# ☁️ How to Keep Your Shop Open 24/7 (Even if Laptop is Off)

To make your website available when your laptop is shutdown, you must move it to the **Cloud**.
I have updated your code so it works on both your laptop (with SQLite) and the Cloud (with PostgreSQL).

Follow these exact steps to deploy. **Total Cost: ₹0 (Free Tiers)**.

---

## Part 1: Save Your Code to the Internet
We need to upload your latest code to GitHub so Cloud servers can read it.

1. Open your Terminal (VS Code).
2. Run these commands:
   ```powershell
   git add .
   git commit -m "Prepare for cloud deployment"
   git push origin main
   ```
   *(If you get an error saying 'remote origin already exists' or similar, just ensure your code is on GitHub).*

---

## Part 2: Create a Cloud Database (Neon)
We cannot use the file-based database (SQLite) in the cloud because it gets deleted every time the server sleeps. We will use **Neon** (Free PostgreSQL).

1. Go to [Neon.tech](https://neon.tech) and Sign Up (Free).
2. Create a new Project (Name: `balaji-store`).
3. It will show you a **Connection String** that looks like:
   `postgres://neondb_owner:AbCd123@ep-cool-cloud.aws.neon.tech/neondb?sslmode=require`
4. **Copy this string**. You will need it in the next step.

---

## Part 3: Deploy the Backend (The Server)
We will use **Render** to run your `server` code 24/7.

1. Go to [Render.com](https://render.com) and Sign Up.
2. Click **New +** -> **Web Service**.
3. Connect your **GitHub** account and select your repository (`BALAJI PROVISIONAL STORES` or whatever you named it).
4. **Configure the settings**:
   *   **Name**: `balaji-server` (or similar)
   *   **Root Directory**: `server` (Important! Type `server` here).
   *   **Runtime**: `Node`
   *   **Build Command**: `npm install`
   *   **Start Command**: `node server.js`
   *   **Instance Type**: `Free`
5. Scroll down to **Environment Variables**. Click **Add Environment Variable**:
   *   **Key**: `DATABASE_URL`
   *   **Value**: Paste the Neon connection string from Part 2.
   *   *(Example: postgres://neondb_owner...)*
6. Click **Create Web Service**.
7. Wait ~2 minutes. Once it says "Live", copy the URL (e.g., `https://balaji-server.onrender.com`).
   *   **Test it**: Open `https://balaji-server.onrender.com/api/products` in a new tab. You should see your product JSON.

---

## Part 4: Deploy the Frontend (The Storefront)
We will use **Vercel** to host the React website.

1. Go to [Vercel.com](https://vercel.com) and Sign Up.
2. Click **Add New** -> **Project**.
3. Continue with GitHub and select your repository.
4. **Configure Project**:
   *   **Framework**: Vite (it should auto-detect).
   *   **Root Directory**: Click "Edit" and select `client`.
5. **Environment Variables**:
   *   We need to tell the frontend where your backend is.
   *   In your code, you might need to update `fetch` calls to point to the Render URL.
   *   *Recommended*: For now, just Deploy.
6. Click **Deploy**.

---

## Part 5: Connecting Frontend to Backend (Crucial)
Your frontend usually looks for `localhost:3001`. On the internet, it needs to find your Render Server.

1. **Wait**. I (the AI) might have missed one step: modifying your Frontend to check for an Environment Variable.
2. In `client/vite.config.js` or your API calls, you need to ensure it points to the backend.

### Quick Fix for API URL
Before deploying Step 4, ensure your `client` knows the backend URL.
1. Create a file `.env.production` in `client` folder.
2. Add: `VITE_API_URL=https://your-render-app-name.onrender.com`
3. Update your React code to use `import.meta.env.VITE_API_URL || 'http://localhost:3001'`.

*(If you haven't done this, I can do it for you now - ask me!)*

---

## Summary
*   **Neon**: Holds your Data (Orders/Products).
*   **Render**: Runs your Server Code.
*   **Vercel**: Shows your Website.

If you shut down your laptop, these 3 services keep running for free!
