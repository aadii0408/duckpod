import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Library, Hash, Clock, CheckCircle, Radio, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import TranscriptPanel from "@/components/TranscriptPanel";
import AvatarSVG from "@/components/AvatarSVG";
import { AVATARS, BACKGROUND_PRESETS, RAJ_HOST } from "@/lib/constants";
import type { SessionSettings, TurnMessage } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No session data found.</p>
        <Button asChild><Link to="/">Go Home</Link></Button>
      </div>
    );
  }

  const { settings, transcript, duration, showNotes } = state;
  const minutes = Math.floor(duration / 60);

  const copyTranscript = () => {
    const text = transcript.map((t) => `[${t.speaker}] ${t.text}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Transcript copied to clipboard." });
  };

  const downloadTranscript = () => {
    const text = transcript.map((t) => `[${t.speaker}] ${t.text}`).join("\n\n");
    const header = `# ${showNotes?.title || settings.topic}\nDuration: ${minutes} min | Turns: ${transcript.length}\n\n`;
    const blob = new Blob([header + text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `duckpod-${settings.topic.slice(0, 30).replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const gIdx = parseInt(settings.guestAvatar?.split("-").pop() || "0", 10);
  const gAv = AVATARS.find((a) => a.id === settings.guestAvatar);

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

          {/* Transcript */}
          <div className="w-full rounded-xl border border-border bg-card/40">
            <TranscriptPanel messages={transcript} className="max-h-80" />
          </div>

          {/* Export actions */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={copyTranscript} className="gap-1.5">
              <Copy className="h-3.5 w-3.5" />
              Copy Transcript
            </Button>
            <Button variant="outline" size="sm" onClick={downloadTranscript} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>

          {/* Shareable Episode Card */}
          <div className="w-full overflow-hidden rounded-2xl border border-border" style={{
            background: BACKGROUND_PRESETS.find((b) => b.id === settings.background)?.gradient ?? "hsl(225, 25%, 8%)",
          }}>
            <div className="flex flex-col items-center gap-4 p-8">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary">DuckPod</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{showNotes?.title || settings.topic}</h3>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <AvatarSVG variant={RAJ_HOST.avatarVariant} size={64} colors={RAJ_HOST.colors} />
                  <span className="text-[10px] font-semibold text-muted-foreground">{RAJ_HOST.name}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <AvatarSVG variant={gIdx} size={64} colors={gAv?.colors ?? { bg: "hsl(270,60%,55%)", skin: "hsl(25,55%,65%)", accent: "hsl(168,80%,50%)" }} />
                  <span className="text-[10px] font-semibold text-muted-foreground">Guest</span>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{minutes} min</span>
                <span>•</span>
                <span>{transcript.length} turns</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
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
