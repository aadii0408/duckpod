import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Home, Library, Hash, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TranscriptPanel from "@/components/TranscriptPanel";
import type { SessionSettings, TurnMessage } from "@/lib/types";

interface SessionEndState {
  settings: SessionSettings;
  transcript: TurnMessage[];
  duration: number;
}

const SessionEnd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as SessionEndState | undefined;

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No session data found.</p>
          <Button asChild className="mt-4">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { settings, transcript, duration } = state;
  const minutes = Math.floor(duration / 60);
  const turns = transcript.length;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Success header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Session Complete!</h1>
            <p className="text-muted-foreground">{settings.topic}</p>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {minutes} min
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="h-4 w-4" />
              {turns} turns
            </div>
          </div>

          {/* Show notes placeholder */}
          <div className="w-full rounded-xl border border-border bg-card/40 p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Show Notes
            </h3>
            <p className="text-sm text-muted-foreground">
              Show notes will be auto-generated when connected to the backend (title, summary, key takeaways, hashtags).
            </p>
          </div>

          {/* Transcript */}
          <div className="w-full rounded-xl border border-border bg-card/40">
            <TranscriptPanel messages={transcript} className="max-h-80" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-1.5" disabled>
              <Download className="h-3.5 w-3.5" />
              Download MP3
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" disabled>
              <Download className="h-3.5 w-3.5" />
              Download Transcript
            </Button>
          </div>

          <div className="flex gap-3">
            <Button asChild>
              <Link to="/setup">New Session</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/episodes"><Library className="mr-1.5 h-4 w-4" />Episodes</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/"><Home className="mr-1.5 h-4 w-4" />Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SessionEnd;
