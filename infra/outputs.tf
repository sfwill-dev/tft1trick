output "site_bucket_name" {
  description = "S3 bucket name where static build artifacts are uploaded."
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID used for cache invalidation."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN."
  value       = aws_cloudfront_distribution.site.arn
}

output "cloudfront_domain_name" {
  description = "CloudFront generated domain name."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN used by CloudFront."
  value       = aws_acm_certificate.site.arn
}

output "acm_domain_validation_options" {
  description = "DNS validation records required in Cloudflare for the ACM certificate."
  value       = aws_acm_certificate.site.domain_validation_options
}

output "github_actions_deploy_role_arn" {
  description = "IAM role ARN to be assumed by GitHub Actions via OIDC."
  value       = aws_iam_role.github_actions_deploy.arn
}
