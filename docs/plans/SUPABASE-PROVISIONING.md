# Supabase Provisioning Plan

This plan details the steps to provision the Supabase project for the Marketing OS application.

## Goal

Set up a production-ready Supabase project with necessary extensions, storage buckets, and environment configuration.

## User Review Required

> [!IMPORTANT]
> You will need to log in to the [Supabase Dashboard](https://supabase.com/dashboard) to perform these actions.

## Steps

### 1. Create Supabase Project

1. Log in to Supabase.
2. Click "New Project".
3. Choose your organization.
4. **Name**: `marketing-os-circle` (or your preferred name).
5. **Database Password**: Generate a strong password and **save it** (you will need it for the connection string).
6. **Region**: Choose a region close to your users (e.g., Singapore for Vietnam).
7. Click "Create new project".

### 2. Enable Extensions

> [!NOTE]
> The migration file `20251002090000_init.sql` already contains `create extension if not exists "pgvector";`. However, it's good practice to verify.

1. Go to **Database** -> **Extensions** in the sidebar.
2. Search for `pgvector`.
3. Ensure it is enabled.
4. Search for `pgcrypto`.
5. Ensure it is enabled.

### 3. Configure Storage Buckets

We need to create the following buckets for file storage:

1. Go to **Storage** in the sidebar.
2. **Bucket: `avatars`**
   - Click "New Bucket".
   - Name: `avatars`
   - Public: **Yes** (Profiles need to be publicly visible).
   - Save.
3. **Bucket: `attachments`**
   - Click "New Bucket".
   - Name: `attachments`
   - Public: **No** (Protected by RLS).
   - Save.
4. **Bucket: `drive_docs`**
   - Click "New Bucket".
     SUPABASE_SERVICE_ROLE_KEY=<Your Service Role Key>
   ```

   ```

### 5. Run Migrations

First, ensure you are logged in to the Supabase CLI:

```bash
npx supabase login
```

(This will open your browser to authenticate)

Then, link your local project to the remote project:

```bash
npx supabase link --project-ref vtnlrnjpmjajujjuchnm
```

(Enter your database password when prompted)

Once linked, run the migrations:

```bash
pnpm supabase db push
```

(Or if you are using the CLI linked to the remote project: `supabase db push`)

### 6. Seed Data (Optional)

To populate the database with initial data:

```bash
pnpm seed:supabase
```

## Verification

- Run `pnpm dev` and check if the app connects without errors.

## Troubleshooting

### Error: `PGRST106: The schema must be one of the following: graphql_public`

- **Cause**: The `public` schema is not exposed in the API settings.
- **Fix**: Go to **Settings** -> **API** -> **Exposed schemas** and add `public`.

### Error: `PGRST205: Could not find the table ... in the schema cache`

- **Cause**: The API cache is stale and doesn't know about the new tables yet.
- **Fix**:
   1. Go to **Settings** -> **API**.
   2. Click the **"Reload schema cache"** button (usually near the top or bottom).
   3. Alternatively, restart the project in **Settings** -> **General** -> **Restart project**.
