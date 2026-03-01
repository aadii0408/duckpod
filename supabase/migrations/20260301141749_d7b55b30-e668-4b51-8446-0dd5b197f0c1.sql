
-- Allow deleting episodes
CREATE POLICY "Anyone can delete episodes"
ON public.episodes
FOR DELETE
USING (true);
