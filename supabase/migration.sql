-- ============================================================================
-- SIDATA DESA V2 - DATABASE MIGRATION
-- Modern Land Management System with PostGIS
-- ============================================================================

-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- TABLE: warga (Citizens)
-- ============================================================================
CREATE TABLE warga (
  id BIGSERIAL PRIMARY KEY,
  nik VARCHAR(16) UNIQUE,
  nama_lengkap VARCHAR(255) NOT NULL,
  jenis_kelamin VARCHAR(20) CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
  status_perkawinan VARCHAR(50) CHECK (status_perkawinan IN ('BELUM KAWIN', 'KAWIN', 'CERAI HIDUP', 'CERAI MATI')),

  tempat_lahir VARCHAR(255),
  tanggal_lahir DATE,

  agama VARCHAR(100),
  pendidikan_terakhir VARCHAR(100),
  pekerjaan VARCHAR(100),

  -- Store photo URL instead of base64 (use Supabase Storage)
  foto_ktp_url TEXT,

  kewarganegaraan VARCHAR(10) DEFAULT 'WNI' CHECK (kewarganegaraan IN ('WNI', 'WNA')),
  alamat_lengkap TEXT,
  keterangan TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT warga_nik_length CHECK (char_length(nik) = 16 OR nik IS NULL),
  CONSTRAINT warga_age_check CHECK (
    tanggal_lahir IS NULL OR
    DATE_PART('year', AGE(tanggal_lahir)) >= 17
  )
);

-- Indexes for warga
CREATE INDEX idx_warga_nik ON warga(nik);
CREATE INDEX idx_warga_nama ON warga(nama_lengkap);
CREATE INDEX idx_warga_created ON warga(created_at DESC);

-- ============================================================================
-- TABLE: tanah (Land Entries)
-- ============================================================================
CREATE TABLE tanah (
  id BIGSERIAL PRIMARY KEY,
  nomor_urut VARCHAR(64) UNIQUE NOT NULL,
  warga_id BIGINT REFERENCES warga(id) ON DELETE SET NULL,

  -- Total area (can be calculated from SUM of bidang.luas_m2)
  jumlah_m2 DECIMAL(14, 2),

  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT tanah_area_positive CHECK (jumlah_m2 IS NULL OR jumlah_m2 > 0)
);

-- Indexes for tanah
CREATE INDEX idx_tanah_warga ON tanah(warga_id);
CREATE INDEX idx_tanah_nomor ON tanah(nomor_urut);
CREATE INDEX idx_tanah_created ON tanah(created_at DESC);

-- ============================================================================
-- TABLE: bidang (Land Parcels with PostGIS geometry)
-- ============================================================================
CREATE TABLE bidang (
  id BIGSERIAL PRIMARY KEY,
  tanah_id BIGINT REFERENCES tanah(id) ON DELETE CASCADE NOT NULL,

  -- PostGIS geometry column (Polygon in WGS84)
  geometry GEOMETRY(Polygon, 4326) NOT NULL,

  -- Area in square meters (auto-calculated from geometry)
  luas_m2 DECIMAL(14, 2) NOT NULL,

  -- Land rights status
  status_hak VARCHAR(10) CHECK (status_hak IN ('HM','HGB','HP','HGU','HPL','MA','VI','TN')),

  -- Land usage type
  penggunaan VARCHAR(100) CHECK (penggunaan IN (
    'PERUMAHAN',
    'PERDAGANGAN_JASA',
    'PERKANTORAN',
    'INDUSTRI',
    'FASILITAS_UMUM',
    'SAWAH',
    'TEGALAN',
    'PERKEBUNAN',
    'PETERNAKAN_PERIKANAN',
    'HUTAN_BELUKAR',
    'HUTAN_LINDUNG',
    'MUTASI_TANAH',
    'TANAH_KOSONG',
    'LAIN_LAIN'
  )),

  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT bidang_area_positive CHECK (luas_m2 > 0),
  CONSTRAINT bidang_geometry_valid CHECK (ST_IsValid(geometry))
);

-- Spatial index for FAST geospatial queries
CREATE INDEX idx_bidang_geometry ON bidang USING GIST (geometry);

-- Regular indexes
CREATE INDEX idx_bidang_tanah ON bidang(tanah_id);
CREATE INDEX idx_bidang_status ON bidang(status_hak);
CREATE INDEX idx_bidang_penggunaan ON bidang(penggunaan);
CREATE INDEX idx_bidang_created ON bidang(created_at DESC);
CREATE INDEX idx_bidang_deleted ON bidang(deleted_at);

-- ============================================================================
-- TABLE: approval_requests (Workflow Approval)
-- ============================================================================
CREATE TABLE approval_requests (
  id BIGSERIAL PRIMARY KEY,

  -- Target module and action
  module VARCHAR(50) CHECK (module IN ('tanah', 'warga', 'bidang')) NOT NULL,
  action VARCHAR(50) CHECK (action IN ('create', 'update', 'delete')) NOT NULL,
  target_id BIGINT, -- ID of the target record (for update/delete)

  -- Proposed changes payload
  payload JSONB NOT NULL,

  -- Submitter and status
  submitted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),

  -- Review information (Kepala Desa)
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,

  -- Application to main table
  applied_at TIMESTAMPTZ,
  apply_error TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for approval_requests
CREATE INDEX idx_approvals_module_status ON approval_requests(module, status, created_at DESC);
CREATE INDEX idx_approvals_submitter ON approval_requests(submitted_by);
CREATE INDEX idx_approvals_reviewer ON approval_requests(reviewed_by);
CREATE INDEX idx_approvals_target ON approval_requests(target_id);

-- ============================================================================
-- FUNCTIONS: Auto-update timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER warga_updated_at BEFORE UPDATE ON warga
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tanah_updated_at BEFORE UPDATE ON tanah
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bidang_updated_at BEFORE UPDATE ON bidang
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER approval_requests_updated_at BEFORE UPDATE ON approval_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- FUNCTIONS: Auto-calculate bidang area from geometry
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_bidang_area()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate area in square meters using geography cast for accuracy
  NEW.luas_m2 = ST_Area(NEW.geometry::geography);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bidang_calculate_area BEFORE INSERT OR UPDATE OF geometry ON bidang
  FOR EACH ROW EXECUTE FUNCTION calculate_bidang_area();

-- ============================================================================
-- FUNCTIONS: Geospatial queries
-- ============================================================================

-- Get bidang within bounding box
CREATE OR REPLACE FUNCTION get_bidang_in_bounds(
  min_lng FLOAT,
  min_lat FLOAT,
  max_lng FLOAT,
  max_lat FLOAT
)
RETURNS TABLE (
  id BIGINT,
  tanah_id BIGINT,
  geometry_geojson TEXT,
  luas_m2 DECIMAL,
  status_hak VARCHAR,
  penggunaan VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.tanah_id,
    ST_AsGeoJSON(b.geometry)::TEXT as geometry_geojson,
    b.luas_m2,
    b.status_hak,
    b.penggunaan
  FROM bidang b
  WHERE b.deleted_at IS NULL
    AND ST_Intersects(
      b.geometry,
      ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
    );
END;
$$ LANGUAGE plpgsql;

-- Find overlapping bidang
CREATE OR REPLACE FUNCTION find_overlapping_bidang(
  target_geometry GEOMETRY,
  exclude_id BIGINT DEFAULT NULL
)
RETURNS TABLE (
  id BIGINT,
  tanah_id BIGINT,
  overlap_area_m2 FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.tanah_id,
    ST_Area(ST_Intersection(b.geometry::geography, target_geometry::geography))::FLOAT as overlap_area_m2
  FROM bidang b
  WHERE b.deleted_at IS NULL
    AND (exclude_id IS NULL OR b.id != exclude_id)
    AND ST_Overlaps(b.geometry, target_geometry);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE warga ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanah ENABLE ROW LEVEL SECURITY;
ALTER TABLE bidang ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

-- Public read access for warga, tanah, bidang
CREATE POLICY "Public read warga" ON warga
  FOR SELECT USING (true);

CREATE POLICY "Public read tanah" ON tanah
  FOR SELECT USING (true);

CREATE POLICY "Public read bidang" ON bidang
  FOR SELECT USING (deleted_at IS NULL);

-- Public read pending approvals (for transparency)
CREATE POLICY "Public read pending approvals" ON approval_requests
  FOR SELECT USING (status = 'pending' OR status = 'approved');

-- Staff can insert proposals
CREATE POLICY "Staff create proposals" ON approval_requests
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.jwt() ->> 'user_role' IN ('staff', 'kepala')
  );

-- Staff can view their own proposals
CREATE POLICY "Staff view own proposals" ON approval_requests
  FOR SELECT
  USING (
    submitted_by = auth.uid()
  );

-- Kepala can update/review all proposals
CREATE POLICY "Kepala review proposals" ON approval_requests
  FOR UPDATE
  USING (
    auth.jwt() ->> 'user_role' = 'kepala'
  );

-- Staff can modify warga/tanah/bidang (after approval applied)
CREATE POLICY "Staff modify warga" ON warga
  FOR ALL
  USING (
    auth.jwt() ->> 'user_role' IN ('staff', 'kepala')
  );

CREATE POLICY "Staff modify tanah" ON tanah
  FOR ALL
  USING (
    auth.jwt() ->> 'user_role' IN ('staff', 'kepala')
  );

CREATE POLICY "Staff modify bidang" ON bidang
  FOR ALL
  USING (
    auth.jwt() ->> 'user_role' IN ('staff', 'kepala')
  );

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Sample warga
INSERT INTO warga (nik, nama_lengkap, jenis_kelamin, tanggal_lahir, alamat_lengkap) VALUES
('3374012505850001', 'Budi Santoso', 'Laki-laki', '1985-05-25', 'Jl. Pongangan No. 12, Semarang'),
('3374012506900002', 'Siti Rahayu', 'Perempuan', '1990-06-25', 'Jl. Pongangan No. 45, Semarang'),
('3374012507880003', 'Ahmad Fauzi', 'Laki-laki', '1988-07-25', 'Jl. Pongangan No. 78, Semarang');

-- Sample tanah
INSERT INTO tanah (nomor_urut, warga_id, jumlah_m2) VALUES
('A.001/2024', 1, 500.00),
('A.002/2024', 2, 750.00),
('A.003/2024', 3, 1200.00);

-- Sample bidang with geometry
-- Note: These are example coordinates - replace with real Pongangan coordinates
INSERT INTO bidang (tanah_id, geometry, luas_m2, status_hak, penggunaan) VALUES
(
  1,
  ST_GeomFromText('POLYGON((110.362 -7.052, 110.363 -7.052, 110.363 -7.053, 110.362 -7.053, 110.362 -7.052))', 4326),
  500.00,
  'HM',
  'PERUMAHAN'
),
(
  2,
  ST_GeomFromText('POLYGON((110.364 -7.052, 110.365 -7.052, 110.365 -7.053, 110.364 -7.053, 110.364 -7.052))', 4326),
  750.00,
  'HGB',
  'PERDAGANGAN_JASA'
),
(
  3,
  ST_GeomFromText('POLYGON((110.366 -7.052, 110.367 -7.052, 110.367 -7.054, 110.366 -7.054, 110.366 -7.052))', 4326),
  1200.00,
  'HM',
  'SAWAH'
);

-- ============================================================================
-- VIEWS: Convenient data access
-- ============================================================================

-- View: Complete bidang data with owner information
CREATE OR REPLACE VIEW v_bidang_complete AS
SELECT
  b.id,
  b.tanah_id,
  b.luas_m2,
  b.status_hak,
  b.penggunaan,
  ST_AsGeoJSON(b.geometry)::TEXT as geometry_geojson,
  ST_X(ST_Centroid(b.geometry)) as centroid_lng,
  ST_Y(ST_Centroid(b.geometry)) as centroid_lat,
  b.keterangan as bidang_keterangan,
  b.created_at,
  b.updated_at,
  t.nomor_urut,
  t.jumlah_m2 as tanah_total_m2,
  t.keterangan as tanah_keterangan,
  w.id as warga_id,
  w.nik,
  w.nama_lengkap,
  w.alamat_lengkap
FROM bidang b
LEFT JOIN tanah t ON b.tanah_id = t.id
LEFT JOIN warga w ON t.warga_id = w.id
WHERE b.deleted_at IS NULL;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ SIDATA DESA V2 database migration completed successfully!';
  RAISE NOTICE '📊 Tables created: warga, tanah, bidang, approval_requests';
  RAISE NOTICE '🗺️  PostGIS enabled with spatial indexes';
  RAISE NOTICE '🔒 Row Level Security configured';
  RAISE NOTICE '⚡ Triggers and functions ready';
  RAISE NOTICE '👁️  Views created for easy data access';
END $$;
