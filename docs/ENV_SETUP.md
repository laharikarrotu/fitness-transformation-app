# 🔧 **Environment Variables Setup Guide**

## **Overview**

This guide will help you set up all the necessary environment variables for the Fitness Transformation App to run smoothly with AWS, Auth0, and other integrations.

## **🚀 Quick Setup**

### **1. Create .env.local file**

Copy the `env.template` file to `.env.local` in your project root:

```bash
cp env.template .env.local
```

### **2. Fill in your actual values**

Edit `.env.local` and replace the placeholder values with your actual credentials.

## **📋 Required Environment Variables**

### **🔑 AWS Configuration**

```bash
# AWS Access Keys (Get these from AWS IAM Console)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1

# DynamoDB Table Names (Create these in AWS Console)
AWS_DYNAMODB_USERS_TABLE=Users
AWS_DYNAMODB_WORKOUTS_TABLE=Workouts
AWS_DYNAMODB_TRAINER_PROFILES_TABLE=TrainerProfiles
AWS_DYNAMODB_CLIENTS_TABLE=Clients
AWS_DYNAMODB_SESSIONS_TABLE=Sessions
AWS_DYNAMODB_TRAINER_CONNECTIONS_TABLE=TrainerConnections
AWS_DYNAMODB_COMMUNITY_POSTS_TABLE=CommunityPosts
AWS_DYNAMODB_RESOURCES_TABLE=Resources

# S3 Bucket (Create this in AWS Console)
AWS_S3_BUCKET_NAME=your-fitness-app-bucket
AWS_S3_REGION=us-east-1
```

### **🔐 Auth0 Configuration**

```bash
# Auth0 Settings (Get these from Auth0 Dashboard)
AUTH0_SECRET=your_auth0_secret_here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id_here
AUTH0_CLIENT_SECRET=your_auth0_client_secret_here
```

### **⚙️ Next.js Configuration**

```bash
# Next.js Settings
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
NODE_ENV=development
```

## **🔧 How to Get These Values**

### **AWS Credentials**

1. **Go to AWS Console** → IAM → Users
2. **Create a new user** or use existing
3. **Attach policies** for DynamoDB and S3 access
4. **Create access keys** and copy them

**Required IAM Policies:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:*",
        "s3:*"
      ],
      "Resource": "*"
    }
  ]
}
```

### **Auth0 Setup**

1. **Go to Auth0 Dashboard** → Applications
2. **Create a new application** (Single Page Application)
3. **Copy the Domain, Client ID, and Client Secret**
4. **Set Allowed Callback URLs** to `http://localhost:3000/api/auth/callback`
5. **Set Allowed Logout URLs** to `http://localhost:3000`

### **Generate Secrets**

For `AUTH0_SECRET` and `NEXTAUTH_SECRET`, generate random strings:

```bash
# Generate a random secret (run this in terminal)
openssl rand -base64 32
```

## **📁 File Structure**

Your project should have this structure:

```
fitness-transformation-app/
├── .env.local          # Your actual environment variables (not in git)
├── env.template        # Template file (safe to commit)
├── .gitignore          # Should include .env.local
└── src/
    └── lib/
        └── aws/
            └── config.ts  # Uses environment variables
```

## **🔒 Security Best Practices**

### **1. Never commit .env.local**
Make sure `.env.local` is in your `.gitignore`:

```gitignore
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### **2. Use different values for different environments**
- **Development**: Use test AWS account and Auth0 dev app
- **Production**: Use production AWS account and Auth0 prod app

### **3. Rotate credentials regularly**
- Change AWS access keys every 90 days
- Update Auth0 secrets periodically

## **🚀 Testing Your Setup**

### **1. Check if AWS is configured**
The app includes a helper function to check AWS configuration:

```typescript
import { isAWSConfigured } from '@/lib/aws/config';

if (!isAWSConfigured()) {
  console.error('AWS not properly configured');
}
```

### **2. Test Auth0 connection**
Try logging in through the app to verify Auth0 is working.

### **3. Test AWS connections**
The app will show errors in the console if AWS credentials are invalid.

## **🐛 Common Issues**

### **Issue: "AWS credentials not found"**
**Solution:** Check that `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set correctly.

### **Issue: "Auth0 configuration error"**
**Solution:** Verify all Auth0 environment variables are correct and the application is properly configured in Auth0 dashboard.

### **Issue: "DynamoDB table not found"**
**Solution:** Create the required DynamoDB tables in AWS Console or update the table names in environment variables.

### **Issue: "S3 bucket not found"**
**Solution:** Create the S3 bucket in AWS Console or update the bucket name in environment variables.

## **📊 Environment Variable Reference**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | ✅ | AWS access key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | ✅ | AWS secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | ✅ | AWS region | `us-east-1` |
| `AUTH0_SECRET` | ✅ | Auth0 secret | `your_auth0_secret_here` |
| `AUTH0_BASE_URL` | ✅ | App base URL | `http://localhost:3000` |
| `AUTH0_ISSUER_BASE_URL` | ✅ | Auth0 domain | `https://your-domain.auth0.com` |
| `AUTH0_CLIENT_ID` | ✅ | Auth0 client ID | `your_auth0_client_id_here` |
| `AUTH0_CLIENT_SECRET` | ✅ | Auth0 client secret | `your_auth0_client_secret_here` |
| `NEXTAUTH_SECRET` | ✅ | NextAuth secret | `your_nextauth_secret_here` |
| `YOUTUBE_API_KEY` | ❌ | YouTube API key | `your_youtube_api_key_here` |
| `GEMINI_API_KEY` | ❌ | Google Gemini API key | `your_gemini_api_key_here` |

## **🎯 Next Steps**

1. ✅ **Create `.env.local`** with your actual values
2. ✅ **Set up AWS account** and create required resources
3. ✅ **Configure Auth0** application
4. ✅ **Test the build** with `npm run build`
5. ✅ **Start development** with `npm run dev`

## **📞 Support**

If you encounter issues:

1. **Check the console** for error messages
2. **Verify environment variables** are set correctly
3. **Test AWS credentials** in AWS Console
4. **Check Auth0 configuration** in Auth0 Dashboard
5. **Review the setup guides** for AWS and Auth0

---

**🎉 Once you've set up your environment variables, your app should build and run smoothly!** 