# Architectural Decisions: AXIVON LEARN

**Title:** Core Architectural Decisions Index  
**Purpose:** Summary of foundational technology selections and architectural trade-offs.  
**Status:** Implemented  
**Owner:** Senior Full Stack Architect  
**Last Updated:** 2026-10-31  

---

## 1. Summary of Approved Key Decisions

| Decision Area | Selected Approach | Key Alternatives Considered | Primary Rationale |
| :--- | :--- | :--- | :--- |
| **Monorepo Architecture** | npm Workspaces | Turborepo, Nx, Multi-repo | Built-in to Node/npm; zero third-party orchestration complexity for small engineering teams. |
| **Frontend Framework** | React + Vite + TypeScript | Next.js, Remix, Plain HTML | Fastest HMR developer experience, simple static CDN deployment, rich component ecosystem. |
| **Styling Framework** | Vanilla CSS + Design Tokens | Tailwind CSS, CSS Modules | Zero build-step fragility, complete control over aesthetic dark glassmorphism, no version drift. |
| **Backend Framework** | Node.js + Express + TypeScript | NestJS, Fastify, Go | Universal team familiarity, lightweight footprint, modular route structure. |
| **Database Engine** | MongoDB + Mongoose | PostgreSQL, SQLite | Hierarchical syllabus data (Courses → Modules → Lessons) naturally maps to document schemas. |
| **Authentication Model** | HTTP-Only Secure Cookies + JWT | Session in Redis, LocalStorage JWT | Complete protection against XSS token theft while remaining stateless without Redis overhead. |
| **Video Playback** | Permitted YouTube Embeds | Self-hosted S3/CloudFront HLS | Drastically reduces MVP infrastructure costs while honoring copyright attribution. |
