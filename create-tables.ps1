# DynamoDB Tables Creation Script for Fitness App
# Run this after configuring AWS CLI

Write-Host "Creating DynamoDB tables for Fitness App..." -ForegroundColor Green

# Create JSON files for GSI configurations
Write-Host "Creating GSI configuration files..." -ForegroundColor Yellow

# Users GSI
@'
[{
  "IndexName": "auth0Id-index",
  "KeySchema": [
    {"AttributeName": "auth0Id", "KeyType": "HASH"}
  ],
  "Projection": {"ProjectionType": "ALL"}
}]
'@ | Out-File -FilePath "users-gsi.json" -Encoding ASCII

# Workouts GSI
@'
[{
  "IndexName": "userId-index",
  "KeySchema": [
    {"AttributeName": "userId", "KeyType": "HASH"},
    {"AttributeName": "id", "KeyType": "RANGE"}
  ],
  "Projection": {"ProjectionType": "ALL"}
}]
'@ | Out-File -FilePath "workouts-gsi.json" -Encoding ASCII

# TrainerProfiles GSI
@'
[{
  "IndexName": "userId-index",
  "KeySchema": [
    {"AttributeName": "userId", "KeyType": "HASH"}
  ],
  "Projection": {"ProjectionType": "ALL"}
}]
'@ | Out-File -FilePath "trainerprofiles-gsi.json" -Encoding ASCII

# Clients GSI
@'
[{
  "IndexName": "trainerId-index",
  "KeySchema": [
    {"AttributeName": "trainerId", "KeyType": "HASH"}
  ],
  "Projection": {"ProjectionType": "ALL"}
}]
'@ | Out-File -FilePath "clients-gsi.json" -Encoding ASCII

# Sessions GSI
@'
[{
  "IndexName": "trainerId-index",
  "KeySchema": [
    {"AttributeName": "trainerId", "KeyType": "HASH"}
  ],
  "Projection": {"ProjectionType": "ALL"}
}]
'@ | Out-File -FilePath "sessions-gsi.json" -Encoding ASCII

# TrainerConnections GSI
@'
[{
  "IndexName": "trainerId-index",
  "KeySchema": [
    {"AttributeName": "trainerId", "KeyType": "HASH"}
  ],
  "Projection": {"ProjectionType": "ALL"}
}]
'@ | Out-File -FilePath "trainerconnections-gsi.json" -Encoding ASCII

# CommunityPosts GSI
@'
[{
  "IndexName": "trainerId-index",
  "KeySchema": [
    {"AttributeName": "trainerId", "KeyType": "HASH"}
  ],
  "Projection": {"ProjectionType": "ALL"}
}]
'@ | Out-File -FilePath "communityposts-gsi.json" -Encoding ASCII

# Resources GSI
@'
[{
  "IndexName": "trainerId-index",
  "KeySchema": [
    {"AttributeName": "trainerId", "KeyType": "HASH"}
  ],
  "Projection": {"ProjectionType": "ALL"}
}]
'@ | Out-File -FilePath "resources-gsi.json" -Encoding ASCII

# Users Table
Write-Host "Creating Users table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name Users `
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=auth0Id,AttributeType=S `
    --key-schema AttributeName=id,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --global-secondary-indexes file://users-gsi.json

# Workouts Table
Write-Host "Creating Workouts table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name Workouts `
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=userId,AttributeType=S `
    --key-schema AttributeName=id,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --global-secondary-indexes file://workouts-gsi.json

# Trainer Profiles Table
Write-Host "Creating TrainerProfiles table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name TrainerProfiles `
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=userId,AttributeType=S `
    --key-schema AttributeName=id,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --global-secondary-indexes file://trainerprofiles-gsi.json

# Clients Table
Write-Host "Creating Clients table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name Clients `
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=trainerId,AttributeType=S `
    --key-schema AttributeName=id,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --global-secondary-indexes file://clients-gsi.json

# Sessions Table
Write-Host "Creating Sessions table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name Sessions `
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=trainerId,AttributeType=S `
    --key-schema AttributeName=id,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --global-secondary-indexes file://sessions-gsi.json

# Trainer Connections Table
Write-Host "Creating TrainerConnections table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name TrainerConnections `
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=trainerId,AttributeType=S `
    --key-schema AttributeName=id,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --global-secondary-indexes file://trainerconnections-gsi.json

# Community Posts Table
Write-Host "Creating CommunityPosts table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name CommunityPosts `
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=trainerId,AttributeType=S `
    --key-schema AttributeName=id,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --global-secondary-indexes file://communityposts-gsi.json

# Resources Table
Write-Host "Creating Resources table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name Resources `
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=trainerId,AttributeType=S `
    --key-schema AttributeName=id,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --global-secondary-indexes file://resources-gsi.json

# Clean up temporary files
Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
Remove-Item "users-gsi.json"
Remove-Item "workouts-gsi.json"
Remove-Item "trainerprofiles-gsi.json"
Remove-Item "clients-gsi.json"
Remove-Item "sessions-gsi.json"
Remove-Item "trainerconnections-gsi.json"
Remove-Item "communityposts-gsi.json"
Remove-Item "resources-gsi.json"

Write-Host "All tables created successfully!" -ForegroundColor Green
Write-Host "You can verify in AWS Console > DynamoDB > Tables" -ForegroundColor Cyan 