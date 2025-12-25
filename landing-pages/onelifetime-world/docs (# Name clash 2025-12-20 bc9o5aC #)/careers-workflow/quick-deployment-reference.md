# Code of Conduct Carousel - Quick Command Reference
## DWS6 Automated Deployment | onelifetime.world/careers

---

## ⚡ 60-SECOND DEPLOYMENT CHEAT SHEET

```bash
# 1. NAVIGATE TO PROJECT
cd ~/projects/onelifetime-world

# 2. CREATE FEATURE BRANCH
git checkout -b feature/code-of-conduct-carousel

# 3. CREATE DIRECTORIES
mkdir -p app/careers/components app/careers/styles public/documents

# 4. ADD FILES (copy from delivered package)
# - CodeOfConductCarousel.tsx → app/careers/components/
# - carousel-animations.css → app/careers/styles/
# - code-of-conduct.pdf → public/documents/

# 5. INSTALL DEPENDENCY
npm install lucide-react

# 6. UPDATE CAREERS PAGE
# Edit app/careers/page.tsx - add:
# import CodeOfConductCarousel from './components/CodeOfConductCarousel';
# <CodeOfConductCarousel /> in your JSX

# 7. TEST LOCALLY
npm run dev
# Visit: http://localhost:3000/careers

# 8. BUILD FOR PRODUCTION
npm run build

# 9. COMMIT & DEPLOY
git add .
git commit -m "feat(careers): add Code of Conduct carousel"
git push origin feature/code-of-conduct-carousel

# 10. MERGE TO MAIN (or create PR)
git checkout main
git merge feature/code-of-conduct-carousel
git push origin main

# ✅ CLOUDFLARE AUTO-DEPLOYS IN 2-3 MINUTES
```

---

## 🎯 MINIMAL CAREERS PAGE TEMPLATE

If `app/careers/page.tsx` doesn't exist, create it:

```typescript
import React from 'react';
import CodeOfConductCarousel from './components/CodeOfConductCarousel';

export const metadata = {
  title: 'Careers - Lifetime Consulting Oy',
  description: 'Join our team building enterprise AI for climate tech.',
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl">Building DWS IQ 6 - Enterprise AI for Climate Tech</p>
        </div>
      </section>

      <section className="py-16">
        <CodeOfConductCarousel />
      </section>

      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Join?</h2>
        <a href="mailto:hr@lifetime.fi" 
           className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold">
          Apply Now
        </a>
      </section>
    </main>
  );
}
```

---

## 📊 VERIFICATION CHECKLIST

After deployment, test these URLs:

```bash
✓ https://onelifetime.world/careers
✓ https://onelifetime.world/documents/code-of-conduct.pdf
```

**Browser Tests**:
- [ ] Desktop: Carousel navigation works
- [ ] Mobile: Touch swipe works  
- [ ] Language toggle (Fi/En) works
- [ ] PDF downloads successfully
- [ ] No console errors

---

## 🚨 QUICK TROUBLESHOOTING

**Build Failed?**
```bash
# Check logs: Cloudflare Dashboard → Deployments → View logs
# Common fix: Ensure lucide-react in dependencies
npm install --save lucide-react
git add package.json && git commit -m "fix: deps" && git push
```

**Carousel Not Showing?**
```bash
# Check import path in app/careers/page.tsx:
import CodeOfConductCarousel from './components/CodeOfConductCarousel';
# Path is relative to page.tsx location
```

**PDF 404?**
```bash
# Verify file location:
ls -lh public/documents/code-of-conduct.pdf
# If missing: cp code-of-conduct.pdf public/documents/
```

---

## 💰 COST IMPACT

**Additional Monthly Cost**: €0  
**Your Total**: Still $3.50/month  
**Deployment Time**: 2-3 minutes (automated)

---

## 📁 PROJECT STRUCTURE REFERENCE

```
onelifetime-world/
├── app/
│   └── careers/
│       ├── page.tsx              ← Modify: Add carousel
│       ├── components/
│       │   └── CodeOfConductCarousel.tsx  ← New
│       └── styles/
│           └── carousel-animations.css    ← New (optional)
├── public/
│   └── documents/
│       └── code-of-conduct.pdf   ← New
├── package.json                  ← Modified: +lucide-react
└── next.config.js
```

---

## ⏱️ TIMELINE

| Step | Time | Action |
|------|------|--------|
| 1-4 | 10 min | Add files to project |
| 5 | 2 min | Install dependency |
| 6 | 15 min | Update careers page |
| 7-8 | 15 min | Test & build locally |
| 9 | 5 min | Commit & push |
| Auto | 2-3 min | Cloudflare deploys |
| **Total** | **~50 min** | **Ready to use** |

---

## 🔗 QUICK LINKS

**Cloudflare Dashboard**: https://dash.cloudflare.com/  
**GitHub Enterprise**: https://github.com/enterprises/Lifetime-oy  
**Support Email**: risto@lifetime.fi

---

## 📝 DEPLOYMENT COMMAND (ONE-LINER)

For future quick deployments:

```bash
git add . && git commit -m "feat: update Code of Conduct" && git push origin main
```

Cloudflare auto-deploys in 2-3 minutes. No other steps needed! ✅

---

**This implementation uses your existing DWS6 Git-based automated deployment process.**  
**No manual steps. No additional tools. Just push to Git and go live.**
