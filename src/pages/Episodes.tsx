import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Play, Radio, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface EpisodeRow {
  id: string;
  topic: string;
  duration: number;
  created_at: string;
}

const Episodes = () => {
  const [episodes, setEpisodes] = useState<EpisodeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      const { data, error } = await supabase
        .from("episodes")
        .select("id, topic, duration, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setEpisodes(data);
      }
      setLoading(false);
    };
    fetchEpisodes();
  }, []);

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
            {episodes.map((ep, i) => (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/episodes/${ep.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card/30 p-4 transition-all hover:border-primary/30 hover:bg-card/50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <Play className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-foreground">{ep.topic}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(ep.created_at)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(ep.duration)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Episodes;
