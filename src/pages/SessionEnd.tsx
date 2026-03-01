import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Home, Library, Hash, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TranscriptPanel from "@/components/TranscriptPanel";
import type { SessionSettings, TurnMessage } from "@/lib/types";

interface SessionEndState {
  settings: SessionSettings;
  transcript: TurnMessage[];
  duration: number;
  showNotes?: {
    title: string;
    summary: string;
    takeaways: string[];
    hashtags: string[];
  };
}

const SessionEnd = () => {
  const location = useLocation();
  const state = location.state as SessionEndState | undefined;

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No session data found.</p>
        <Button asChild className="mt-4"><Link to="/">Go Home</Link></Button>
      </div>
    );
  }

  const { settings, transcript, duration, showNotes } = state;
  const minutes = Math.floor(duration / 60);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <motion.div className="flex flex-col items-center gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{showNotes?.title || "Session Complete!"}</h1>
            <p className="text-muted-foreground">{settings.topic}</p>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />{minutes} min
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="h-4 w-4" />{transcript.length} turns
            </div>
          </div>

          {/* Show notes */}
          {showNotes && (
            <div className="w-full space-y-4 rounded-xl border border-border bg-card/40 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Show Notes</h3>
              {showNotes.summary && <p className="text-sm text-foreground/85">{showNotes.summary}</p>}
              {showNotes.takeaways?.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Key Takeaways</h4>
                  <ul className="space-y-1">
                    {showNotes.takeaways.map((t, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground/80">
                        <span className="text-primary">•</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {showNotes.hashtags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {showNotes.hashtags.map((h, i) => (
                    <span key={i} className="rounded-full bg-secondary/50 px-2 py-0.5 text-xs text-secondary-foreground">{h}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="w-full rounded-xl border border-border bg-card/40">
            <TranscriptPanel messages={transcript} className="max-h-80" />
          </div>

          <div className="flex gap-3">
            <Button asChild><Link to="/setup">New Session</Link></Button>
            <Button variant="outline" asChild><Link to="/episodes"><Library className="mr-1.5 h-4 w-4" />Episodes</Link></Button>
            <Button variant="ghost" asChild><Link to="/"><Home className="mr-1.5 h-4 w-4" />Home</Link></Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SessionEnd;
