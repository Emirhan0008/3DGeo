# Firebase Security Specification & Dirty Dozen Test Strategy

## 1. Data Invariants
- A user document (`/users/{userId}`) can only be read, created, or updated by the authenticated owner whose `request.auth.uid` matches `{userId}`.
- All user progress data (`/users/{userId}/progress/{progressId}`) must be tied to `{userId}`.
- No public user profile or list queries are allowed for user profiles.

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
