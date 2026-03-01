import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Hash, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TranscriptPanel from "@/components/TranscriptPanel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { TurnMessage } from "@/lib/types";

const EpisodeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEp = async () => {
      const { data, error } = await supabase
        .from("episodes")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) setEpisode(data);
      setLoading(false);
    };
    fetchEp();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from("episodes").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
      setDeleting(false);
    } else {
      toast({ title: "Episode deleted" });
      navigate("/episodes");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground">Episode not found.</p>
        <Button variant="outline" asChild><Link to="/episodes">Back to Episodes</Link></Button>
      </div>
    );
  }

  const showNotes = episode.show_notes as { title?: string; summary?: string; takeaways?: string[]; hashtags?: string[] } | null;
  const transcript = (episode.transcript || []) as TurnMessage[];

  return (
    <div className="section-padding py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" asChild className="mt-1 shrink-0">
              <Link to="/episodes"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl font-bold sm:text-2xl">{showNotes?.title || episode.topic}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{Math.floor(episode.duration / 60)} min</span>
                <span className="flex items-center gap-1"><Hash className="h-3.5 w-3.5" />{transcript.length} turns</span>
                <span>{new Date(episode.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={deleting}>
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this episode?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove "{episode.topic}" and its transcript. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex flex-col gap-5">
          {showNotes && (
            <div className="space-y-4 rounded-xl glass p-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Show Notes</h3>
              {showNotes.summary && <p className="text-sm leading-relaxed text-foreground/85">{showNotes.summary}</p>}
              {showNotes.takeaways?.length ? (
                <div>
                  <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Key Takeaways</h4>
                  <ul className="space-y-1.5">
                    {showNotes.takeaways.map((t, i) => (
                      <li key={i} className="flex gap-2 text-sm"><span className="text-primary">•</span>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {showNotes.hashtags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {showNotes.hashtags.map((h, i) => (
                    <span key={i} className="rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs text-secondary-foreground">{h}</span>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-border/50 bg-card/30">
            <TranscriptPanel messages={transcript} className="max-h-[500px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetail;
