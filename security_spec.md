# Firebase Security Specification & Dirty Dozen Test Strategy

## 1. Data Invariants
- A user document (`/users/{userId}`) can only be read, created, or updated by the authenticated owner whose `request.auth.uid` matches `{userId}`.
- All user progress data (`/users/{userId}/progress/{progressId}`) must be tied to `{userId}`.
- No public user profile or list queries are allowed for user profiles.
- Feedbacks (`/feedbacks/{feedbackId}`) are write-only (create) with strict ID sanitization and message payload length validation (5-2000 chars); read/list/update/delete are blocked.
- Rumuz profiles (`/rumuzes/{rumuzId}`) have deletion disabled in security rules (`allow delete: if false;`) to prevent unauthorized mass wiping.

## 2. Dirty Dozen Test Vectors
1. Unauthenticated read attempt on `/users/user123` -> PERMISSION_DENIED.
2. Authenticated user A trying to read `/users/userB` -> PERMISSION_DENIED.
3. Authenticated user A trying to write to `/users/userB` -> PERMISSION_DENIED.
4. Anonymous user trying to create a document with arbitrary ID -> PERMISSION_DENIED.
5. User trying to write document with malicious oversized ID -> PERMISSION_DENIED.
6. User trying to write document with non-matching `uid` in payload -> PERMISSION_DENIED.
7. User A listing all documents in `/users` collection -> PERMISSION_DENIED.
8. User A reading User B's `/users/userB/progress/stats` -> PERMISSION_DENIED.
9. User A writing to User B's `/users/userB/progress/stats` -> PERMISSION_DENIED.
10. Attempt to spoof `auth.uid` via unverified email header -> PERMISSION_DENIED.
11. Attempt to inject arbitrary nested keys into progress data -> PERMISSION_DENIED.
12. Attempt to write to default deny root path `/randomCollection/doc` -> PERMISSION_DENIED.
13. Public list or read attempt on `/feedbacks` -> PERMISSION_DENIED.
14. Malicious feedback payload with empty or oversized message (>2000 chars) -> PERMISSION_DENIED.
15. Delete attempt on any `/rumuzes/{rumuzId}` -> PERMISSION_DENIED.
16. Unauthorized PIN or score tampering on `/rumuzes/{rumuzId}` (modifying another user's profile without matching hashed PIN or setting score > 5,000,000) -> PERMISSION_DENIED.
17. Attempt to delete an active match in `/duels/{duelId}` during `playing` status -> PERMISSION_DENIED.
18. High-frequency API scraping/DoS on `/api/gemini/explain` or `/api/gemini/analyze` -> 429 Too Many Requests via sliding-window Rate Limiter.
19. Console / LocalStorage prototype pollution attempt (`__proto__`, `constructor`) -> Intercepted, sanitized, and rejected by `sanitizeStoredStats` in `useStore.ts`.
20. Profile credentials exposure via leaderboard scraping -> Salted SHA-256 PIN hashing and immediate credential scrubbing from client memory in `fetchGlobalLeaderboard`.
