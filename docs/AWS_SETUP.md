# AWS Backend Setup Guide

## 🚀 **Step 1: AWS Account Setup**

1. Create an AWS account at [aws.amazon.com](https://aws.amazon.com)
2. Set up billing and enable required services
3. Create an IAM user with programmatic access

## 🔑 **Step 2: IAM User & Permissions**

### **Create IAM User:**
1. Go to IAM Console → Users → Create User
2. Name: `fitness-app-backend`
3. Enable programmatic access
4. Attach policies:
   - `AmazonDynamoDBFullAccess`
   - `AmazonS3FullAccess`

### **Get Access Keys:**
1. Go to IAM Console → Users → fitness-app-backend
2. Security credentials → Create access key
3. Save the Access Key ID and Secret Access Key

## 🗄️ **Step 3: DynamoDB Tables**

### **Create Tables via AWS Console:**

#### **1. Users Table**
```json
{
  "TableName": "fitness-users",
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "S" },
    { "AttributeName": "auth0Id", "AttributeType": "S" }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "auth0Id-index",
      "KeySchema": [
        { "AttributeName": "auth0Id", "KeyType": "HASH" }
      ],
      "Projection": { "ProjectionType": "ALL" }
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

#### **2. Workouts Table**
```json
{
  "TableName": "fitness-workouts",
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "S" },
    { "AttributeName": "userId", "AttributeType": "S" }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "userId-index",
      "KeySchema": [
        { "AttributeName": "userId", "KeyType": "HASH" },
        { "AttributeName": "id", "KeyType": "RANGE" }
      ],
      "Projection": { "ProjectionType": "ALL" }
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

#### **3. Progress Table**
```json
{
  "TableName": "fitness-progress",
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "S" },
    { "AttributeName": "userId", "AttributeType": "S" }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "userId-index",
      "KeySchema": [
        { "AttributeName": "userId", "KeyType": "HASH" },
        { "AttributeName": "id", "KeyType": "RANGE" }
      ],
      "Projection": { "ProjectionType": "ALL" }
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

## 📦 **Step 4: S3 Buckets**

### **Create S3 Buckets:**

#### **1. Progress Photos Bucket**
- Bucket name: `fitness-progress-photos`
- Region: Same as your app
- Block all public access: **Enabled**
- Versioning: **Enabled**

#### **2. Workout Videos Bucket**
- Bucket name: `fitness-workout-videos`
- Region: Same as your app
- Block all public access: **Enabled**
- Versioning: **Enabled**

#### **3. Profile Avatars Bucket**
- Bucket name: `fitness-profile-avatars`
- Region: Same as your app
- Block all public access: **Enabled**
- Versioning: **Enabled**

### **Bucket Policies:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAppAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/fitness-app-backend"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
```

## ⚙️ **Step 5: Environment Variables**

### **Update your `.env.local`:**
```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1

# Auth0 Configuration
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# API Keys
NEXT_PUBLIC_GOOGLE_AI_KEY=your-google-ai-key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🧪 **Step 6: Test AWS Integration**

### **Test DynamoDB:**
1. Run your development server: `npm run dev`
2. Navigate to `/auth/login` and sign in
3. Check if user is created in DynamoDB

### **Test S3:**
1. Try uploading a profile photo
2. Check if file appears in S3 bucket

## 🔒 **Step 7: Security Best Practices**

### **IAM Policies:**
- Use least privilege principle
- Rotate access keys regularly
- Enable CloudTrail for audit logs

### **S3 Security:**
- Enable bucket encryption
- Set up lifecycle policies
- Configure CORS if needed

### **DynamoDB Security:**
- Enable encryption at rest
- Use VPC endpoints for production
- Set up backup and recovery

## 🚀 **Step 8: Production Deployment**

### **Update Environment Variables:**
```env
AWS_REGION=your-production-region
AUTH0_BASE_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### **Production Considerations:**
- Use AWS Secrets Manager for sensitive data
- Set up CloudWatch monitoring
- Configure auto-scaling
- Set up CI/CD pipeline

## 📊 **Step 9: Monitoring & Analytics**

### **CloudWatch Setup:**
- Monitor DynamoDB metrics
- Track S3 usage
- Set up alarms for errors

### **Cost Optimization:**
- Use DynamoDB on-demand billing
- Set up S3 lifecycle policies
- Monitor and optimize usage

## 🎉 **You're Ready!**

Your AWS backend is now configured with:
- ✅ **DynamoDB** for data storage
- ✅ **S3** for file storage
- ✅ **IAM** for secure access
- ✅ **Environment variables** configured
- ✅ **Security best practices** implemented

## 📚 **Next Steps**

1. **Test all API endpoints**
2. **Implement error handling**
3. **Add monitoring and logging**
4. **Set up backup strategies**
5. **Plan for scaling** 