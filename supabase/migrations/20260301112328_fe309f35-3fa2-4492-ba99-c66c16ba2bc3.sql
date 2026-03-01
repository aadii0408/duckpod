
-- Create episodes table
CREATE TABLE public.episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  audio_url TEXT,
  transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
  show_notes JSONB,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required for MVP)
CREATE POLICY "Episodes are publicly readable"
  ON public.episodes FOR SELECT
  USING (true);

-- Public insert (for saving episodes without auth)
CREATE POLICY "Anyone can create episodes"
  ON public.episodes FOR INSERT
  WITH CHECK (true);

-- Storage bucket for episode audio
INSERT INTO storage.buckets (id, name, public) VALUES ('episodes', 'episodes', true);

-- Public read for episode audio files
CREATE POLICY "Episode audio is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'episodes');

-- Anyone can upload episodes
CREATE POLICY "Anyone can upload episode audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'episodes');
