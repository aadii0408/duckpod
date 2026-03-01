import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Play, Radio } from "lucide-react";
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
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">Episodes</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : episodes.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Radio className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No episodes yet. Start your first live podcast!</p>
            <Button asChild><Link to="/setup">Start a Podcast</Link></Button>
          </div>
        ) : (
          <motion.div className="flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {episodes.map((ep) => (
              <Link
                key={ep.id}
                to={`/episodes/${ep.id}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card/40 p-4 transition-all hover:border-primary/40 hover:bg-card/60"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Play className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{ep.topic}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDate(ep.created_at)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(ep.duration)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Episodes;
