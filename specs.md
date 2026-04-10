# TFT1Trick — Technical Plan (v1)

## 1) Goals

- Build a fast, SEO-friendly personal TFT site using **Next.js 16**.
- Keep the initial scope intentionally small:
  - **Home** page
  - **Patches** page with patch selector (default current patch, e.g. `16.8`)
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

## Patches (`/patches`)

- Patch selector (defaulting to current patch, e.g. `16.8`).
- Patch-driven content loaded from MDX.
- Initial format: mostly text + optional embedded image links (builder-board screenshots), similar spirit to BunnyMuffins.

---

## 5) Content Model (v1)

Proposed structure:

```txt
content/
  home/
    philosophy.mdx
    story.mdx
  patches/
    _template.mdx
    patch-16.8.mdx
    patch-16.7.mdx
```

Example frontmatter for patch files:

```yaml
---
patch: "16.8"
set: 16
updatedAt: "2026-04-01"
---
```

Validation via Zod:

- Required: `patch`, `set`, `updatedAt`
- Optional: metadata fields as needed later

---

## 6) Project Structure (planned)

```txt
src/
  app/
    page.tsx
    patches/page.tsx
  components/
    Header.tsx
    Footer.tsx
    PatchSelector.tsx
    PatchSection.tsx
  lib/
    mdx.ts
    patches.ts
  schemas/
    patch.ts

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
  - Patch parsing/sorting logic
  - MDX frontmatter/schema validation
  - Selector behavior and fallback/default patch behavior
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
- Build Home and Patches pages
- Add patch selector and default patch handling
- Add `_template.mdx` for patch authoring

### Phase 3 — Infra + Automation

- Terraform: S3 + CloudFront + ACM
- Cloudflare DNS integration
- GitHub Actions CI + deploy
- SonarCloud quality gates + coverage reporting

### Phase 4 - Review

- Grammar review
- CRO review
- SEO review
- Code review

### Phase 5 — AdSense

- Add Google AdSense after approval
