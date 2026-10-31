# Error & Loading States: AXIVON LEARN

**Title:** UI Feedback States & Shimmer Skeletons  
**Purpose:** Documentation of reusable loading skeletons, empty cards, and error fallbacks.  
**Status:** Implemented & Tested  
**Owner:** Frontend Lead Engineer  
**Last Updated:** 2026-10-31  

---

## 1. Tested Feedback Primitives
- `<LoadingState count={3} message="..." />`: Displays animated shimmer skeleton bars.
- `<EmptyState title="..." description="..." actionLabel="..." actionLink="..." />`: Friendly card for zero-result states.
- `<ErrorState title="..." message="..." onRetry={fn} />`: Red-bordered box with a retry action button.
- `<SuccessAlert title="..." message="..." />`: Green confirmation notification.
