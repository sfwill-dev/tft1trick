variable "aws_region" {
  description = "AWS region for the website infrastructure resources."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for tagging resources."
  type        = string
  default     = "tft1trick"
}

variable "domain_name" {
  description = "Primary custom domain used by CloudFront (for example: tft1trick.com)."
  type        = string
}

variable "site_bucket_name" {
  description = "Globally unique S3 bucket name for static website artifacts."
  type        = string
}

variable "github_repository" {
  description = "GitHub repository in owner/repo format allowed to assume deploy role."
  type        = string
}

variable "cloudfront_price_class" {
  description = "CloudFront price class selection."
  type        = string
  default     = "PriceClass_100"
}
