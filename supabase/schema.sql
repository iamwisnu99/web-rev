-- ====================================================================
-- WebRev — Supabase Database Schema for Live Stream Room & Queue
-- ====================================================================
-- Petunjuk:
-- Salin dan jalankan seluruh isi query ini di Supabase SQL Editor
-- (Dashboard Supabase -> SQL Editor -> New Query -> Run)
-- ====================================================================

-- 1. Tabel Ruang Sesi Host Live
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_name TEXT NOT NULL,
    room_slug TEXT NOT NULL, -- contoh: "@Wisnu"
    is_active BOOLEAN DEFAULT TRUE,
    allow_submissions BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Antrean Masuk dari Penonton
CREATE TABLE IF NOT EXISTS public.queue_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    submitter_name TEXT NOT NULL,
    url TEXT NOT NULL,
    note TEXT DEFAULT '',
    status TEXT DEFAULT 'pending', -- 'pending' | 'in-progress' | 'reviewed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Index untuk performa query cepat
CREATE INDEX IF NOT EXISTS idx_submissions_room_id ON public.queue_submissions(room_id);
CREATE INDEX IF NOT EXISTS idx_rooms_id_active ON public.rooms(id, is_active);

-- 4. Aktifkan Supabase Realtime Replication untuk tabel submissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'queue_submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_submissions;
  END IF;
END $$;

-- 5. Row Level Security (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_submissions ENABLE ROW LEVEL SECURITY;

-- Reset policies jika sudah ada sebelumnya agar idempotent
DROP POLICY IF EXISTS "Public read rooms" ON public.rooms;
DROP POLICY IF EXISTS "Public create rooms" ON public.rooms;
DROP POLICY IF EXISTS "Public update rooms" ON public.rooms;
DROP POLICY IF EXISTS "Public delete rooms" ON public.rooms;
DROP POLICY IF EXISTS "Public read queue_submissions" ON public.queue_submissions;
DROP POLICY IF EXISTS "Public insert queue_submissions" ON public.queue_submissions;
DROP POLICY IF EXISTS "Public update queue_submissions" ON public.queue_submissions;
DROP POLICY IF EXISTS "Public delete queue_submissions" ON public.queue_submissions;

-- Policy: Publik dapat membaca room
CREATE POLICY "Public read rooms" ON public.rooms
    FOR SELECT USING (TRUE);

-- Policy: Publik / Host dapat membuat room baru
CREATE POLICY "Public create rooms" ON public.rooms
    FOR INSERT WITH CHECK (TRUE);

-- Policy: Host dapat update status room (misal aktif / tutup antrean)
CREATE POLICY "Public update rooms" ON public.rooms
    FOR UPDATE USING (TRUE);

-- Policy: Host dapat menghapus room dan sesi saat logout
CREATE POLICY "Public delete rooms" ON public.rooms
    FOR DELETE USING (TRUE);

-- Policy: Publik / Penonton dapat membaca submissions
CREATE POLICY "Public read queue_submissions" ON public.queue_submissions
    FOR SELECT USING (TRUE);

-- Policy: Penonton dapat submit URL jika room aktif dan menerima kiriman
CREATE POLICY "Public insert queue_submissions" ON public.queue_submissions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.rooms 
            WHERE id = room_id AND is_active = TRUE AND allow_submissions = TRUE
        )
    );

-- Policy: Host dapat memperbarui status submissions di room miliknya
CREATE POLICY "Public update queue_submissions" ON public.queue_submissions
    FOR UPDATE USING (TRUE);

-- Policy: Host dapat menghapus submissions
CREATE POLICY "Public delete queue_submissions" ON public.queue_submissions
    FOR DELETE USING (TRUE);
