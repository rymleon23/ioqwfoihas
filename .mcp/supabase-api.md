# Supabase API Reference

## Bien moi truong (local & Vercel)

Su dung cung mot bo Supabase credentials cho local va Vercel. Hien tai can giu ba key sau:

- `NEXT_PUBLIC_SUPABASE_URL=https://vtnlrnjpmjajujjuchnm.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bmxybmpwbWphanVqanVjaG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjMzNzUsImV4cCI6MjA3NDc5OTM3NX0.qj6Fd7wKVgq67WvwqqLjbYnGP0LiK3ypHQkFNoLIn-o`
- `SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bmxybmpwbWphanVqanVjaG5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzM3NSwiZXhwIjoyMDc0Nzk5Mzc1fQ.gGo9YXmAdq5vZkiqsfAsYwS2kq7n_Lsz6NPgqfChf0k`

### Local (.env.local)

```ini
NEXT_PUBLIC_SUPABASE_URL=https://vtnlrnjpmjajujjuchnm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bmxybmpwbWphanVqanVjaG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjMzNzUsImV4cCI6MjA3NDc5OTM3NX0.qj6Fd7wKVgq67WvwqqLjbYnGP0LiK3ypHQkFNoLIn-o
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bmxybmpwbWphanVqanVjaG5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzM3NSwiZXhwIjoyMDc0Nzk5Mzc1fQ.gGo9YXmAdq5vZkiqsfAsYwS2kq7n_Lsz6NPgqfChf0k
```

### Vercel (Settings -> Environment Variables)

- Dat ca ba key tren cho moi moi truong (Preview, Production).
- Danh dau `SUPABASE_SERVICE_ROLE` la server-side secret, khong nhung vao client bundles.
- Sau khi cap nhat, redeploy de secrets co hieu luc.

---

<anon-public-key>
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bmxybmpwbWphanVqanVjaG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjMzNzUsImV4cCI6MjA3NDc5OTM3NX0.qj6Fd7wKVgq67WvwqqLjbYnGP0LiK3ypHQkFNoLIn-o
</anon-public-key>
<service-role-key>
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bmxybmpwbWphanVqanVjaG5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzM3NSwiZXhwIjoyMDc0Nzk5Mzc1fQ.gGo9YXmAdq5vZkiqsfAsYwS2kq7n_Lsz6NPgqfChf0k
</service-role-key>
<database-url>
https://vtnlrnjpmjajujjuchnm.supabase.co
</database-url>
<storage-url>
https://vtnlrnjpmjajujjuchnm.supabase.co
</storage-url>
<graphql-url>
https://vtnlrnjpmjajujjuchnm.supabase.co/graphql/v1
</graphql-url>
<publishable-key>
sb_publishable_TaylPx9zHzB7luzOSOLKiA_Q9DVgUUd
</publishable-key>
<secret-key>
sb_secret_QEqh6_t544ZaINSPJLpJ7g_8h9dDoH0
</secret-key>
<jwt-secret>
6BmWmCbjizKxO0fhsRiS4AxBvyGBp66lrsMMUUk/8pw4tc6NFSQfgtwWFWLHz6fiql9e1kuCNfs/he2lnob4jw==
</jwt-secret>
<discovery-url>
https://vtnlrnjpmjajujjuchnm.supabase.co/auth/v1/.well-known/jwks.json
</discovery-url>
<public-key>
{
  "x": "yWZLhxRXoH02jiRB-B6VKtlFo5xiBCrGMqYAF1MEYmw",
  "y": "OfsQuAVcbFaCo8gQ8K-vKRFrsqrjBAYao8Khq1xB20s",
  "alg": "ES256",
  "crv": "P-256",
  "ext": true,
  "kid": "27f2b651-d1c2-431d-b205-49fe9f0c2383",
  "kty": "EC",
  "key_ops": [
    "verify"
  ]
}
</public-key>
<service-key>
SERVICE KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bmxybmpwbWphanVqanVjaG5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzM3NSwiZXhwIjoyMDc0Nzk5Mzc1fQ.gGo9YXmAdq5vZkiqsfAsYwS2kq7n_Lsz6NPgqfChf0k
</service-key>
Example usage
curl 'https://vtnlrnjpmjajujjuchnm.supabase.co/rest/v1/' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bmxybmpwbWphanVqanVjaG5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzM3NSwiZXhwIjoyMDc0Nzk5Mzc1fQ.gGo9YXmAdq5vZkiqsfAsYwS2kq7n_Lsz6NPgqfChf0k" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bmxybmpwbWphanVqanVjaG5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzM3NSwiZXhwIjoyMDc0Nzk5Mzc1fQ.gGo9YXmAdq5vZkiqsfAsYwS2kq7n_Lsz6NPgqfChf0k"
