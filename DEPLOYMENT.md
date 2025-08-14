# 🚀 Deployment Guide - Accountability App

## **Deployment Options**

### **1. Vercel (Recommended) - Easiest & Best for React Apps**

#### **Step 1: Prepare Your Repository**
```bash
# Make sure your code is committed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### **Step 2: Deploy to Vercel**
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### **Step 3: Environment Variables**
Add these to your Vercel project settings:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### **Step 4: Deploy**
- Click **"Deploy"**
- Your app will be live at: `https://your-project-name.vercel.app`

---

### **2. Netlify - Alternative Option**

#### **Step 1: Prepare for Netlify**
```bash
# Create a netlify.toml file
echo '[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200' > netlify.toml
```

#### **Step 2: Deploy**
1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login** with GitHub
3. **Click "New site from Git"**
4. **Choose your repository**
5. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Add environment variables** (same as Vercel)
7. **Deploy!**

---

### **3. GitHub Pages - Free Option**

#### **Step 1: Install gh-pages**
```bash
npm install --save-dev gh-pages
```

#### **Step 2: Update package.json**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/your-repo-name"
}
```

#### **Step 3: Deploy**
```bash
npm run deploy
```

---

## **🔧 Environment Setup**

### **Required Environment Variables**
Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### **Supabase Configuration**
1. **Go to your Supabase dashboard**
2. **Settings → API**
3. **Copy the URL and anon key**
4. **Add to your deployment platform's environment variables**

---

## **📱 PWA Configuration**

### **For Production PWA**
1. **Generate PWA icons** (if not done already):
   - `public/pwa-192x192.png`
   - `public/pwa-512x512.png`
   - `public/apple-touch-icon.png`

2. **Update manifest.json** with your domain:
   ```json
   {
     "start_url": "/",
     "scope": "/"
   }
   ```

---

## **🌐 Custom Domain (Optional)**

### **Vercel Custom Domain**
1. **Go to your Vercel project**
2. **Settings → Domains**
3. **Add your domain**
4. **Update DNS records** as instructed

### **Netlify Custom Domain**
1. **Go to your Netlify site**
2. **Domain settings**
3. **Add custom domain**
4. **Configure DNS**

---

## **🔍 Post-Deployment Checklist**

- [ ] **App loads correctly**
- [ ] **Database connection works**
- [ ] **User registration/login works**
- [ ] **Task creation/editing works**
- [ ] **Image uploads work**
- [ ] **PWA install prompt appears**
- [ ] **Theme customization works**
- [ ] **Mobile responsiveness**
- [ ] **Offline functionality**

---

## **🚨 Troubleshooting**

### **Common Issues:**

#### **1. Environment Variables Not Working**
- Make sure they're prefixed with `VITE_`
- Redeploy after adding environment variables

#### **2. Database Connection Errors**
- Check Supabase URL and key
- Verify RLS policies are set correctly
- Test connection in Supabase dashboard

#### **3. PWA Not Working**
- Check if HTTPS is enabled
- Verify manifest.json is accessible
- Test service worker registration

#### **4. Build Errors**
- Check Node.js version (use 16+)
- Clear node_modules and reinstall
- Check for missing dependencies

---

## **📊 Performance Optimization**

### **After Deployment:**
1. **Run Lighthouse audit**
2. **Optimize images** if needed
3. **Enable compression** (usually automatic)
4. **Monitor Core Web Vitals**

---

## **🔄 Continuous Deployment**

### **Automatic Deployments**
- **Vercel/Netlify**: Automatically deploy on git push
- **GitHub Pages**: Deploy on push to main branch

### **Manual Deployments**
```bash
# For Vercel
vercel --prod

# For Netlify
netlify deploy --prod

# For GitHub Pages
npm run deploy
```

---

## **🎯 Recommended: Vercel Deployment**

**Why Vercel is best for your app:**
- ✅ **Perfect for React/Vite apps**
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Easy environment variables**
- ✅ **Great PWA support**
- ✅ **Free tier is generous**
- ✅ **Excellent performance**

**Your app will be live in minutes! 🚀**
