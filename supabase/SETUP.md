# 🚀 Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in the details:
   - **Project name:** `sidata-desa-v2`
   - **Database password:** Create a strong password (SAVE THIS!)
   - **Region:** Southeast Asia (Singapore) - closest to Indonesia
   - **Pricing Plan:** Free
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to initialize

## Step 2: Get API Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values to your `.env.local`:
   ```bash
   # Project URL
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

   # Anon (public) key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Service role key (NEVER expose to client!)
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 3: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the ENTIRE content from `supabase/migration.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. Wait for completion - you should see:
   ```
   ✅ SIDATA DESA V2 database migration completed successfully!
   📊 Tables created: warga, tanah, bidang, approval_requests
   🗺️ PostGIS enabled with spatial indexes
   🔒 Row Level Security configured
   ⚡ Triggers and functions ready
   👁️ Views created for easy data access
   ```

## Step 4: Setup Storage for Photos

1. In Supabase dashboard, go to **Storage**
2. Click **"Create a new bucket"**
3. Bucket settings:
   - **Name:** `warga-photos`
   - **Public bucket:** ✅ Yes (so photos are publicly accessible)
4. Click **"Create bucket"**

### Setup Storage Policies:

Go to Storage → `warga-photos` → Policies:

1. **Allow public read:**
   ```sql
   CREATE POLICY "Public read warga photos"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'warga-photos');
   ```

2. **Allow authenticated upload:**
   ```sql
   CREATE POLICY "Authenticated users can upload warga photos"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'warga-photos' AND
     auth.role() = 'authenticated'
   );
   ```

## Step 5: Setup Authentication (Optional but Recommended)

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Disable email confirmation for development:
   - Go to **Authentication** → **Settings**
   - Turn OFF "Enable email confirmations"

### Create Test Users:

Go to **Authentication** → **Users** → **Add user**:

1. **Kepala Desa (Admin):**
   - Email: `kepala@pongangan.desa.id`
   - Password: `kepala123` (change this!)
   - User Metadata (Important!):
     ```json
     {
       "user_role": "kepala",
       "nama": "Kepala Desa Pongangan"
     }
     ```

2. **Staff:**
   - Email: `staff@pongangan.desa.id`
   - Password: `staff123` (change this!)
   - User Metadata:
     ```json
     {
       "user_role": "staff",
       "nama": "Staff Desa"
     }
     ```

## Step 6: Verify Setup

Run these queries in SQL Editor to verify:

```sql
-- Check tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check PostGIS
SELECT PostGIS_Version();

-- Check sample data
SELECT COUNT(*) FROM warga;
SELECT COUNT(*) FROM tanah;
SELECT COUNT(*) FROM bidang;

-- Test spatial query
SELECT
  id,
  nama_lengkap,
  ST_AsGeoJSON(geometry)::TEXT as geometry
FROM v_bidang_complete
LIMIT 3;
```

Expected results:
- ✅ 4 main tables (warga, tanah, bidang, approval_requests)
- ✅ PostGIS version 3.x
- ✅ 3 sample warga, 3 tanah, 3 bidang
- ✅ GeoJSON geometry output

## Step 7: Update Environment Variables

Create `.env.local` in project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-mapbox-token

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 8: Test Connection

Run the development server:

```bash
npm run dev
```

The app should connect to Supabase successfully!

## Troubleshooting

### "PostGIS extension not found"
- Make sure you ran the migration SQL completely
- Check if PostGIS is available: `SELECT * FROM pg_available_extensions WHERE name = 'postgis';`

### "Row Level Security" errors
- Verify RLS policies are created
- Check user metadata has `user_role` set

### "Storage bucket not found"
- Make sure you created the `warga-photos` bucket
- Verify bucket policies are set

## Next Steps

✅ Supabase setup complete!
✅ Now you can:
- Run the Next.js app
- Test CRUD operations
- Upload photos
- Use the map with real geometry data

---

**Need help?** Check Supabase docs: https://supabase.com/docs
