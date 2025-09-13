# Quick GitHub Deployment Guide

## 🚀 Step-by-Step GitHub Deployment

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** button → **"New repository"**
3. Repository name: `ddk-tech-website`
4. Description: `DDK TECH - Custom Business Web Apps & Websites`
5. Make it **Public** (required for free GitHub Pages)
6. **Don't** check "Add a README file"
7. Click **"Create repository"**

### Step 2: Upload Files (Easy Method)
1. Download [GitHub Desktop](https://desktop.github.com/) (recommended for beginners)
2. Install and sign in with your GitHub account
3. Click **"Clone a repository from the Internet"**
4. Select your `ddk-tech-website` repository
5. Choose a local folder (e.g., `C:\Users\Sanja\Desktop\ddk-tech-website`)
6. Click **"Clone"**

### Step 3: Copy Website Files
1. Copy ALL files from your current project folder to the cloned repository folder
2. Make sure these files are in the root:
   - `index.html`
   - `sitemap.xml`
   - `robots.txt`
   - `google-site-verification.html`
   - All folders: `css/`, `js/`, `pages/`, `public/`, `static/`

### Step 4: Commit and Push
1. In GitHub Desktop, you'll see all your files listed
2. Add a commit message: `"Initial website deployment"`
3. Click **"Commit to main"**
4. Click **"Push origin"**

### Step 5: Enable GitHub Pages
1. Go to your repository on GitHub.com
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** section
4. Under **"Source"**, select **"Deploy from a branch"**
5. Select **"main"** branch and **"/ (root)"** folder
6. Click **"Save"**

### Step 6: Access Your Website
Your website will be available at:
**`https://ddktechofficial.github.io/ddk-tech-website/`**

## 🔧 Important Notes

### File Structure Should Look Like:
```
ddk-tech-website/
├── index.html
├── sitemap.xml
├── robots.txt
├── google-site-verification.html
├── css/
│   ├── main.css
│   ├── matrix-animation.css
│   └── futuristic-eye.css
├── js/
│   ├── matrix-animation.js
│   ├── futuristic-eye.js
│   ├── mobile-smooth.js
│   ├── mobile-gsap-config.js
│   └── google-analytics.js
├── pages/
│   ├── homepage.html
│   ├── services_showcase.html
│   ├── about_experience.html
│   ├── technology_center.html
│   └── contact_hub.html
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── manifest.json
└── static/
    └── js/
        └── chatbot.js
```

### After Deployment:
1. **Test your website** at the GitHub Pages URL
2. **Set up Google Analytics** (get your GA4 ID and update `js/google-analytics.js`)
3. **Verify with Google Search Console** using your GitHub Pages URL
4. **Submit sitemap** to Google Search Console

## 🎯 Your Website URLs:
- **Homepage**: `https://ddktechofficial.github.io/ddk-tech-website/`
- **Services**: `https://ddktechofficial.github.io/ddk-tech-website/pages/services_showcase.html`
- **About**: `https://ddktechofficial.github.io/ddk-tech-website/pages/about_experience.html`
- **Technology**: `https://ddktechofficial.github.io/ddk-tech-website/pages/technology_center.html`
- **Contact**: `https://ddktechofficial.github.io/ddk-tech-website/pages/contact_hub.html`

## 🚨 Troubleshooting:
- **404 Error**: Make sure `index.html` is in the root folder
- **CSS/JS Not Loading**: Check file paths are correct
- **Images Not Showing**: Verify image paths in `public/` folder
- **Pages Not Found**: Ensure all files are in the correct folders

---

**Ready to deploy?** Follow these steps and your website will be live on GitHub Pages in minutes!
