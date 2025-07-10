# S3 Buckets Creation Script for Fitness App
# Run this after configuring AWS CLI

Write-Host "Creating S3 buckets for Fitness App..." -ForegroundColor Green

# Set your AWS region
$region = "us-east-1"

# Create buckets with a unique suffix
$buckets = @(
    "fitness-progress-photos-samsung",
    "fitness-workout-videos-samsung", 
    "fitness-profile-avatars-samsung"
)

foreach ($bucket in $buckets) {
    Write-Host "Creating bucket: $bucket" -ForegroundColor Yellow
    
    # Create bucket
    aws s3 mb s3://$bucket --region $region
    
    # Enable versioning
    aws s3api put-bucket-versioning --bucket $bucket --versioning-configuration Status=Enabled
    
    # Block public access
    aws s3api put-public-access-block --bucket $bucket --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
    
    Write-Host "Bucket $bucket created successfully!" -ForegroundColor Green
}

Write-Host "All S3 buckets created successfully!" -ForegroundColor Green
Write-Host "You can verify in AWS Console > S3 > Buckets" -ForegroundColor Cyan 