# Auth0 Setup Guide

## 🚀 **Step 1: Create Auth0 Account**

1. Go to [Auth0.com](https://auth0.com) and create a free account
2. Create a new tenant (your app's domain)

## 🔧 **Step 2: Create Application**

1. In Auth0 Dashboard, go to **Applications** → **Applications**
2. Click **Create Application**
3. Choose **Regular Web Application**
4. Name it "Fitness Transformation App"

## ⚙️ **Step 3: Configure Application**

### **Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback
http://localhost:3000/dashboard
```

### **Allowed Logout URLs:**
```
http://localhost:3000
http://localhost:3000/auth/login
```

### **Allowed Web Origins:**
```
http://localhost:3000
```

## 🔑 **Step 4: Environment Variables**

Create a `.env.local` file in your project root:

```env
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret-here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'

# Next.js Configuration
NEXTAUTH_SECRET='your-nextauth-secret'
NEXTAUTH_URL='http://localhost:3000'

# API Keys
NEXT_PUBLIC_GOOGLE_AI_KEY='your-google-ai-key'
NEXT_PUBLIC_API_URL='http://localhost:3000/api'
```

## 🎯 **Step 5: Get Your Credentials**

1. **Client ID**: Found in your Auth0 application settings
2. **Client Secret**: Found in your Auth0 application settings
3. **Domain**: Your Auth0 tenant domain (e.g., `your-tenant.auth0.com`)
4. **Secret**: Generate a random string for `AUTH0_SECRET`

## 🔒 **Step 6: Security Settings**

### **In Auth0 Dashboard:**

1. **Rules**: Create custom rules for user profile management
2. **Actions**: Set up post-login actions for user data
3. **Hooks**: Configure pre-registration hooks if needed

### **Example Rule for User Profile:**
```javascript
function (user, context, callback) {
  const namespace = 'https://fitness-app.com/';
  context.idToken[namespace + 'preferences'] = {
    weight: 0,
    height: 0,
    age: 0,
    fitnessLevel: 'beginner',
    goals: []
  };
  callback(null, user, context);
}
```

## 🧪 **Step 7: Test Your Setup**

1. Run your development server: `npm run dev`
2. Navigate to `http://localhost:3000/auth/login`
3. Click "Sign In" to test Auth0 integration
4. You should be redirected to Auth0 login page

## 📱 **Step 8: Social Logins (Optional)**

### **Google Login:**
1. In Auth0 Dashboard, go to **Authentication** → **Social**
2. Enable **Google**
3. Add your Google OAuth credentials

### **Facebook Login:**
1. In Auth0 Dashboard, go to **Authentication** → **Social**
2. Enable **Facebook**
3. Add your Facebook OAuth credentials

## 🔄 **Step 9: Production Deployment**

### **Update Environment Variables for Production:**
```env
AUTH0_BASE_URL='https://your-domain.com'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
```

### **Update Allowed URLs in Auth0:**
- **Callback URLs**: `https://your-domain.com/api/auth/callback`
- **Logout URLs**: `https://your-domain.com`
- **Web Origins**: `https://your-domain.com`

## 🎉 **You're Ready!**

Your Auth0 integration is now complete. Users can:
- ✅ Sign up with email/password
- ✅ Sign in with social providers
- ✅ Access protected routes
- ✅ Manage their profiles
- ✅ Secure logout

## 📚 **Next Steps**

1. **User Profile Management**: Implement profile update functionality
2. **Role-Based Access**: Add user roles and permissions
3. **Multi-Factor Authentication**: Enable MFA for enhanced security
4. **Analytics**: Set up Auth0 analytics for user insights 