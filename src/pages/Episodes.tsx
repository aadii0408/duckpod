import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Play, Radio, Mic, Trash2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EpisodeRow {
  id: string;
  topic: string;
  duration: number;
  created_at: string;
}

const Episodes = () => {
  const [episodes, setEpisodes] = useState<EpisodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      const { data, error } = await supabase
        .from("episodes")
        .select("id, topic, duration, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) setEpisodes(data);
      setLoading(false);
    };
    fetchEpisodes();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from("episodes").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    } else {
      setEpisodes((prev) => prev.filter((ep) => ep.id !== id));
      toast({ title: "Episode deleted" });
    }
    setDeleting(null);
  };

  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)} min`;
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="section-padding py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Episodes</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your podcast library</p>
          </div>
          <Button asChild size="sm" className="gap-1.5">
            <Link to="/setup">
              <Mic className="h-3.5 w-3.5" />
              New Podcast
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : episodes.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50">
              <Radio className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">No episodes yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Start your first live podcast!</p>
            </div>
            <Button asChild>
              <Link to="/setup">Start a Podcast</Link>
            </Button>
          </div>
        ) : (
          <motion.div className="flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AnimatePresence>
              {episodes.map((ep, i) => (
                <motion.div
                  key={ep.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="group flex items-center gap-2 rounded-xl border border-border/50 bg-card/30 transition-all hover:border-primary/30 hover:bg-card/50">
                    <Link
                      to={`/episodes/${ep.id}`}
                      className="flex flex-1 items-center gap-4 p-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                        <Play className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-foreground">{ep.topic}</h3>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{formatDate(ep.created_at)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(ep.duration)}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mr-2 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                          disabled={deleting === ep.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete episode?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove "{ep.topic}" and its transcript. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(ep.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Episodes;
