# DDK-i Chatbot AWS Lambda Deployment Guide

## Overview

This guide helps you deploy your DDK-i bilingual chatbot to AWS Lambda using Zappa. The deployment separates the Flask backend (Lambda) from static files (S3) for optimal performance and cost.

## Architecture

- **AWS Lambda**: Hosts the Flask application with API endpoints
- **Amazon S3**: Serves static files (CSS, JavaScript, images)
- **API Gateway**: Provides HTTPS endpoints for your Lambda function
- **CloudWatch**: Logs and monitoring

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with your credentials
3. **Python 3.11** (already configured)
4. **Zappa** (already installed)

## Quick Start

### 1. Configure AWS CLI

```bash
# Configure AWS credentials
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key  
- Default region (e.g., us-east-1)
- Default output format (json)

### 2. Update Configuration

Edit `zappa_settings.json` to customize:

```json
{
    "production": {
        "s3_bucket": "your-unique-bucket-name",
        "aws_region": "your-preferred-region",
        "environment_variables": {
            "SESSION_SECRET": "your-secure-session-secret"
        }
    }
}
```

### 3. Deploy to Development

```bash
# Deploy to development environment
./deploy.sh dev
```

### 4. Deploy to Production

```bash
# Deploy to production environment
./deploy.sh prod
```

## Deployment Commands

| Command | Description |
|---------|-------------|
| `./deploy.sh dev` | Deploy to development environment |
| `./deploy.sh prod` | Deploy to production environment |
| `./deploy.sh static` | Deploy only static files to S3 |
| `./deploy.sh init` | Initialize and check configuration |

## Manual Deployment Steps

If you prefer manual deployment:

### 1. Create S3 Buckets

```bash
# For Lambda deployments
aws s3 mb s3://ddktech-chatbot-lambda-deployments

# For static files
aws s3 mb s3://ddktech-chatbot-static-files
```

### 2. Deploy Static Files

```bash
# Upload CSS and JS files
aws s3 sync static/ s3://ddktech-chatbot-static-files/static/ --delete

# Set public read permissions
aws s3api put-bucket-policy --bucket ddktech-chatbot-static-files --policy '{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::ddktech-chatbot-static-files/*"
    }]
}'
```

### 3. Deploy Lambda Function

```bash
# First deployment
zappa deploy dev

# Updates
zappa update dev
```

## Environment Variables

Set these in `zappa_settings.json`:

- `SESSION_SECRET`: Secure session encryption key
- `AWS_REGION`: Your deployment region
- `STATIC_URL`: S3 bucket URL for static files

## File Structure After Deployment

```
.
├── lambda_app.py              # Lambda entry point
├── zappa_settings.json        # Deployment configuration
├── deploy.sh                  # Deployment script
├── static/                    # Static files (deployed to S3)
│   ├── css/chatbot.css
│   └── js/chatbot.js
└── templates/                 # Flask templates
```

## Monitoring and Logs

### View Logs

```bash
# Tail Lambda logs
zappa tail dev

# View recent logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/ddktech-chatbot
```

### Monitor Performance

- **CloudWatch Metrics**: Monitor invocations, duration, errors
- **X-Ray Tracing**: Enable for detailed request tracing
- **API Gateway Logs**: Track API usage and performance

## Security Configuration

### 1. Environment Variables

Never commit secrets to code. Use environment variables:

```json
{
    "environment_variables": {
        "SESSION_SECRET": "your-secure-secret",
        "DATABASE_URL": "your-db-connection-string"
    }
}
```

### 2. IAM Permissions

Zappa creates necessary IAM roles automatically, but you can customize:

```json
{
    "role_name": "ddktech-chatbot-lambda-role",
    "role_arn": "arn:aws:iam::123456789012:role/custom-role"
}
```

## Custom Domain (Optional)

To use your own domain:

### 1. Create SSL Certificate

```bash
# Request certificate (must be in us-east-1 for CloudFront)
aws acm request-certificate --domain-name api.ddktech.com --validation-method DNS
```

### 2. Configure Domain

```json
{
    "domain_name": "api.ddktech.com",
    "certificate_arn": "arn:aws:acm:us-east-1:123456789012:certificate/abc123"
}
```

### 3. Update Domain

```bash
zappa certify dev
```

## Troubleshooting

### Common Issues

1. **Deployment Bucket Errors**
   - Ensure S3 bucket names are globally unique
   - Check AWS region configuration

2. **Permission Errors**
   - Verify AWS CLI credentials
   - Check IAM user has Lambda and S3 permissions

3. **Large Package Size**
   - Use `slim_handler` in zappa_settings.json
   - Exclude unnecessary files in `exclude` list

4. **Cold Start Issues**
   - Enable `keep_warm` for production
   - Consider using provisioned concurrency

### Debug Commands

```bash
# Check Zappa status
zappa status dev

# View recent invocations
zappa tail dev --since 5m

# Validate Zappa settings
zappa validate

# Save debug info
zappa save-python-settings-file dev
```

## Cost Optimization

1. **Memory Allocation**: Start with 512MB, adjust based on usage
2. **Timeout**: Set appropriate timeout (30s default)
3. **Keep Warm**: Only enable for high-traffic environments
4. **Reserved Concurrency**: Limit concurrent executions if needed

## Database Integration

For production, replace mock data with AWS services:

### Option 1: DynamoDB

```python
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ddktech-clients')
```

### Option 2: RDS PostgreSQL

```python
import os
from sqlalchemy import create_engine

engine = create_engine(os.environ['DATABASE_URL'])
```

## Next Steps

1. **Set up monitoring alerts**
2. **Configure auto-scaling**
3. **Implement database persistence**
4. **Add API authentication**
5. **Set up CI/CD pipeline**

## Support

For deployment issues:

1. Check [Zappa documentation](https://github.com/zappa/Zappa)
2. Review [AWS Lambda best practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
3. Monitor CloudWatch logs for errors

---

**Note**: Replace placeholder values (bucket names, domains, etc.) with your actual values before deployment.