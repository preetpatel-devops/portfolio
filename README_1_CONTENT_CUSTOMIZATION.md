# README 1 — Content Customization Guide

This guide tells you **exactly which file, which line, and which tag** to edit
for every piece of manual content: profile photo, Experience, Skills,
Projects, Interests, and Contact details.

> Line numbers below match the `index.html` as generated. If you add or
> remove lines above a section, re-run `grep -n "EDIT" index.html` to get
> fresh numbers.

---

## 1. Converting a Google Drive share link to a direct-embed URL

The spec calls for all images (profile photo, project screenshots) to load
via Google Drive. Google's default "share" link does **not** render as an
image — you must convert it.

1. In Google Drive, right-click the file → **Share** → **General access** →
   set to **"Anyone with the link"**.
2. Copy the share link. It looks like:
   ```
   https://drive.google.com/file/d/1AbCDefGhIJKlmNoPQRstuVWxyz/view?usp=sharing
   ```
3. Copy the ID — the part between `/d/` and `/view` (here:
   `1AbCDefGhIJKlmNoPQRstuVWxyz`).
4. Build the direct-view URL using this pattern:
   ```
   https://drive.google.com/uc?export=view&id=1AbCDefGhIJKlmNoPQRstuVWxyz
   ```
5. Use that URL as the `src` attribute anywhere an image is needed.

**Note on reliability:** Google occasionally rate-limits or blocks
hot-linked `drive.google.com` images at scale. For a portfolio site (low
traffic) this is normally fine, but if images stop loading, re-share the
file or switch to committing the image into `assets/images/` in your GitHub
repo instead (already done for the profile photo by default).

---

## 2. Profile photo

**File:** `index.html`
**Section:** `<header class="resume-header">`, near the top of `<body>`

```html
<div class="avatar-wrap">
  <!-- EDIT_YOUR_PROFILE_PHOTO_URL_HERE — see README 1, Section 2 -->
  <img src="assets/images/profile.jpeg" alt="Portrait of Preet Patel" class="avatar">
</div>
```

By default this points at the local file `assets/images/profile.jpeg`
(already included in this project). To use Google Drive instead, replace
the `src` value with your converted URL from Section 1:

```html
<img src="https://drive.google.com/uc?export=view&id=YOUR_FILE_ID" alt="Portrait of Preet Patel" class="avatar">
```

---

## 3. Experience

**File:** `index.html`
**Section:** `id="experience-list"`, starting at line 146

Find the `<!-- EDIT_YOUR_EXPERIENCE_HERE -->` comment. Delete the
`.placeholder-card` div below it, then uncomment and duplicate the
`.job-card` template (also inside that same comment block) once per role:

```html
<article class="job-card">
  <div class="job-card-head">
    <h3 class="job-title">Cloud Engineer</h3>
    <span class="job-dates">Jun 2024 — Present</span>
  </div>
  <p class="job-company">Company Name · Ahmedabad, India</p>
  <ul class="job-points">
    <li>Impact-oriented bullet point one.</li>
    <li>Impact-oriented bullet point two.</li>
  </ul>
</article>
```

Order matters visually (most recent first) but is not enforced by code —
place cards top-to-bottom in the order you want them to appear.

---

## 4. Skills

**File:** `index.html`
**Section:** `id="skills-groups"`, starting at line 341

Delete the placeholder card and duplicate the `.skill-group` template once
per category (e.g. "Languages", "Cloud & DevOps", "Data & AI"):

```html
<div class="skill-group">
  <h3>Cloud &amp; DevOps</h3>
  <ul class="skill-tags">
    <li>OCI</li>
    <li>Docker</li>
    <li>Terraform</li>
    <li>GitHub Actions</li>
  </ul>
</div>
```

Each `<li>` renders as an individual pill/tag — keep labels short (1–3
words) so the layout stays tidy on mobile.

---

## 5. Projects

**File:** `index.html`
**Section:** `id="projects-grid"`, starting at line 372

Delete the placeholder card and duplicate the `.project-card` template per
project:

```html
<article class="project-card">
  <div class="project-card-media">
    <img src="https://drive.google.com/uc?export=view&id=YOUR_SCREENSHOT_ID" alt="Project screenshot">
  </div>
  <div class="project-card-body">
    <h3>Project Name</h3>
    <p>One or two sentences describing the problem and your approach.</p>
    <ul class="project-tags">
      <li>Python</li>
      <li>OCI</li>
    </ul>
    <div class="project-card-links">
      <a href="https://your-live-demo-url.com" target="_blank" rel="noopener noreferrer">Live demo</a>
      <a href="https://github.com/you/repo" target="_blank" rel="noopener noreferrer">Source</a>
    </div>
  </div>
</article>
```

Line 379 in the template comment shows exactly where the screenshot `src`
goes — replace `REPLACE_WITH_GOOGLE_DRIVE_DIRECT_LINK` with your converted
URL from Section 1.

---

## 6. Interests

**File:** `index.html`
**Section:** `id="interests-grid"`, starting at line 413

Delete the placeholder card and duplicate the `.interest-card` template per
interest:

```html
<div class="interest-card">
  <h3>Photography</h3>
  <p>A sentence or two about why it matters to you.</p>
</div>
```

---

## 7. Contact details

**File:** `index.html`
**Lines:** 442–453

Replace each placeholder value:

| Line | Find | Replace with |
|------|------|---------------|
| 443, 445 | `your.email@example.com` | your real email address (both the `mailto:` href and the visible text) |
| 447, 449 | `REPLACE_ME` (LinkedIn) | your LinkedIn username |
| 451, 453 | `REPLACE_ME` (GitHub) | your GitHub username |

The Credly contact card already points at your live badge profile and does
not need editing.

---

## 7a. Certification badges — swapping in your real badge images

**File:** `index.html`, section `id="certifications"`

Each badge is a `<button class="badge-tile">` with `data-badge-*`
attributes that feed the click-to-enlarge lightbox at the bottom of the
same section (`id="badge-modal"`):

```html
<button type="button" class="badge-tile"
        data-badge-img="assets/images/badges/oracle-ai-database.svg"
        data-badge-title="Oracle AI Cloud Database Services 2025 Certified Professional"
        data-badge-issuer="Oracle Cloud Infrastructure · 2025"
        data-badge-verify="https://catalog-education.oracle.com/pls/certview/sharebadge?id=...">
  <img src="assets/images/badges/oracle-ai-database.svg" alt="...">
  <span class="badge-tile-label">AI Cloud Database Services</span>
</button>
```

The five badges currently use **stylized placeholder SVG icons**
(`assets/images/badges/*.svg`) — Oracle and Credly don't expose a public,
predictable image URL for individual badges, so a real badge graphic has
to come from you directly. To use your actual badge artwork:

1. Log in to [CertView](https://certview.oracle.com/) → **Credential
   Management** → **Share Credentials** → **Download Badge** for each
   certification, or download the badge image from your
   [Credly profile](https://www.credly.com/users/preet-patel-22/badges).
2. Either commit the downloaded PNG into `assets/images/badges/` and
   update both `src` and `data-badge-img` to point at it, or upload it to
   Google Drive and use a converted direct-view URL (Section 1) in both
   attributes.
3. Leave `data-badge-verify` as-is — those are your real, working
   verification links from the original certification URLs.

Clicking any badge opens the enlarged view via `script.js`; no HTML
changes are needed there.

## 8. Education, Certifications, and the SPI chart — where this data lives

Education milestones (SSC, HSC, B.E.), the semester-wise SPI chart, and the
Oracle/Credly certification cards are **already populated** from your
uploaded marksheets and the certification links you provided — you don't
need to touch these unless the underlying facts change (e.g. a new
certification). See `README_4_PROJECT_DATA_MAP.md` for the full source-to-
code mapping, including the exact JavaScript array (`spiData` in
`script.js`) that drives the chart if you ever need to add semester 9/10 or
correct a figure.

---

## 9. Colors, fonts, and other styling

All design tokens (colors, fonts, spacing, radii) live at the top of
`styles.css` inside the `:root { ... }` block (lines 1–33). Change the
`--accent` and `--accent-strong` hex values there to retheme the entire
site without touching HTML.
