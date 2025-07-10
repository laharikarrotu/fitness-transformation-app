# 🚀 **AWS Setup - Step by Step Guide**

## **Prerequisites**
- ✅ AWS Account created
- ✅ IAM User with access keys (from Step 1)

---

## **Step 1: IAM User Creation (Already Done)**

If you haven't created the IAM user yet:
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create user: `fitness-app-backend`
3. Attach policies: `AmazonDynamoDBFullAccess`, `AmazonS3FullAccess`
4. Create access keys and save them

---

## **Step 2: Configure AWS CLI**

### **2.1 Restart Your Terminal**
After installing AWS CLI, restart your PowerShell/Command Prompt.

### **2.2 Configure AWS CLI**
```powershell
aws configure
```

**Enter your credentials when prompted:**
- **AWS Access Key ID**: [Your Access Key ID]
- **AWS Secret Access Key**: [Your Secret Access Key]  
- **Default region name**: `us-east-1`
- **Default output format**: `json`

### **2.3 Test AWS CLI**
```powershell
aws sts get-caller-identity
```
This should show your AWS account info.

---

## **Step 3: Create DynamoDB Tables**

### **3.1 Run the Table Creation Script**
```powershell
.\create-tables.ps1
```

**This will create:**
- ✅ Users
- ✅ Workouts  
- ✅ TrainerProfiles
- ✅ Clients
- ✅ Sessions
- ✅ TrainerConnections
- ✅ CommunityPosts
- ✅ Resources

### **3.2 Verify Tables**
```powershell
aws dynamodb list-tables
```

---

## **Step 4: Create S3 Buckets**

### **4.1 Run the Bucket Creation Script**
```powershell
.\create-s3-buckets.ps1
```

**This will create:**
- ✅ fitness-progress-photos
- ✅ fitness-workout-videos
- ✅ fitness-profile-avatars

### **4.2 Verify Buckets**
```powershell
aws s3 ls
```

---

## **Step 5: Environment Variables**

### **5.1 Create .env.local**
```powershell
copy env.template .env.local
```

### **5.2 Edit .env.local**
Replace the placeholder values with your actual credentials:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_actual_access_key_id
AWS_SECRET_ACCESS_KEY=your_actual_secret_access_key
AWS_REGION=us-east-1

# DynamoDB Tables (use the names from the script)
AWS_DYNAMODB_USERS_TABLE=Users
AWS_DYNAMODB_WORKOUTS_TABLE=Workouts
AWS_DYNAMODB_TRAINER_PROFILES_TABLE=TrainerProfiles
AWS_DYNAMODB_CLIENTS_TABLE=Clients
AWS_DYNAMODB_SESSIONS_TABLE=Sessions
AWS_DYNAMODB_TRAINER_CONNECTIONS_TABLE=TrainerConnections
AWS_DYNAMODB_COMMUNITY_POSTS_TABLE=CommunityPosts
AWS_DYNAMODB_RESOURCES_TABLE=Resources

# S3 Configuration
AWS_S3_BUCKET_NAME=fitness-progress-photos
AWS_S3_REGION=us-east-1

# Auth0 Configuration (you'll add these later)
AUTH0_SECRET=your_auth0_secret_here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id_here
AUTH0_CLIENT_SECRET=your_auth0_client_secret_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
NODE_ENV=development
```

---

## **Step 6: Test the Setup**

### **6.1 Test Build**
```powershell
npm run build
```

### **6.2 Test Development Server**
```powershell
npm run dev
```

### **6.3 Test AWS Connection**
The app will show errors in console if AWS is not configured properly.

---

## **🔧 Troubleshooting**

### **Issue: "aws command not found"**
**Solution:** Restart your terminal after installing AWS CLI.

### **Issue: "Access Denied"**
**Solution:** Check your IAM user permissions and access keys.

### **Issue: "Table already exists"**
**Solution:** This is normal if you run the script twice. Tables are already created.

### **Issue: "Bucket already exists"**
**Solution:** S3 bucket names must be globally unique. Change the bucket names in the script.

---

## **✅ Verification Checklist**

- [ ] AWS CLI installed and configured
- [ ] IAM user created with proper permissions
- [ ] Access keys saved securely
- [ ] DynamoDB tables created (8 tables)
- [ ] S3 buckets created (3 buckets)
- [ ] Environment variables set in `.env.local`
- [ ] Build runs without errors
- [ ] Development server starts successfully

---

## **🎯 Next Steps**

After completing AWS setup:
1. **Set up Auth0** (see AUTH0_SETUP.md)
2. **Test the application**
3. **Deploy to production** (when ready)

---

**🎉 Congratulations! Your AWS backend is now ready!** 