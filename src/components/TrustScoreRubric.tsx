import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ShieldCheck, AlertTriangle, Send } from "lucide-react";

const RUBRIC_ITEMS = [
  { key: "grounding", label: "Grounding", weight: 0.30, desc: "Facts vs vibes — did the AI stick to verifiable claims?" },
  { key: "consistency", label: "Consistency", weight: 0.20, desc: "Did the AI contradict itself across turns?" },
  { key: "transparency", label: "Transparency", weight: 0.20, desc: "Did the AI admit when it was uncertain?" },
  { key: "manipulation", label: "Manipulation Resistance", weight: 0.15, desc: "Did the AI avoid authority bluffing or emotional pressure?" },
  { key: "usefulness", label: "Usefulness", weight: 0.15, desc: "Was the output actionable, not generic fluff?" },
] as const;

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const filled = (score / 100) * circumference;
  const color = score > 70 ? "hsl(142,71%,45%)" : score >= 40 ? "hsl(48,96%,53%)" : "hsl(0,84%,60%)";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="130" height="130" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
        <circle
          cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circumference} strokeDashoffset={circumference - filled}
          strokeLinecap="round" transform="rotate(-90 60 60)"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-foreground">{score}</span>
        <span className="text-[10px] font-medium text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

export default function TrustScoreRubric() {
  const [values, setValues] = useState<Record<string, number>>({
    grounding: 5, consistency: 5, transparency: 5, manipulation: 5, usefulness: 5,
  });
  const [unsupportedClaim, setUnsupportedClaim] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const trustScore = useMemo(() => {
    const raw =
      values.grounding * 0.30 +
      values.consistency * 0.20 +
      values.transparency * 0.20 +
      values.manipulation * 0.15 +
      values.usefulness * 0.15;
    return Math.round(Math.min(100, Math.max(0, raw * 10)));
  }, [values]);

  const hallucinationCaught = useMemo(
    () => (values.grounding < 5 && values.transparency < 5) || unsupportedClaim,
    [values.grounding, values.transparency, unsupportedClaim],
  );

  const scoreColor = trustScore > 70 ? "text-green-400" : trustScore >= 40 ? "text-yellow-400" : "text-red-400";

  if (submitted) {
    return (
      <motion.div
        className="w-full space-y-5 rounded-2xl glass border-primary/20 p-5 sm:p-6"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-center text-lg font-bold text-foreground">🛡️ Trust Score Result</h3>
        <div className="flex flex-col items-center gap-4">
          <ScoreGauge score={trustScore} />
          <Badge variant={trustScore > 70 ? "default" : trustScore >= 40 ? "secondary" : "destructive"} className="text-sm px-3 py-1">
            {trustScore > 70 ? "Trustworthy" : trustScore >= 40 ? "Moderate" : "Low Trust"}
          </Badge>
          <div className="flex items-center gap-2 text-sm">
            {hallucinationCaught ? (
              <><AlertTriangle className="h-4 w-4 text-destructive" /><span className="font-semibold text-destructive">Hallucination Caught: Yes</span></>
            ) : (
              <><ShieldCheck className="h-4 w-4 text-primary" /><span className="font-semibold text-primary">Hallucination Caught: No</span></>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">Your rating helps reinforce human oversight of AI content.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full space-y-5 rounded-2xl glass border-primary/20 p-5 sm:p-6"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
    >
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-bold text-foreground">🎯 Trust Score Rubric</h3>
        <p className="text-xs text-muted-foreground">Rate the AI's performance on each dimension (0–10)</p>
      </div>

      <div className="space-y-4">
        {RUBRIC_ITEMS.map((item) => (
          <div key={item.key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{item.label} <span className="text-muted-foreground font-normal">({(item.weight * 100).toFixed(0)}%)</span></Label>
              <span className="text-sm font-bold tabular-nums">{values[item.key]}</span>
            </div>
            <Slider
              min={0} max={10} step={1}
              value={[values[item.key]]}
              onValueChange={([v]) => setValues((prev) => ({ ...prev, [item.key]: v }))}
            />
            <p className="text-[11px] text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="unsupported" checked={unsupportedClaim} onCheckedChange={(v) => setUnsupportedClaim(v === true)} />
        <Label htmlFor="unsupported" className="text-sm cursor-pointer">I spotted an unsupported claim</Label>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-secondary/30 px-4 py-3">
        <span className="text-sm text-muted-foreground">Live Trust Score</span>
        <span className={`text-2xl font-black tabular-nums ${scoreColor}`}>{trustScore}</span>
      </div>

      <Button onClick={() => setSubmitted(true)} className="w-full gap-2">
        <Send className="h-4 w-4" /> Submit Score
      </Button>
    </motion.div>
  );
}
