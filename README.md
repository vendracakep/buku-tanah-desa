# 🌍 SIDATA DESA v2.0

**Modern Land Management System for Pongangan Village**

A complete redesign of SIDATA DESA (Sistem Informasi Data Tanah Desa) built with cutting-edge web technologies. This is a portfolio-grade application showcasing professional development practices, beautiful UI/UX, and production-ready code.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css)

---

## ✨ Features

### 🎯 Core Functionality
- **Land Registry Management** - Complete CRUD for land parcels (bidang)
- **Citizen Data Management** - Manage village citizen records (warga)
- **Land Ownership Tracking** - Track land ownership and transfers (tanah)
- **Approval Workflow** - Multi-level approval system for data changes
- **Interactive Maps** - Visualize land parcels with Mapbox GL + PostGIS
- **Geospatial Analysis** - Auto-calculate areas, detect overlaps

### 🎨 UI/UX Excellence
- **Beautiful Landing Page** - Portfolio-grade design with gradients and animations
- **Responsive Dashboard** - Modern admin interface with stats and quick actions
- **Clean Data Tables** - Sortable, searchable, with inline actions
- **Intuitive Forms** - Smart validation with real-time feedback
- **Smooth Animations** - Hover effects, transitions, loading states
- **Mobile-First Design** - Works perfectly on all devices

### ⚡ Technical Highlights
- **Full Type Safety** - End-to-end TypeScript with strict mode
- **PostGIS Integration** - Powerful geospatial queries with PostgreSQL
- **Real-time Data** - TanStack Query with optimistic updates
- **Form Validation** - Zod schemas with React Hook Form
- **Modern Stack** - Next.js 15 App Router, React 19
- **Production Ready** - Proper error handling, loading states

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.7 (Strict Mode)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **State Management:** TanStack Query v5 + Zustand
- **Forms:** React Hook Form v7 + Zod
- **Maps:** Mapbox GL JS v3 + react-map-gl
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Date/Time:** date-fns

### Backend
- **Database:** Supabase (PostgreSQL 15)
- **Geospatial:** PostGIS extension
- **Auth:** Supabase Auth with Row Level Security
- **Storage:** Supabase Storage for file uploads
- **Real-time:** Supabase Realtime subscriptions

### DevOps
- **Version Control:** Git + GitHub
- **Deployment:** Vercel (recommended)
- **Package Manager:** npm
- **Code Quality:** ESLint + TypeScript strict mode

---

## 📋 Current Progress

### ✅ Completed (Phase 1-3)

#### Foundation (100%)
- ✅ Next.js 15 project setup with TypeScript
- ✅ Tailwind CSS v4 with custom earth-tone colors
- ✅ All dependencies installed (20+ packages)
- ✅ Project structure organized

#### Database & Backend (100%)
- ✅ Supabase PostgreSQL + PostGIS setup
- ✅ Complete database schema:
  - `warga` (citizens) - 13 fields
  - `tanah` (land entries) - 6 fields
  - `bidang` (parcels) - 9 fields + PostGIS geometry!
  - `approval_requests` - 12 fields
- ✅ Spatial indexes (GIST) for fast queries
- ✅ Auto-calculate area from geometry (triggers)
- ✅ Row Level Security (RLS) policies
- ✅ Geospatial functions (get_bidang_in_bounds, find_overlapping_bidang)
- ✅ Sample seed data

#### Type Safety & Validation (100%)
- ✅ TypeScript types from database (700+ lines!)
- ✅ Zod validation schemas (warga, tanah, bidang)
- ✅ Type-safe form handling
- ✅ Helper constants for dropdowns

#### Data Layer (100%)
- ✅ Custom hooks with TanStack Query:
  - `useWarga` + CRUD operations
  - `useTanah` + CRUD operations
  - `useBidang` + CRUD operations + GeoJSON conversion
- ✅ Query key factories
- ✅ Optimistic UI updates
- ✅ Automatic cache invalidation

#### UI Components (50%)
- ✅ shadcn/ui base (Button, Card, Input, Label)
- ✅ Navbar (responsive with mobile menu)
- ✅ Sidebar (collapsible dashboard nav)
- ✅ Utility functions (cn, formatters)
- ⏳ More components coming...

#### Pages (40%)
- ✅ **Landing Page** - Beautiful hero, stats, features, CTA
- ✅ **Dashboard** - Main page with stats and quick actions
- ✅ **Warga List** - Table with search, stats, actions
- ✅ **Warga Create** - Comprehensive form with validation
- ⏳ Warga Edit/Detail pages
- ⏳ Tanah CRUD pages
- ⏳ Bidang CRUD pages
- ⏳ Map pages
- ⏳ Approval workflow pages

### 🔄 In Progress
- Warga edit and detail pages
- Tanah management pages
- Bidang management with map drawing
- Interactive map with Mapbox

### ⏳ Planned
- Approval workflow implementation
- Real-time notifications
- Export to PDF/CSV
- Charts and analytics
- File upload for photos
- Complete documentation

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Supabase account (free tier is fine!)
- Mapbox account for maps (optional for now)

### 1. Clone Repository

```bash
git clone https://github.com/vendracakep/buku-tanah-desa.git
cd buku-tanah-desa

# Checkout development branch
git checkout claude/rebuild-sidata-desa-01Tti7thho6oJjy9S6bFLoqm
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (~630 packages):
- Next.js, React, TypeScript
- Supabase client
- TanStack Query
- React Hook Form + Zod
- Tailwind CSS + plugins
- Mapbox GL
- And more...

### 3. Setup Supabase

**IMPORTANT:** You MUST setup Supabase for the app to work!

#### 3.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Sign up / Login (it's free!)
3. Click **"New Project"**
4. Fill in:
   - Name: `sidata-desa-v2`
   - Database Password: Create strong password (SAVE THIS!)
   - Region: **Singapore** (closest to Indonesia)
   - Plan: Free
5. Click **"Create new project"**
6. Wait 2-3 minutes

#### 3.2 Get API Credentials

1. In your project, go to **Settings → API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUz...
   ```

#### 3.3 Create Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.ey... # Optional for now
```

#### 3.4 Run Database Migration

1. Open Supabase dashboard → **SQL Editor**
2. Click **"New query"**
3. Copy **ALL content** from `supabase/migration.sql`
4. Paste into SQL editor
5. Click **"Run"** (or Ctrl+Enter)
6. Wait for success message

You should see:
```
✅ SIDATA DESA V2 database migration completed successfully!
📊 Tables created: warga, tanah, bidang, approval_requests
🗺️ PostGIS enabled with spatial indexes
```

**Detailed guide:** See `supabase/SETUP.md`

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

You should see the beautiful landing page! 🎉

---

## 📁 Project Structure

```
sidata-desa-v2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── warga/          # Warga CRUD
│   │   │   ├── tanah/          # Tanah CRUD
│   │   │   ├── bidang/         # Bidang CRUD
│   │   │   └── layout.tsx      # Dashboard layout
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── providers.tsx       # Query client provider
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Navbar, Sidebar
│   │   ├── features/           # Feature-specific
│   │   └── map/                # Map components
│   │
│   ├── lib/
│   │   ├── supabase/           # Supabase clients
│   │   ├── hooks/              # Custom React hooks
│   │   ├── validations/        # Zod schemas
│   │   └── utils/              # Utilities
│   │
│   └── types/
│       └── database.types.ts   # Database types
│
├── supabase/
│   ├── migration.sql           # Database schema
│   └── SETUP.md                # Setup guide
│
├── public/                     # Static assets
├── .env.example                # Environment template
├── .env.local                  # Your config (gitignored)
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind config
└── tsconfig.json               # TypeScript config
```

---

## 🎯 How to Use

### For Users

#### View Public Data
1. Visit home page: http://localhost:3000
2. Click **"Lihat Peta Interaktif"** or **"Jelajahi Data"**
3. Browse publicly available land data

#### Access Dashboard (Staff)
1. Visit http://localhost:3000/dashboard
2. Login with staff credentials
3. Manage warga, tanah, bidang data
4. Submit proposals for approval

#### Approve Changes (Kepala Desa)
1. Login as Kepala Desa
2. Go to Approval section
3. Review pending proposals
4. Approve or reject with notes

### For Developers

#### Add New Warga
```typescript
// Using the hook
const createWarga = useCreateWarga();

await createWarga.mutateAsync({
  nik: '3374012505850001',
  nama_lengkap: 'Budi Santoso',
  jenis_kelamin: 'Laki-laki',
  tanggal_lahir: new Date('1985-05-25'),
  // ... other fields
});
```

#### Query Bidang in Map Bounds
```typescript
const { data } = useBidangInBounds({
  minLng: 110.35,
  minLat: -7.06,
  maxLng: 110.37,
  maxLat: -7.04,
});
```

#### Validate Form Data
```typescript
import { wargaSchema } from '@/lib/validations';

const result = wargaSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.errors);
}
```

---

## 📸 Screenshots

### Landing Page
Beautiful hero section with gradient, stats cards, and feature showcase.

### Dashboard
Modern admin interface with statistics and quick actions.

### Warga Management
Complete CRUD with search, table, and comprehensive forms.

_(Screenshots coming soon after UI polish!)_

---

## 🗺️ Database Schema

### Tables

**warga** (Citizens)
- `id` - Primary key
- `nik` - 16-digit national ID (unique, optional)
- `nama_lengkap` - Full name (required)
- `jenis_kelamin` - Gender
- `tanggal_lahir` - Birth date (age ≥17 validation)
- `alamat_lengkap` - Full address
- And more...

**tanah** (Land Entries)
- `id` - Primary key
- `nomor_urut` - Unique land number (e.g., A.001/2024)
- `warga_id` - Owner reference
- `jumlah_m2` - Total area

**bidang** (Land Parcels) 🗺️
- `id` - Primary key
- `tanah_id` - Land reference
- `geometry` - **PostGIS Polygon** (WGS84, SRID 4326)
- `luas_m2` - Area (auto-calculated from geometry!)
- `status_hak` - Land rights status (HM, HGB, HP, etc.)
- `penggunaan` - Land usage type (14 options)

**approval_requests**
- Workflow system for data changes
- Tracks pending, approved, rejected proposals

See `supabase/migration.sql` for complete schema.

---

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit https://vercel.com/new
3. Import your repository
4. Add environment variables
5. Deploy!

### Environment Variables for Production

Add these in Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

---

## 📊 Performance

- **Lighthouse Score:** 90+ (target)
- **Bundle Size:** Optimized with code splitting
- **Database Queries:** Spatial indexes for fast geospatial operations
- **Real-time:** TanStack Query with smart caching

---

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome!

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📝 License

MIT License - feel free to use for learning and portfolio purposes.

---

## 🙏 Acknowledgments

- **Village:** Desa Pongangan, Gunungpati, Semarang
- **Original Team:** Laravel backend developers
- **Modern Stack:** Next.js, Supabase, Tailwind teams
- **UI Inspiration:** Linear, Vercel, Stripe, Cal.com

---

## 📞 Contact

For questions about this project:
- **Repository:** https://github.com/vendracakep/buku-tanah-desa
- **Issues:** https://github.com/vendracakep/buku-tanah-desa/issues

---

## 🎯 Roadmap

### Current Sprint (Week 1-2)
- ✅ Foundation & database setup
- ✅ Layout components
- ✅ Dashboard & Warga CRUD (in progress)
- ⏳ Complete all CRUD pages
- ⏳ Map integration

### Next Sprint (Week 3-4)
- ⏳ Approval workflow
- ⏳ File uploads (photos)
- ⏳ Export features (PDF, CSV)
- ⏳ Charts & analytics

### Future Enhancements
- 🔜 Dark mode
- 🔜 Advanced search & filters
- 🔜 Batch operations
- 🔜 Activity logs
- 🔜 Email notifications

---

**Built with ❤️ for modern land management**

*Last updated: 2024*
