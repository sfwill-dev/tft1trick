resource "aws_acm_certificate" "site" {
  provider = aws.us_east_1

  domain_name       = var.domain_name
  validation_method = "DNS"
  # DNS validation records are surfaced via outputs and must be created in
  # Cloudflare manually before the certificate can be used by CloudFront.

  lifecycle {
    create_before_destroy = true
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-site-cert"
  })
}
