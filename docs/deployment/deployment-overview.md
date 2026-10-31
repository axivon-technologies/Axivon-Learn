# Deployment Overview: AXIVON LEARN

**Title:** Production Deployment & Hosting Architecture  
**Purpose:** Details hosting targets for static web frontend, Node.js API, and managed MongoDB.  
**Status:** Architecture Ready  
**Owner:** DevOps Lead  
**Last Updated:** 2026-10-31  

---

## 1. Hosting Architecture
- **Frontend (`apps/web`):** Static host / CDN (Vercel, Netlify, Cloudflare Pages, or Nginx).
- **Backend API (`apps/api`):** Node.js-capable runtime (Render, Railway, AWS ECS, or DigitalOcean App Platform).
- **Database:** Managed MongoDB Atlas cluster.
