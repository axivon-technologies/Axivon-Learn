# Frontend Architecture: AXIVON LEARN

**Title:** Client Application Architecture Specification  
**Purpose:** Details the React application design, layout hierarchies, state management, and styling architecture in `apps/web`.  
**Status:** Implemented  
**Owner:** Frontend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Core Architecture Patterns

1. **Feature-Sliced Architecture:** Rather than grouping files exclusively by type (`components/`, `pages/`), business capabilities live under `apps/web/src/features/` (`catalog`, `courses`, `lessons`, `quizzes`, `progress`, `auth`, `admin`).
2. **Layout Shells:** Route components are nested inside purpose-built layout shells:
   - `PublicLayout`: Global sticky header, main container, public footer.
   - `AuthLayout`: Centered brand card container with ambient glow.
   - `LearnerLayout`: Global header with active learner session toolbar and quick links.
   - `AdminLayout`: Specialized administrative header with CMS warning banner and management shortcuts.
3. **State Management:**
   - **Local State:** React `useState` for form inputs, accordion expansion, and modal toggles.
   - **Server State:** TanStack React Query handles caching, background re-validation, and error recovery.
4. **Resilient Feedback States:** No screen renders raw unhandled promises. Every view handles:
   - `<LoadingState />`: Skeleton shimmer placeholders during data load.
   - `<EmptyState />`: Friendly guidance and action buttons when lists are empty.
   - `<ErrorState />`: User-friendly error message with a manual "Retry Request" trigger.
