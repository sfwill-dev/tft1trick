# TFT1Trick — Technical Plan (v1)

## 1) Goals

- Build a fast, SEO-friendly personal TFT site using **Next.js 16**.
- Keep the initial scope intentionally small:
  - **Home** page
  - **Guides** page with latest entries + all entries
- Keep authoring simple with repo-based content.
- Deploy on AWS with infrastructure-as-code and automated CI/CD.

---

## 2) Confirmed Decisions

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Validation:** Zod (where applicable)
- **Code quality:** ESLint + Prettier
- **Tests:** Unit tests where/if they make sense
- **CI/CD:** GitHub Actions
- **Quality gate:** SonarCloud on PRs + coverage reporting
- **Hosting:** AWS **S3 + CloudFront**
- **Infra as Code:** Terraform
- **Region:** `us-east-1`
- **Environment:** Production only (no staging for now)
- **DNS:** Keep DNS on Cloudflare
- **CMS/content:** Markdown/MDX files in-repo
- **Design direction:** Minimal (inspired by steipete.me), monochrome with subtle TFT-accent color

---

## 3) MDX/CMS Choice

Use **`next-mdx-remote`** with `gray-matter`.

Why this choice:

- Most used among the options discussed.
- Flexible content location (does not force content to live only in route folders).
- Works well with frontmatter parsing and **Zod** schema validation.
- Great for a solo-maintained site with Git-based content updates.

---

## 4) Site IA / Pages

## Home (`/`)

- Link button to YouTube channel.
- One-trick philosophy section.
- Personal journey section (Emerald → Masters in 4 sets).
- Linked line for the latest guide title.

## Guides (`/guides`)

- Shows the latest 5 guide entries.
- Link/button at the bottom: **All guides** (`/guides/all`).

## All Guides (`/guides/all`)

- Full list of every guide, newest first.

## Guide Detail (`/guides/[slug]`)

- Title and publication date.
- MDX body content (including optional embeds such as YouTube iframes and board tabs).

---

## 5) Content Model (v1)

Proposed structure:

```txt
content/
  home/
    page.mdx
  guides/
    _template.mdx
    5-nova-patch-17-1.mdx
```

Example frontmatter for guide files:

```yaml
---
title: "I'm one-tricking 5 N.O.V.A. in patch 17.1 - here's the breakdown"
date: "2026-04-15"
---
```

Validation via Zod:

- Required: `title`, `date`
- `slug` derived from the MDX filename

---

## 6) Project Structure (planned)

```txt
src/
  app/
    page.tsx
    guides/page.tsx
    guides/all/page.tsx
    guides/[slug]/page.tsx
  components/
    Header.tsx
    Footer.tsx
    BoardTabs.tsx
  lib/
    mdx.ts
    guides.ts
  schemas/
    guide.ts

content/
infra/
.github/workflows/
```

---

## 7) Infrastructure Plan (AWS + Terraform)

- S3 bucket for static site artifacts.
- CloudFront distribution in front of S3.
- Origin access configured so S3 is not publicly open beyond required setup.
- ACM certificate (for CloudFront custom domain TLS).

### Certificate note

- **ACM public certificate is free** when used with AWS services (including CloudFront).

### DNS recommendation

- Keep DNS at Cloudflare and point records to CloudFront.
- No need to move DNS to Route53 for this use case.

### Cost expectation (rough)

- S3: very low (few cents/month for a small static site).
- CloudFront: often within free tier for low traffic; otherwise small variable transfer/request cost.
- ACM cert: free.
- With this scope, typical monthly total is often very low (commonly sub-$1 for modest traffic).

---

## 8) CI/CD and Quality Gates

## PR workflow (GitHub Actions)

- Install dependencies
- Lint
- Type-check
- Unit tests with coverage
- SonarCloud scan + quality gate enforcement

## Deploy workflow (main branch)

- Build static output
- Upload/sync artifacts to S3
- CloudFront cache invalidation

---

## 9) Testing Strategy (v1)

- Focus unit tests on utility logic/components where they add value:
  - Guide sorting and lookup logic
  - MDX frontmatter/schema validation
  - Header navigation links
- Avoid over-testing static presentational text sections.

---

## 10) AdSense Status

**Deferred intentionally.**

Plan:

- First, ship site foundation and content workflow.
- After AdSense approval is obtained, add ad script + reusable ad slots in a dedicated follow-up phase.

---

## 11) Delivery Phases

### Phase 1 — Foundation

- Bootstrap Next.js 16 + TS + Tailwind
- Configure ESLint, Prettier, test runner
- Baseline app layout and styling system

### Phase 2 — Content + Pages

- Implement MDX content pipeline
- Add Zod validations
- Build Home and Guides pages
- Build all guides and detail guide routes
- Add `_template.mdx` for guide authoring

### Phase 3 — Infra + Automation

- Terraform: S3 + CloudFront + ACM
- Cloudflare DNS integration
- GitHub Actions CI + deploy
- SonarCloud quality gates + coverage reporting

### Phase 4 - Review

- UX review
- SEO review
- Code review (including test coverage)

### Phase 5 — AdSense

- Add Google AdSense after approval
