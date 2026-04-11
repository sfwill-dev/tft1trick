variable "aws_region" {
  description = "AWS region used to host Terraform backend resources."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project tag value applied to backend resources."
  type        = string
  default     = "tft1trick"
}

variable "state_bucket_name" {
  description = "Globally unique S3 bucket name for Terraform remote state."
  type        = string
}

variable "lock_table_name" {
  description = "DynamoDB table name used for Terraform state locking."
  type        = string
  default     = "tft1trick-terraform-lock"
}
