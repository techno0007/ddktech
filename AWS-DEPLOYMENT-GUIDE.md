# 🚀 DDK-i Chatbot AWS Lambda Deployment Guide

This guide will help you deploy your DDK-i chatbot to AWS Lambda with Function URL for direct HTTP access.

## 📋 Prerequisites

### 1. AWS Account
- Active AWS account with appropriate permissions
- Access to Lambda, IAM, and CloudWatch services

### 2. AWS CLI Installation
```bash
# Download and install AWS CLI v2
# Windows: https://aws.amazon.com/cli/
# macOS: brew install awscli
# Linux: curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
```

### 3. AWS Credentials Configuration
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., ap-south-1)
# Enter your output format (json)
```

## 🎯 Quick Deployment

### Option 1: Automated Deployment (Recommended)
```powershell
# Run the deployment script
.\deploy-to-aws.ps1
```

### Option 2: Manual Deployment
Follow the step-by-step process below.

## 🔧 Manual Deployment Steps

### Step 1: Prepare Lambda Package
```bash
# Create deployment directory
mkdir lambda-deploy-package
cd lambda-deploy-package

# Copy Lambda files
cp ../lambda-deploy-full/lambda_handler_ddk.py .
cp ../lambda-deploy-full/ddk_bot.py .
cp ../lambda-deploy-full/__init__.py .
cp ../requirements-lambda.txt .

# Install dependencies
pip install -r requirements-lambda.txt -t .

# Create ZIP file
zip -r ../ddk-i-chatbot-lambda.zip .
cd ..
```

### Step 2: Create IAM Role
```bash
# Create trust policy file
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create IAM role
aws iam create-role \
  --role-name ddk-i-chatbot-lambda-role \
  --assume-role-policy-document file://trust-policy.json

# Attach basic execution policy
aws iam attach-role-policy \
  --role-name ddk-i-chatbot-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name ddk-i-chatbot-lambda-role --query 'Role.Arn' --output text)
```

### Step 3: Create Lambda Function
```bash
# Create Lambda function
aws lambda create-function \
  --function-name ddk-i-chatbot \
  --runtime python3.9 \
  --role $ROLE_ARN \
  --handler lambda_handler_ddk.lambda_handler \
  --zip-file fileb://ddk-i-chatbot-lambda.zip \
  --timeout 30 \
  --memory-size 256 \
  --region ap-south-1
```

### Step 4: Create Function URL
```bash
# Create Function URL for direct HTTP access
aws lambda create-function-url-config \
  --function-name ddk-i-chatbot \
  --auth-type NONE \
  --region ap-south-1
```

## 🌐 Function URL Configuration

### CORS Headers
The Lambda function includes CORS headers for cross-origin requests:
```python
'headers': {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
}
```

### Available Endpoints
- `GET /` - Health check
- `POST /api/check_client` - Check existing client
- `POST /api/get_service_info` - Get service information

## 🔄 Updating the Function

### Update Function Code
```bash
aws lambda update-function-code \
  --function-name ddk-i-chatbot \
  --zip-file fileb://ddk-i-chatbot-lambda.zip \
  --region ap-south-1
```

### Update Function Configuration
```bash
aws lambda update-function-configuration \
  --function-name ddk-i-chatbot \
  --timeout 30 \
  --memory-size 256 \
  --region ap-south-1
```

## 🧪 Testing Your Deployment

### 1. Test Function URL
```bash
# Get your Function URL
FUNCTION_URL=$(aws lambda get-function-url-config \
  --function-name ddk-i-chatbot \
  --region ap-south-1 \
  --query 'FunctionUrl' \
  --output text)

echo "Your Function URL: $FUNCTION_URL"
```

### 2. Test Health Check
```bash
curl $FUNCTION_URL
```

### 3. Test Client Check
```bash
curl -X POST $FUNCTION_URL/api/check_client \
  -H "Content-Type: application/json" \
  -d '{"client_id": "DDK001"}'
```

### 4. Test Service Info
```bash
curl -X POST $FUNCTION_URL/api/get_service_info \
  -H "Content-Type: application/json" \
  -d '{"query": "pricing", "language": "en"}'
```

## 🔗 Frontend Integration

### Update JavaScript Configuration
After deployment, update your frontend JavaScript with the new Function URL:

```javascript
// In static/js/chatbot.js
this.lambdaBaseUrl = 'YOUR_FUNCTION_URL_HERE';
```

### Example Response Format
```json
{
  "success": true,
  "service_info": {
    "title": "Pricing Information",
    "description": "Our pricing starts from ₹199...",
    "details": [
      "Basic Package: ₹199 - Simple business app",
      "Standard Package: ₹499 - Medium complexity app"
    ]
  },
  "service_type": "business_app"
}
```

## 📊 Monitoring and Logs

### View Lambda Logs
```bash
# View CloudWatch logs
aws logs describe-log-groups \
  --log-group-name-prefix "/aws/lambda/ddk-i-chatbot" \
  --region ap-south-1

# Get recent log events
aws logs filter-log-events \
  --log-group-name "/aws/lambda/ddk-i-chatbot" \
  --start-time $(date -d '1 hour ago' +%s)000 \
  --region ap-south-1
```

### CloudWatch Metrics
- Invocation count
- Duration
- Error count
- Throttles

## 🚨 Troubleshooting

### Common Issues

1. **Permission Denied**
   - Check IAM role permissions
   - Verify Lambda execution role

2. **Function Not Found**
   - Verify function name and region
   - Check if function was created successfully

3. **Timeout Errors**
   - Increase timeout in function configuration
   - Check for infinite loops in code

4. **CORS Issues**
   - Verify CORS headers in response
   - Check browser console for errors

### Debug Commands
```bash
# Check function status
aws lambda get-function --function-name ddk-i-chatbot --region ap-south-1

# Check function URL
aws lambda get-function-url-config --function-name ddk-i-chatbot --region ap-south-1

# List all functions
aws lambda list-functions --region ap-south-1
```

## 💰 Cost Optimization

### Lambda Pricing
- **Requests**: $0.20 per 1M requests
- **Duration**: $0.0000166667 per GB-second
- **Free Tier**: 1M requests and 400K GB-seconds per month

### Optimization Tips
- Use appropriate memory allocation
- Implement connection pooling
- Cache frequently accessed data
- Use provisioned concurrency for consistent performance

## 🔒 Security Considerations

### Function URL Security
- **Public Access**: Function URL is publicly accessible
- **Authentication**: Consider adding API Gateway with authentication
- **Rate Limiting**: Implement rate limiting for production use

### IAM Best Practices
- Use least privilege principle
- Regularly rotate access keys
- Monitor CloudTrail logs
- Use AWS Organizations for multi-account management

## 📈 Scaling

### Automatic Scaling
- Lambda automatically scales based on demand
- No manual scaling required
- Concurrent execution limits apply

### Performance Tuning
- Optimize cold start times
- Use provisioned concurrency for consistent performance
- Monitor and adjust memory allocation

## 🎉 Success!

Your DDK-i chatbot is now deployed on AWS Lambda with a Function URL! 

### Next Steps:
1. ✅ Test all endpoints
2. ✅ Update frontend with Function URL
3. ✅ Deploy frontend to S3/CloudFront
4. ✅ Monitor performance and costs
5. ✅ Set up alerts and monitoring

### Support
For issues or questions:
- Check CloudWatch logs
- Review Lambda metrics
- Consult AWS documentation
- Contact AWS support if needed

---

**Happy Chatboting! 🤖✨**
