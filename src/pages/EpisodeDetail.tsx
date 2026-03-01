import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Clock, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import TranscriptPanel from "@/components/TranscriptPanel";
import { supabase } from "@/integrations/supabase/client";
import type { TurnMessage } from "@/lib/types";

const EpisodeDetail = () => {
  const { id } = useParams();
  const [episode, setEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("episodes")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) setEpisode(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Episode not found.</p>
      </div>
    );
  }

  const showNotes = episode.show_notes as { title?: string; summary?: string; takeaways?: string[]; hashtags?: string[] } | null;
  const transcript = (episode.transcript || []) as TurnMessage[];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/episodes"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">{showNotes?.title || episode.topic}</h1>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{Math.floor(episode.duration / 60)} min</span>
            <span>{new Date(episode.created_at).toLocaleDateString()}</span>
          </div>

          {showNotes && (
            <div className="space-y-4 rounded-xl border border-border bg-card/40 p-6">
              {showNotes.summary && <p className="text-sm text-foreground/85">{showNotes.summary}</p>}
              {showNotes.takeaways?.length ? (
                <div>
                  <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Key Takeaways</h4>
                  <ul className="space-y-1">
                    {showNotes.takeaways.map((t, i) => (
                      <li key={i} className="flex gap-2 text-sm"><span className="text-primary">•</span>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {showNotes.hashtags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {showNotes.hashtags.map((h, i) => (
                    <span key={i} className="rounded-full bg-secondary/50 px-2 py-0.5 text-xs text-secondary-foreground">{h}</span>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          <div className="rounded-xl border border-border bg-card/40">
            <TranscriptPanel messages={transcript} className="max-h-[500px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetail;
