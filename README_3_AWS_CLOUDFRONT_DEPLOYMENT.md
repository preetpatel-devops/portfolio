# README 3 — Deploy Free via AWS S3 + CloudFront

This sets up static hosting on Amazon S3 with CloudFront as the CDN,
fronting HTTPS, caching, and a custom domain — all within the AWS Free
Tier for a low-traffic personal portfolio.

## Prerequisites

- An [AWS account](https://aws.amazon.com/free) with billing set up
  (Free Tier covers this usage, but a card is required to create an
  account)
- The [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
  installed and configured (`aws configure`) — optional but recommended
  for faster uploads

---

## Step 1 — Create the S3 bucket

1. Open the [S3 console](https://s3.console.aws.amazon.com/s3/).
2. **Create bucket.**
   - **Bucket name:** must be globally unique, e.g.
     `preet-patel-portfolio-site`.
   - **Region:** pick one close to your primary audience, e.g.
     `ap-south-1` (Mumbai).
   - **Block Public Access settings:** leave **all four boxes checked**
     (blocked). Public access will be granted through CloudFront's Origin
     Access Control instead — the bucket itself stays private. This is the
     current AWS-recommended pattern (safer than a public bucket policy).
3. Leave the rest as default and click **Create bucket**.

---

## Step 2 — Upload the site files

Via the console: open the bucket → **Upload** → drag in `index.html`,
`styles.css`, `script.js`, and the `assets/` folder → **Upload**.

Or via CLI, from the project root:

```bash
aws s3 sync . s3://preet-patel-portfolio-site \
  --exclude ".git/*" \
  --exclude "README*"
```

---

## Step 3 — Create a CloudFront distribution with Origin Access Control (OAC)

1. Open the [CloudFront console](https://console.aws.amazon.com/cloudfront/).
2. **Create distribution.**
3. **Origin domain:** select your S3 bucket from the dropdown (choose the
   `*.s3.amazonaws.com` REST endpoint, not the "static website hosting"
   endpoint — OAC requires the REST endpoint).
4. **Origin access:** choose **Origin access control settings
   (recommended)** → **Create new OAC** → accept the defaults → **Create**.
5. CloudFront will show a banner: *"The S3 bucket policy needs to be
   updated."* Click **Copy policy** — you'll paste this in Step 4.
6. **Viewer protocol policy:** Redirect HTTP to HTTPS.
7. **Default root object:** enter `index.html` (this is what loads when
   someone visits the bare domain with no path — set it here, not just in
   S3).
8. **Web Application Firewall (WAF):** select **Do not enable** to stay
   fully within the free tier for a personal site.
9. Click **Create distribution**. It will show status **Deploying** for
   5–15 minutes.

---

## Step 4 — Attach the bucket policy

1. Go back to the **S3 console** → your bucket → **Permissions** tab →
   **Bucket policy** → **Edit**.
2. Paste the policy CloudFront generated in Step 3.5. It will look like
   this (CloudFront fills in your actual bucket name, account ID, and
   distribution ID):

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowCloudFrontServicePrincipal",
         "Effect": "Allow",
         "Principal": { "Service": "cloudfront.amazonaws.com" },
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::preet-patel-portfolio-site/*",
         "Condition": {
           "StringEquals": {
             "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
           }
         }
       }
     ]
   }
   ```

3. **Save changes.** This grants CloudFront (and only CloudFront) read
   access to the bucket — the bucket itself remains blocked from direct
   public access.

---

## Step 5 — Test the deployment

Once the distribution status changes from **Deploying** to **Enabled**,
find your distribution's domain name on the CloudFront console (something
like `d1234abcd.cloudfront.net`) and open it in a browser. Your portfolio
should load over HTTPS.

---

## Step 6 — Handling cache invalidations after updates

CloudFront caches your files at edge locations worldwide, so after
uploading changed files to S3, you need to tell CloudFront to fetch fresh
copies:

**Console:** Distribution → **Invalidations** tab → **Create invalidation**
→ object path `/*` → **Create invalidation**.

**CLI:**
```bash
aws s3 sync . s3://preet-patel-portfolio-site --exclude ".git/*" --exclude "README*"
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

Invalidations typically complete within 1–3 minutes. AWS Free Tier
includes 1,000 free invalidation paths per month — `/*` counts as one
path, so routine updates cost nothing extra.

---

## Step 7 — (Optional) Custom domain with free HTTPS

1. Request a public certificate in **AWS Certificate Manager (ACM)** —
   **important: the certificate must be requested in the `us-east-1`
   (N. Virginia) region**, regardless of where your bucket lives, because
   CloudFront only reads certificates from that region.
2. Validate via DNS (ACM gives you a CNAME record to add at your domain
   registrar or in Route 53).
3. Once **Issued**, go to your CloudFront distribution → **Edit** →
   **Alternate domain name (CNAME)** → add your domain → **Custom SSL
   certificate** → select the ACM cert you just validated.
4. Point your domain's DNS at the CloudFront distribution:
   - If using **Route 53**: create an **A record (Alias)** targeting the
     CloudFront distribution.
   - If using an external registrar: create a **CNAME** record pointing
     your subdomain (e.g. `www`) at the `*.cloudfront.net` domain. (Apex/
     root domains without `www` require Route 53 Alias records or a
     provider that supports `ALIAS`/`ANAME` records.)

---

## Free Tier notes

For a personal portfolio's traffic level, this setup stays within AWS's
**Always Free** allowances:
- **S3:** 5 GB storage, 20,000 GET requests/month (12-month Free Tier)
- **CloudFront:** 1 TB data transfer out + 10,000,000 requests/month
  (Always Free, no 12-month expiry)

## Troubleshooting

| Symptom | Fix |
|---|---|
| 403 Forbidden from CloudFront | Bucket policy not attached correctly, or OAC not linked to the origin — recheck Step 4. |
| Changes not appearing | Create a cache invalidation (Step 6) — CloudFront serves cached copies until told otherwise. |
| Root domain (`example.com`, no `www`) not loading | Requires Route 53 with an Alias record, or a DNS provider supporting ANAME/ALIAS records — plain CNAMEs don't work on apex domains. |
| Certificate not selectable in CloudFront | Confirm the ACM certificate was requested in `us-east-1`. |
