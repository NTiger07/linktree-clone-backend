# Linktree Clone Backend (Express migration)

This repository is a migration of the original Spring Boot backend to an Express.js + MongoDB implementation.

Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URI`, `SUPABASE_URL`, `SUPABASE_KEY`, and `SUPABASE_BUCKET`.
2. Install dependencies:

```powershell
npm install
```

3. Start server in development:

```powershell
npm run dev
```

API base: `/linktree-api/v1/user`

Endpoints mirror the original Java controller: get user by username, create user, update-info, update-links, update-link, update-socials, delete-link, upload-profile-picture.
