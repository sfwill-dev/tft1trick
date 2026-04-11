# Infra Onboarding (Terraform + GitHub Actions)

This guide shows the exact commands and checklist to provision AWS infra and connect CI/CD.

## Prerequisites

- AWS account access with permissions for S3, DynamoDB, IAM, CloudFront, ACM.
- Terraform >= 1.14.0
- AWS CLI configured (`aws configure`)
- Cloudflare DNS already managing your domain

---

## 1) Bootstrap Terraform backend (one-time)

Create backend vars from example:

```bash
cp infra/backend/terraform.tfvars.example infra/backend/terraform.tfvars
```

Edit:

- `state_bucket_name` (must be globally unique)
- Optional: `project_name`, `lock_table_name`

Run bootstrap:

```bash
terraform -chdir=infra/backend init
terraform -chdir=infra/backend plan
terraform -chdir=infra/backend apply
```

Capture outputs:

```bash
terraform -chdir=infra/backend output
```

---

## 2) Configure main infra variables

Create tfvars and backend config from examples:

```bash
cp infra/terraform.tfvars.example infra/terraform.tfvars
cp infra/backend.hcl.example infra/backend.hcl
```

Edit `infra/terraform.tfvars`:

- `domain_name = "tft1trick.com"`
- `site_bucket_name` (must be globally unique)
- `github_repository = "sfwill-dev/tft1trick"`

Edit `infra/backend.hcl` with values from step 1:

- `bucket`
- `dynamodb_table`

---

## 3) Init/plan/apply main infra

```bash
terraform -chdir=infra init -reconfigure -backend-config=backend.hcl
terraform -chdir=infra plan
terraform -chdir=infra apply
```

Check outputs:

```bash
terraform -chdir=infra output
```

Important outputs used later:

- `site_bucket_name`
- `cloudfront_distribution_id`
- `cloudfront_domain_name`
- `github_actions_deploy_role_arn`
- `acm_domain_validation_options`

---

## 4) Cloudflare DNS configuration

1. Add ACM DNS validation CNAME(s) from `acm_domain_validation_options`.
2. Wait until certificate is validated (can take a few minutes).
3. Create DNS record for your root domain pointing to CloudFront domain (`cloudfront_domain_name`).
4. Set Cloudflare record as **DNS only (gray cloud)**.

---

## 5) GitHub repository configuration

### GitHub Variables (Settings → Secrets and variables → Actions → Variables)

- `AWS_REGION` = `us-east-1`
- `AWS_ROLE_TO_ASSUME` = value of `github_actions_deploy_role_arn`
- `SITE_BUCKET_NAME` = value of `site_bucket_name`
- `CLOUDFRONT_DISTRIBUTION_ID` = value of `cloudfront_distribution_id`

### GitHub Secrets

- `SONAR_TOKEN` = SonarCloud token for org `sfwill`

---

## 6) CI/CD behavior

- **PR to main** triggers `.github/workflows/ci.yml`
  - lint, type-check, tests with coverage, Sonar scan + quality gate
- **Push to main** triggers `.github/workflows/deploy.yml`
  - static build, OIDC AWS auth, S3 sync, CloudFront invalidation

---

## 7) Useful operations

Plan/apply updates:

```bash
terraform -chdir=infra plan
terraform -chdir=infra apply
```

Destroy (if needed, with caution):

```bash
terraform -chdir=infra destroy
```
