import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { SessionSettings, Gender, AvatarStyle, AudienceLevel, Duration, BackgroundPreset } from "@/lib/types";
import {
  VOICES, HOST_PERSONALITIES, GUEST_PERSONAS, AVATARS, BACKGROUND_PRESETS, DURATION_OPTIONS, RAJ_HOST,
} from "@/lib/constants";
import StudioPreview from "@/components/StudioPreview";
import AvatarSVG from "@/components/AvatarSVG";

const Setup = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState<Duration>("5");
  const [energy, setEnergy] = useState(50);
  const [audienceLevel, setAudienceLevel] = useState<AudienceLevel>("intermediate");
  const [hostPersonality, setHostPersonality] = useState(RAJ_HOST.personality);
  const [guestPersona, setGuestPersona] = useState(GUEST_PERSONAS[0].id);
  const [guestGender, setGuestGender] = useState<Gender>("female");
  const [guestVoiceId, setGuestVoiceId] = useState("");
  const [guestAvatarStyle, setGuestAvatarStyle] = useState<AvatarStyle>("3d");
  const [guestAvatar, setGuestAvatar] = useState("");
  const [background, setBackground] = useState<BackgroundPreset>("studio");

  const guestVoices = useMemo(() => VOICES.filter((v) => v.gender === guestGender), [guestGender]);
  const guestAvatars = useMemo(() => AVATARS.filter((a) => a.style === guestAvatarStyle), [guestAvatarStyle]);

  useMemo(() => {
    if (!guestVoiceId || !guestVoices.find((v) => v.id === guestVoiceId)) {
      setGuestVoiceId(guestVoices[0]?.id ?? "");
    }
  }, [guestVoices]);
  useMemo(() => {
    if (!guestAvatar || !guestAvatars.find((a) => a.id === guestAvatar)) {
      setGuestAvatar(guestAvatars[0]?.id ?? "");
    }
  }, [guestAvatars]);

  const handleStart = () => {
    if (!topic.trim()) return;
    const settings: SessionSettings = {
      topic: topic.trim(),
      duration,
      energy,
      audienceLevel,
      hostPersonality,
      guestPersona,
      hostGender: RAJ_HOST.gender,
      guestGender,
      hostVoiceId: RAJ_HOST.voiceId,
      guestVoiceId,
      hostAvatar: RAJ_HOST.avatarId,
      guestAvatar,
      background,
    };
    navigate("/live", { state: { settings } });
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{children}</h3>
  );

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">Session Setup</h1>
        </div>

        <motion.div className="flex flex-col gap-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Host card (fixed) */}
          <div className="flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <AvatarSVG variant={RAJ_HOST.avatarVariant} size={64} colors={RAJ_HOST.colors} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Your Host</p>
              <p className="text-lg font-bold text-foreground">{RAJ_HOST.name}</p>
              <p className="text-sm text-muted-foreground">{RAJ_HOST.tagline}</p>
            </div>
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-base font-medium">Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g. The future of AI agents in software development"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* Duration & Energy */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <SectionTitle>Duration</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDuration(opt.value as Duration)}
                    className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                      duration === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary/30 text-secondary-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <SectionTitle>Energy: {energy < 33 ? "Calm" : energy < 66 ? "Balanced" : "Hype"}</SectionTitle>
              <Slider value={[energy]} onValueChange={([v]) => setEnergy(v)} max={100} step={1} />
            </div>
          </div>

          {/* Audience Level */}
          <div className="space-y-3">
            <SectionTitle>Audience Level</SectionTitle>
            <RadioGroup value={audienceLevel} onValueChange={(v) => setAudienceLevel(v as AudienceLevel)} className="flex gap-4">
              {(["beginner", "intermediate", "expert"] as const).map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <RadioGroupItem value={level} id={level} />
                  <Label htmlFor={level} className="capitalize">{level}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Personalities */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <SectionTitle>Raj's Style</SectionTitle>
              <Select value={hostPersonality} onValueChange={setHostPersonality}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {HOST_PERSONALITIES.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.label} — {p.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <SectionTitle>Guest Persona</SectionTitle>
              <Select value={guestPersona} onValueChange={setGuestPersona}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GUEST_PERSONAS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.label} — {p.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Guest Customization */}
          <div className="space-y-4 rounded-xl border border-border bg-card/40 p-4">
            <SectionTitle>Guest Speaker</SectionTitle>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Gender</Label>
              <div className="flex gap-2">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGuestGender(g)}
                    className={`flex-1 rounded-lg border px-3 py-1.5 text-sm capitalize transition-all ${
                      guestGender === g ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Voice</Label>
              <Select value={guestVoiceId} onValueChange={setGuestVoiceId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {guestVoices.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Avatar Style</Label>
              <div className="flex gap-2">
                {(["realistic", "3d", "minimal"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setGuestAvatarStyle(s)}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs capitalize transition-all ${
                      guestAvatarStyle === s ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {guestAvatars.map((a) => {
                  const idx = parseInt(a.id.split("-").pop() || "0", 10);
                  return (
                    <button
                      key={a.id}
                      onClick={() => setGuestAvatar(a.id)}
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all ${
                        guestAvatar === a.id ? "border-primary scale-110" : "border-transparent"
                      }`}
                      style={{ background: a.colors.bg + "33" }}
                    >
                      <AvatarSVG variant={idx} size={40} colors={a.colors} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="space-y-3">
            <SectionTitle>Background</SectionTitle>
            <div className="flex flex-wrap gap-3">
              {BACKGROUND_PRESETS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBackground(bg.id as BackgroundPreset)}
                  className={`h-20 w-32 rounded-xl border-2 transition-all ${
                    background === bg.id ? "border-primary scale-105" : "border-transparent"
                  }`}
                  style={{ background: bg.gradient }}
                >
                  <span className="text-xs font-medium text-foreground/80">{bg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Studio Preview */}
          {guestAvatar && (
            <div className="space-y-3">
              <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">Studio Preview</h3>
              <StudioPreview guestAvatarId={guestAvatar} backgroundId={background} />
            </div>
          )}

          {/* Enter Live Room */}
          <Button
            size="lg"
            disabled={!topic.trim()}
            onClick={handleStart}
            className="gap-2 self-center rounded-xl px-12 py-6 text-lg font-bold"
          >
            <Radio className="h-5 w-5" />
            Enter Live Room
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Setup;
