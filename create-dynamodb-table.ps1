# Create DynamoDB Table for DDK-i Chatbot Existing Clients
Write-Host "Creating DynamoDB table for existing clients..." -ForegroundColor Green

# Set AWS CLI path to local installation
$AWS_CLI_PATH = ".\AWSCLIV2\aws.exe"

# Configuration
$TABLE_NAME = "ddk-existing-clients"
$REGION = "ap-south-1"

# Check if AWS CLI is available
if (Test-Path $AWS_CLI_PATH) {
    Write-Host "AWS CLI found at: $AWS_CLI_PATH" -ForegroundColor Green
} else {
    Write-Host "AWS CLI not found at: $AWS_CLI_PATH" -ForegroundColor Red
    exit 1
}

# Check if table already exists
Write-Host "Checking if table exists..." -ForegroundColor Yellow
try {
    $null = & $AWS_CLI_PATH dynamodb describe-table --table-name $TABLE_NAME --region $REGION 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Table '$TABLE_NAME' already exists!" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "Table does not exist, will create new one" -ForegroundColor Yellow
}

# Create DynamoDB table
Write-Host "Creating DynamoDB table: $TABLE_NAME" -ForegroundColor Yellow

try {
    & $AWS_CLI_PATH dynamodb create-table --table-name $TABLE_NAME --attribute-definitions AttributeName=client_id,AttributeType=S --key-schema AttributeName=client_id,KeyType=HASH --billing-mode PAY_PER_REQUEST --region $REGION
    if ($LASTEXITCODE -eq 0) {
        Write-Host "DynamoDB table created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to create DynamoDB table" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error creating DynamoDB table: $_" -ForegroundColor Red
    exit 1
}

# Wait for table to be active
Write-Host "Waiting for table to be active..." -ForegroundColor Yellow
do {
    Start-Sleep -Seconds 5
    $tableStatus = (& $AWS_CLI_PATH dynamodb describe-table --table-name $TABLE_NAME --region $REGION --query 'Table.TableStatus' --output text 2>$null)
    Write-Host "Table status: $tableStatus" -ForegroundColor Cyan
} while ($tableStatus -ne "ACTIVE")

Write-Host "Table is now ACTIVE!" -ForegroundColor Green

# Add sample client data
Write-Host "Adding sample client data..." -ForegroundColor Yellow

# Add DDK001
Write-Host "Adding client: DDK001" -ForegroundColor Yellow
$client1 = '{"client_id":{"S":"DDK001"},"name":{"S":"John Smith"},"email":{"S":"john.smith@company.com"},"company":{"S":"Tech Solutions Inc."},"project_name":{"S":"Inventory Management App"},"status":{"S":"Active"},"services":{"L":[{"S":"Business App"},{"S":"Web Development"}]},"created_date":{"S":"2024-01-15"},"last_contact":{"S":"2024-08-10"}}'
& $AWS_CLI_PATH dynamodb put-item --table-name $TABLE_NAME --item "$client1" --region $REGION
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Added client: DDK001" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to add client: DDK001" -ForegroundColor Red
}

# Add DDK002
Write-Host "Adding client: DDK002" -ForegroundColor Yellow
$client2 = '{"client_id":{"S":"DDK002"},"name":{"S":"Sarah Johnson"},"email":{"S":"sarah.j@retailcorp.com"},"company":{"S":"Retail Corp"},"project_name":{"S":"E-commerce Platform"},"status":{"S":"Active"},"services":{"L":[{"S":"Web Development"},{"S":"Mobile App"}]},"created_date":{"S":"2024-02-20"},"last_contact":{"S":"2024-08-12"}}'
& $AWS_CLI_PATH dynamodb put-item --table-name $TABLE_NAME --item "$client2" --region $REGION
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Added client: DDK002" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to add client: DDK002" -ForegroundColor Red
}

# Add DDK003
Write-Host "Adding client: DDK003" -ForegroundColor Yellow
$client3 = '{"client_id":{"S":"DDK003"},"name":{"S":"Mike Chen"},"email":{"S":"mike.chen@healthcare.org"},"company":{"S":"Healthcare Solutions"},"project_name":{"S":"Patient Management System"},"status":{"S":"Active"},"services":{"L":[{"S":"Business App"},{"S":"API Integration"}]},"created_date":{"S":"2024-03-10"},"last_contact":{"S":"2024-08-08"}}'
& $AWS_CLI_PATH dynamodb put-item --table-name $TABLE_NAME --item "$client3" --region $REGION
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Added client: DDK003" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to add client: DDK003" -ForegroundColor Red
}

Write-Host ""
Write-Host "DynamoDB table setup completed!" -ForegroundColor Green
Write-Host "Table Name: $TABLE_NAME" -ForegroundColor Yellow
Write-Host "Region: $REGION" -ForegroundColor Yellow
Write-Host ""
Write-Host "Sample clients added:" -ForegroundColor Cyan
Write-Host "- DDK001: John Smith (Tech Solutions Inc.)" -ForegroundColor White
Write-Host "- DDK002: Sarah Johnson (Retail Corp)" -ForegroundColor White
Write-Host "- DDK003: Mike Chen (Healthcare Solutions)" -ForegroundColor White
