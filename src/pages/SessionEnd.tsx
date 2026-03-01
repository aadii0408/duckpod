import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Library, Hash, Clock, CheckCircle, Radio, Copy, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

const ANTI_AI_REASONS = [
  "DuckPod uses AI as a creative tool under human direction — the user picks the topic, persona, energy, and steers the conversation in real-time. AI doesn't replace the human; it amplifies their curiosity.",
  "Every session is unique because a human decides what to explore, when to interrupt, and when to go deeper. AI generates content, but the editorial control stays with the user — making it a collaboration, not automation.",
  "Unlike passive AI content farms, DuckPod requires active human engagement. The producer note, steer chips, and interrupt controls ensure the human is always in the driver's seat — AI is the instrument, not the musician.",
];

const SessionEnd = () => {
  const location = useLocation();
  const state = location.state as SessionEndState | undefined;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");

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

  const handleSubmitReflection = () => {
    if (!q1 || !q2 || !q3.trim()) {
      toast({ title: "Please answer all questions", variant: "destructive" });
      return;
    }
    setFormSubmitted(true);
    toast({ title: "Reflection submitted!", description: "Thanks for your feedback." });
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

          {/* Anti-AI Reflection Form */}
          {!formSubmitted ? (
            <motion.div
              className="w-full space-y-6 rounded-2xl border-2 border-primary/30 bg-card/60 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-1 text-center">
                <h2 className="text-lg font-bold text-foreground">🎙️ Post-Podcast Reflection</h2>
                <p className="text-sm text-muted-foreground">
                  Help us understand how DuckPod supports human-first content creation.
                </p>
              </div>

              {/* Q1 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  1. Did you feel in control of the conversation direction?
                </Label>
                <RadioGroup value={q1} onValueChange={setQ1} className="space-y-2">
                  {[
                    { value: "full", label: "Yes — I steered the topic, pacing, and depth" },
                    { value: "partial", label: "Partially — I influenced some turns but AI led others" },
                    { value: "minimal", label: "Not really — the AI ran the show" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={`q1-${opt.value}`} />
                      <Label htmlFor={`q1-${opt.value}`} className="text-sm text-foreground/80">{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Q2 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  2. How would you describe AI's role in this podcast?
                </Label>
                <RadioGroup value={q2} onValueChange={setQ2} className="space-y-2">
                  {[
                    { value: "tool", label: "A creative tool — it helped me explore ideas faster" },
                    { value: "collaborator", label: "A collaborator — we built the conversation together" },
                    { value: "replacement", label: "A replacement — it did everything on its own" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={`q2-${opt.value}`} />
                      <Label htmlFor={`q2-${opt.value}`} className="text-sm text-foreground/80">{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Q3 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  3. What made this experience feel human-driven despite using AI?
                </Label>
                <Textarea
                  value={q3}
                  onChange={(e) => setQ3(e.target.value)}
                  placeholder="e.g. I chose the topic, I interrupted when the guest went off-track, I set the energy level..."
                  className="min-h-[80px] text-sm"
                />
              </div>

              <Button onClick={handleSubmitReflection} className="w-full gap-2">
                <Send className="h-4 w-4" />
                Submit Reflection
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="w-full space-y-4 rounded-2xl border border-primary/30 bg-primary/5 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-center text-lg font-bold text-primary">🛡️ Why DuckPod is Anti-AI</h3>
              <div className="space-y-3">
                {ANTI_AI_REASONS.map((reason, i) => (
                  <div key={i} className="flex gap-3 text-sm text-foreground/85">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <p>{reason}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                AI is the instrument. You are the musician. 🎵
              </p>
            </motion.div>
          )}

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
                  <span className="text-[10px] font-semibold text-muted-foreground">{gAv?.label ?? "Guest"}</span>
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
