# Component Guidelines: AXIVON LEARN

**Title:** Frontend Component Architecture & Best Practices  
**Purpose:** Rules for writing clean, reusable, accessible React components.  
**Status:** Approved Requirements  
**Owner:** Frontend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Component Rules
1. **Single Responsibility:** UI primitives (`components/common`) should only handle presentation. Feature modules (`features/*`) handle data orchestration.
2. **Explicit Props Interface:** Always define a TypeScript interface for component props.
3. **Semantic HTML:** Use proper tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<button>`) instead of generic `<div>` soup.
4. **Resilient States:** Every page consuming remote data must support Loading, Empty, and Error states.
