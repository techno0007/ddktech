#!/bin/bash

# DDK-i Chatbot AWS Lambda Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting DDK-i Chatbot Lambda Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is configured
check_aws_config() {
    print_status "Checking AWS configuration..."
    
    if ! aws sts get-caller-identity > /dev/null 2>&1; then
        print_error "AWS CLI is not configured or credentials are invalid"
        echo "Please run: aws configure"
        exit 1
    fi
    
    print_success "AWS configuration verified"
}

# Create S3 bucket for Zappa deployments
create_s3_bucket() {
    local bucket_name=$1
    local region=${2:-us-east-1}
    
    print_status "Creating S3 bucket: $bucket_name"
    
    if aws s3api head-bucket --bucket "$bucket_name" 2>/dev/null; then
        print_warning "Bucket $bucket_name already exists"
    else
        if [ "$region" = "us-east-1" ]; then
            aws s3api create-bucket --bucket "$bucket_name"
        else
            aws s3api create-bucket --bucket "$bucket_name" --region "$region" \
                --create-bucket-configuration LocationConstraint="$region"
        fi
        print_success "Created bucket: $bucket_name"
    fi
}

# Deploy static files to S3
deploy_static_files() {
    print_status "Deploying static files to S3..."
    
    # Create static files bucket
    local static_bucket="ddktech-chatbot-static-files"
    create_s3_bucket "$static_bucket"
    
    # Upload CSS and JS files
    if [ -d "static" ]; then
        aws s3 sync static/ s3://$static_bucket/static/ --delete
        
        # Set public read permissions for static files
        aws s3api put-bucket-policy --bucket "$static_bucket" --policy '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": "arn:aws:s3:::'"$static_bucket"'/*"
                }
            ]
        }'
        
        print_success "Static files deployed to: https://$static_bucket.s3.amazonaws.com/"
    else
        print_warning "No static files directory found"
    fi
}

# Initialize Zappa
init_zappa() {
    print_status "Initializing Zappa..."
    
    if [ ! -f "zappa_settings.json" ]; then
        print_error "zappa_settings.json not found!"
        exit 1
    fi
    
    print_success "Zappa configuration found"
}

# Deploy to development environment
deploy_dev() {
    print_status "Deploying to development environment..."
    
    # Create deployment bucket
    create_s3_bucket "ddktech-chatbot-lambda-deployments-dev"
    
    # Deploy static files first
    deploy_static_files
    
    # Deploy Lambda function
    if zappa status dev > /dev/null 2>&1; then
        print_status "Updating existing deployment..."
        zappa update dev
    else
        print_status "Creating new deployment..."
        zappa deploy dev
    fi
    
    print_success "Development deployment complete!"
    
    # Get the API endpoint
    local api_url=$(zappa status dev | grep -o 'https://[^[:space:]]*')
    if [ ! -z "$api_url" ]; then
        print_success "API URL: $api_url"
    fi
}

# Deploy to production environment
deploy_prod() {
    print_status "Deploying to production environment..."
    
    read -p "Are you sure you want to deploy to production? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_warning "Production deployment cancelled"
        return
    fi
    
    # Create deployment bucket
    create_s3_bucket "ddktech-chatbot-lambda-deployments"
    
    # Deploy static files first
    deploy_static_files
    
    # Deploy Lambda function
    if zappa status production > /dev/null 2>&1; then
        print_status "Updating existing production deployment..."
        zappa update production
    else
        print_status "Creating new production deployment..."
        zappa deploy production
    fi
    
    print_success "Production deployment complete!"
    
    # Get the API endpoint
    local api_url=$(zappa status production | grep -o 'https://[^[:space:]]*')
    if [ ! -z "$api_url" ]; then
        print_success "Production API URL: $api_url"
    fi
}

# Main deployment logic
main() {
    case "${1:-dev}" in
        "dev"|"development")
            check_aws_config
            init_zappa
            deploy_dev
            ;;
        "prod"|"production")
            check_aws_config
            init_zappa
            deploy_prod
            ;;
        "static")
            check_aws_config
            deploy_static_files
            ;;
        "init")
            check_aws_config
            init_zappa
            print_success "Initialization complete"
            ;;
        *)
            echo "Usage: $0 {dev|prod|static|init}"
            echo ""
            echo "Commands:"
            echo "  dev       Deploy to development environment (default)"
            echo "  prod      Deploy to production environment"
            echo "  static    Deploy only static files to S3"
            echo "  init      Initialize and check configuration"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"