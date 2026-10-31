# Security Policy: AXIVON LEARN

Organization: Axivon Technologies  
Product: AXIVON LEARN  
Status: Active  

---

## 1. Security Overview and Principles

AXIVON LEARN takes security seriously. As a learning platform handling user accounts, course data, and progress metrics, we enforce the following fundamental security principles across all development stages:

1. **Zero Secrets in Git**: No credentials, API tokens, passwords, private keys, or environment secrets may ever be committed to the repository. All secrets must remain in `.env` files (ignored by Git) or secure secret managers.
2. **Backend Enforcement of Authorization**: Hiding a UI button or navigational link in the frontend does NOT constitute authorization. The backend API (`apps/api`) MUST validate authentication and role-based authorization for every protected endpoint.
3. **Data Protection and Least Privilege**:
   - Visitors access only published public metadata.
   - Learners access and mutate only their own private progress, profile, and quiz records.
   - Administrative endpoints are strictly restricted to authenticated administrators.
4. **Input Validation and Sanitization**: All incoming request payloads (query params, URL parameters, request bodies) must be strictly validated before execution.
5. **Safe Logging**: Logs must never include plaintext passwords, session tokens, JWTs, or sensitive learner PII.

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability within the AXIVON LEARN codebase or deployed infrastructure, please report it immediately:

- **Email**: `security@axivon.com` (or direct escalation to the Axivon Security Lead)
- **Do NOT** file a public GitHub issue for sensitive security vulnerabilities.
- Provide a detailed explanation, including:
  - Description of the vulnerability.
  - Steps to reproduce or proof-of-concept.
  - Affected components, routes, or endpoints.
  - Suggested remediation if known.

We aim to acknowledge reports within 24 hours and issue fixes through prioritized hotfixes.

---

## 3. Incident Response and Secret Revocation

If any secret, credential, or production key is accidentally committed to Git:
1. Immediately notify the DevOps and Security Leads.
2. Revoke and rotate the compromised credential in the external service or database immediately.
3. Rewrite Git history to expunge the secret from all commits, branches, and reflogs.
4. Verify repository integrity before pushing.
