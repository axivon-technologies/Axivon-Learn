# Contributing to AXIVON LEARN

Organization: Axivon Technologies  
Tagline: Learn. Build. Grow.  

Welcome to the **AXIVON LEARN** project. This guide outlines our shared Git integration workflow, branch conventions, pull request procedures, and code review criteria. All team members (UI/UX Designers, Frontend Developers, Backend Developers, Full Stack Developers, QA Engineers, and DevOps Engineers) operate within this single repository and must adhere to these standards.

---

## 1. Core Principles

1. **One Monorepo, Clean Boundaries**: All teams work in this repository (`AXIVON-LEARN`). Responsibilities are decoupled across `apps/`, `packages/`, `design/`, and `docs/` without creating disconnected sub-projects or individual silos.
2. **Never Commit Secrets**: Do not commit API keys, database credentials, JWT secrets, or local environment overrides (`.env`). Keep `.env.example` up to date with safe placeholders only.
3. **No Direct Pushes to Protected Branches**: Pushes directly to `main` and `develop` are strictly prohibited. All changes enter via reviewed and approved Pull Requests (PRs).
4. **Shared Definition of Done**: A task is only complete when it meets its acceptance criteria, passes linting/typechecks/tests, and contains clear documentation.

---

## 2. Branching Model and Naming Conventions

The repository follows a structured feature-branch workflow rooted on `main` (production-ready) and `develop` (active integration).

### Standard Branch Prefixes:

| Branch Type | Convention Pattern | Example | Purpose / Scope |
| :--- | :--- | :--- | :--- |
| **Production** | `main` | `main` | Production-ready, stable releases only. |
| **Integration** | `develop` | `develop` | Shared integration branch for active sprint deliverables. |
| **Frontend** | `feature/frontend-<feature>` | `feature/frontend-course-catalog` | UI components, React screens, client routing. |
| **Backend** | `feature/backend-<feature>` | `feature/backend-quiz-scoring` | API endpoints, controllers, models, DB queries. |
| **Full Stack** | `feature/fullstack-<feature>` | `feature/fullstack-admin-cms` | Cross-stack workflows, admin panels, shared contracts. |
| **UI/UX Design** | `feature/uiux-<feature>` | `feature/uiux-lesson-player-specs` | Design tokens, wireframes, user flows, SVG assets. |
| **Bug Fixes** | `fix/<issue-description>` | `fix/auth-token-refresh` | Defect resolution, hotfixes, edge-case patches. |
| **Documentation** | `docs/<document-description>` | `docs/api-specification-v1` | Architecture records, specs, onboarding updates. |

---

## 3. Commit Message Standards

We follow clean, descriptive commit messages. Every commit should describe *what* was done and *why*:

```text
<type>(<scope>): <short summary in imperative mood>

[optional body explaining rationale and context]

[optional footer referencing Task ID or Issue]
```

### Commit Types:
- `feat`: A new user-facing feature or API capability.
- `fix`: A bug fix or patch.
- `docs`: Documentation updates or additions only.
- `style`: Formatting, whitespace, or linting fixes with no logic change.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `test`: Adding or correcting tests.
- `chore`: Build process, dependency updates, or tool configurations.

### Examples:
- `feat(catalog): add category filter chips and loading skeleton`
- `feat(api/quizzes): implement submission evaluation and score persistence`
- `fix(auth): prevent session race condition on page refresh`
- `docs(onboarding): clarify backend test execution instructions`

---

## 4. Pull Request (PR) Workflow

1. **Task Assignment Check**: Ensure an authorized Task ID exists in `docs/onboarding/development-workflow.md` or the issue tracker before writing code.
2. **Branch from Upstream**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/frontend-course-detail
   ```
3. **Local Validation**:
   Before opening a PR, ensure all local checks pass:
   - TypeScript compilation passes (`tsc --noEmit`).
   - Relevant tests pass.
   - Code adheres to `.editorconfig` style rules.
4. **Open Pull Request**:
   - Title must follow: `[<TASK-ID>] <Brief summary>` (e.g., `[TASK-FE-03] Implement Course Detail Syllabus View`).
   - Fill out the PR template completely:
     - Linked Task ID / Issue.
     - Summary of changes.
     - Testing done (screenshots for UI changes).
     - Checklist confirming zero secrets committed.
5. **Code Review & Approval**:
   - At least one peer review is required from the relevant domain owner (Frontend Lead for frontend PRs, Backend Lead for backend PRs, Full Stack Lead for cross-cutting PRs).
   - Address feedback constructively and push revisions to the same branch.
6. **Merge Strategy**:
   - Squash and merge (or rebase merge) to maintain a linear and readable Git history.

---

## 5. Security & Secret Safeguards

- If you accidentally stage a secret, unstage it immediately before committing.
- In the event of an accidental secret push:
  1. Notify the DevOps & Security Lead immediately.
  2. Rotate the secret on the host service immediately.
  3. Never assume an amended commit is sufficient if already pushed to a remote.

---

## 6. Communication & Questions

- Daily blockers and dependency questions should be logged in the project workspace or raised to the Technical Project Manager.
- For design-to-code questions, consult `design/README.md` and collaborate with the UI/UX Lead.
