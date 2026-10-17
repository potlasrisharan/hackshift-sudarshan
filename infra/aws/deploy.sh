#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
aws sts get-caller-identity >/dev/null
region="${AWS_REGION:-ap-south-1}"
revision=$(git rev-parse HEAD)
prefix=$(aws ec2 describe-managed-prefix-lists --region "$region" --filters Name=prefix-list-name,Values=com.amazonaws.global.cloudfront.origin-facing --query 'PrefixLists[0].PrefixListId' --output text)
aws cloudformation deploy --region "$region" --template-file infra/aws/template.yaml --stack-name ayusetu-demo --capabilities CAPABILITY_IAM --parameter-overrides "Revision=$revision" "OriginPrefixList=$prefix" "BillingEmail=${BILLING_EMAIL:-}"
aws cloudformation describe-stacks --region "$region" --stack-name ayusetu-demo --query 'Stacks[0].Outputs'
