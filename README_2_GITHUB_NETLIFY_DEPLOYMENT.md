# README 2 — Deploy Free via GitHub + Netlify

This walks through pushing this static site to GitHub and connecting it to
Netlify for free, continuous-deployment hosting.

## Prerequisites

- A [GitHub](https://github.com) account
- A [Netlify](https://netlify.com) account (you can sign up using your
  GitHub account directly)
- [Git](https://git-scm.com/downloads) installed locally

---

## Step 1 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new).
2. Repository name: e.g. `preet-patel-portfolio`.
3. Keep it **Public** (required for Netlify's free tier to pull from it
   without extra configuration) or **Private** (also supported, just
   requires authorizing Netlify's GitHub App).
4. Do **not** initialize with a README, `.gitignore`, or license — this
   project already has its own files.
5. Click **Create repository** and keep the page open; you'll need the
   remote URL shown there.

---

## Step 2 — Push this project to GitHub

From the root of this project folder (where `index.html` lives), run:

```bash
git init
git add .
git commit -m "Initial commit — portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/preet-patel-portfolio.git
git push -u origin main
```

Replace `YOUR_USERNAME` and the repo name with your actual values from
Step 1.

---

## Step 3 — Connect the repository to Netlify

1. Log in to [app.netlify.com](https://app.netlify.com).
2. Click **Add new site** → **Import an existing project**.
3. Choose **Deploy with GitHub** and authorize Netlify to access your
   repositories (first time only).
4. Select the `preet-patel-portfolio` repository.
5. Build settings for this project (a plain static site, no build step):
   - **Branch to deploy:** `main`
   - **Build command:** *(leave empty)*
   - **Publish directory:** `.` (the repository root, since `index.html`
     sits at the top level)
6. Click **Deploy site**.

Netlify will assign a random subdomain like
`https://cheerful-narwhal-123abc.netlify.app` within a minute. Your site is
now live.

---

## Step 4 — Continuous deployment (already on by default)

Once connected, every `git push` to `main` automatically triggers a new
Netlify build and deploy — no extra configuration needed. This is what
"continuous integration" means here: your local changes go live within
seconds of pushing.

To make a change:

```bash
# edit index.html / styles.css / script.js
git add .
git commit -m "Update experience section"
git push
```

Watch the deploy progress under **Site overview → Production deploys** in
the Netlify dashboard.

---

## Step 5 — (Optional) Set a custom site name

1. In the Netlify dashboard, go to **Site configuration → Site details →
   Change site name**.
2. Pick something memorable, e.g. `preetpatel`. Your site is now at
   `https://preetpatel.netlify.app`.

---

## Step 6 — (Optional) Connect a custom domain

1. **Site configuration → Domain management → Add a domain.**
2. Enter your domain (e.g. `preetpatel.dev`) — you can buy one through
   Netlify or point an existing domain's DNS at Netlify.
3. If using an external registrar (GoDaddy, Namecheap, Google Domains,
   etc.), Netlify will show you the exact DNS records (usually an `A`
   record to Netlify's load balancer IP, plus a `CNAME` for `www`) to add
   at your registrar.
4. Netlify auto-provisions a free HTTPS certificate (via Let's Encrypt)
   once DNS propagates — usually within minutes to a few hours.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Blank page / 404 on deploy | Confirm **Publish directory** is `.` and `index.html` is at the repo root, not nested in a subfolder. |
| CSS/JS not loading | Check browser DevTools → Network tab for 404s; confirm `styles.css` and `script.js` are committed and paths in `index.html` are relative (`styles.css`, not `/styles.css` with a leading slash pointing elsewhere). |
| Images broken | If using Google Drive links, confirm sharing is set to "Anyone with the link." See README 1, Section 1. |
| Old content still showing | Hard-refresh (Ctrl/Cmd + Shift + R) — Netlify's CDN cache usually updates within seconds, but browser cache can linger. |

This entire workflow (GitHub repo + Netlify hosting + custom domain +
HTTPS) is free under Netlify's standard free tier for personal projects.
