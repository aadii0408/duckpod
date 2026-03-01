import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Square, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AvatarCard from "@/components/AvatarCard";
import TranscriptPanel from "@/components/TranscriptPanel";
import LiveControls from "@/components/LiveControls";
import { BACKGROUND_PRESETS } from "@/lib/constants";
import type { SessionSettings, TurnMessage, SessionMemory, Speaker } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

const LiveRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = (location.state as { settings?: SessionSettings })?.settings;

  const [transcript, setTranscript] = useState<TurnMessage[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<Speaker>("HOST");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(3);
  const sessionEndedRef = useRef(false);
  const isPausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const memoryRef = useRef<SessionMemory | null>(null);
  const producerNoteRef = useRef("");
  const steerRef = useRef("");
  const transcriptRef = useRef<TurnMessage[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Keep refs in sync
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);

  // Redirect if no settings
  useEffect(() => {
    if (!settings) navigate("/setup");
  }, [settings, navigate]);

  // Timer
  useEffect(() => {
    if (isPaused || sessionEndedRef.current) return;
    timerRef.current = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  // Check duration limit
  useEffect(() => {
    if (!settings || settings.duration === "unlimited") return;
    const limit = parseInt(settings.duration) * 60;
    if (timeElapsed >= limit && !sessionEndedRef.current) {
      handleEndSession();
    }
  }, [timeElapsed, settings]);

  // Countdown + Initialize session
  useEffect(() => {
    if (!settings) return;
    memoryRef.current = {
      topic: settings.topic,
      coveredPoints: [],
      currentAngle: "introduction",
      openQuestions: [],
      timeRemainingSeconds: settings.duration === "unlimited" ? 9999 : parseInt(settings.duration) * 60,
      turnCount: 0,
    };
    // 3-2-1 countdown
    let c = 3;
    setCountdown(c);
    const iv = setInterval(() => {
      c--;
      if (c <= 0) {
        clearInterval(iv);
        setCountdown(null);
        runTurn("HOST");
      } else {
        setCountdown(c);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [settings]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getDurationDisplay = () => {
    if (!settings) return "";
    if (settings.duration === "unlimited") return formatTime(timeElapsed);
    const limit = parseInt(settings.duration) * 60;
    return formatTime(Math.max(0, limit - timeElapsed));
  };

  const runTurn = useCallback(async (speaker: Speaker) => {
    if (!settings || sessionEndedRef.current) return;

    // Wait while paused
    while (isPausedRef.current && !sessionEndedRef.current) {
      await new Promise((r) => setTimeout(r, 500));
    }
    if (sessionEndedRef.current) return;

    setIsGenerating(true);
    setCurrentSpeaker(speaker);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      // Update memory time remaining
      if (memoryRef.current && settings.duration !== "unlimited") {
        memoryRef.current.timeRemainingSeconds = parseInt(settings.duration) * 60 - timeElapsed;
      }

      // Generate turn text
      const genResponse = await fetch(`${supabaseUrl}/functions/v1/generate-turn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          speaker,
          settings,
          memory: memoryRef.current,
          producerNote: producerNoteRef.current,
          steerDirective: steerRef.current,
        }),
      });

      if (!genResponse.ok) {
        const err = await genResponse.json().catch(() => ({}));
        throw new Error(err.error || "Failed to generate turn");
      }

      const turnData = await genResponse.json();
      const turnText = turnData.text || turnData.content || "";

      // Clear one-time directives
      producerNoteRef.current = "";
      steerRef.current = "";

      // Add to transcript
      const msg: TurnMessage = { speaker, text: turnText, timestamp: timeElapsed };
      setTranscript((prev) => [...prev, msg]);
      setIsGenerating(false);

      // Update memory
      if (memoryRef.current) {
        memoryRef.current.turnCount++;
        memoryRef.current.coveredPoints.push(turnText.slice(0, 80));
      }

      // Play TTS audio
      await playTTS(turnText, speaker === "HOST" ? settings.hostVoiceId : settings.guestVoiceId);

      // Next turn
      if (!sessionEndedRef.current) {
        await new Promise((r) => setTimeout(r, 600));
        runTurn(speaker === "HOST" ? "GUEST" : "HOST");
      }
    } catch (err: any) {
      console.error("Turn error:", err);
      setIsGenerating(false);
      toast({
        title: "Error generating turn",
        description: err.message,
        variant: "destructive",
      });
    }
  }, [settings, timeElapsed]);

  const playTTS = async (text: string, voiceId: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/tts-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({ text, voiceId }),
      });

      if (!response.ok) {
        throw new Error("TTS failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      setIsSpeaking(true);

      // Try to set up amplitude analysis
      try {
        if (!audioContextRef.current || audioContextRef.current.state === "closed") {
          audioContextRef.current = new AudioContext();
        }
        const ctx = audioContextRef.current;
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const trackAmplitude = () => {
          if (audio.paused || audio.ended) {
            setAmplitude(0);
            setIsSpeaking(false);
            return;
          }
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
          setAmplitude(avg);
          requestAnimationFrame(trackAmplitude);
        };
        audio.onplay = trackAmplitude;
      } catch {
        // Fallback: simulate amplitude
        const simulateAmp = () => {
          if (audio.paused || audio.ended) {
            setAmplitude(0);
            setIsSpeaking(false);
            return;
          }
          setAmplitude(0.3 + Math.random() * 0.5);
          requestAnimationFrame(simulateAmp);
        };
        audio.onplay = simulateAmp;
      }

      await audio.play();
      await new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsSpeaking(false);
          setAmplitude(0);
          resolve();
        };
      });
    } catch (err) {
      console.error("TTS error:", err);
      // Fallback: simulate speaking
      setIsSpeaking(true);
      const duration = 2000 + text.length * 40;
      const start = Date.now();
      await new Promise<void>((resolve) => {
        const animate = () => {
          const elapsed = Date.now() - start;
          if (elapsed >= duration) {
            setAmplitude(0);
            setIsSpeaking(false);
            resolve();
            return;
          }
          setAmplitude(0.2 + Math.random() * 0.6);
          requestAnimationFrame(animate);
        };
        animate();
      });
    }
  };

  const handleEndSession = async () => {
    sessionEndedRef.current = true;
    setIsSpeaking(false);
    setAmplitude(0);
    clearInterval(timerRef.current);

    const currentTranscript = transcriptRef.current;

    // Try to generate show notes and save episode
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      // Generate show notes
      const notesResp = await fetch(`${supabaseUrl}/functions/v1/generate-show-notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({ transcript: currentTranscript }),
      });

      let showNotes = null;
      if (notesResp.ok) {
        showNotes = await notesResp.json();
      }

      // Save episode
      await fetch(`${supabaseUrl}/functions/v1/upload-episode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          topic: settings!.topic,
          duration: timeElapsed,
          transcript: currentTranscript,
          showNotes,
          settings,
        }),
      });

      navigate("/session-end", {
        state: {
          settings,
          transcript: currentTranscript,
          duration: timeElapsed,
          showNotes,
        },
      });
    } catch (err) {
      console.error("End session error:", err);
      navigate("/session-end", {
        state: {
          settings,
          transcript: currentTranscript,
          duration: timeElapsed,
        },
      });
    }
  };

  if (!settings) return null;

  const bgPreset = BACKGROUND_PRESETS.find((b) => b.id === settings.background);
  const bgStyle = bgPreset ? bgPreset.gradient : undefined;

  // Countdown overlay
  if (countdown !== null) {
    return (
      <div className="flex h-screen flex-col items-center justify-center" style={{ background: bgStyle }}>
        <motion.div
          key={countdown}
          className="text-8xl font-bold text-primary"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {countdown}
        </motion.div>
        <p className="mt-4 text-sm uppercase tracking-widest text-muted-foreground">Going live…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col" style={{ background: bgStyle }}>
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border/30 bg-background/60 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <h2 className="max-w-md truncate text-sm font-semibold text-foreground">{settings.topic}</h2>
          {isGenerating && (
            <span className="animate-pulse rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
              Generating…
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-lg font-bold text-foreground">{getDurationDisplay()}</span>
          <Button variant="destructive" size="sm" onClick={handleEndSession} className="gap-1.5">
            <Square className="h-3 w-3" />
            End Session
          </Button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          {/* Avatars */}
          <div className="flex flex-1 items-center justify-center gap-8 px-8">
            <AvatarCard
              speaker="HOST"
              avatarId={settings.hostAvatar}
              isSpeaking={isSpeaking && currentSpeaker === "HOST"}
              amplitude={currentSpeaker === "HOST" ? amplitude : 0}
            />
            <AvatarCard
              speaker="GUEST"
              avatarId={settings.guestAvatar}
              isSpeaking={isSpeaking && currentSpeaker === "GUEST"}
              amplitude={currentSpeaker === "GUEST" ? amplitude : 0}
            />
          </div>

          {/* Controls */}
          <div className="px-6 pb-4">
            <LiveControls
              isPaused={isPaused}
              onTogglePause={() => setIsPaused(!isPaused)}
              onNextQuestion={() => { steerRef.current = "Move to next question immediately"; }}
              onInterrupt={() => { steerRef.current = "Host interrupts with a probing follow-up"; }}
              onSteer={(d) => { steerRef.current = d; }}
              onProducerNote={(n) => { producerNoteRef.current = n; }}
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 pb-3">
            <AlertTriangle className="h-3 w-3 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">
              AI-generated conversation for entertainment/education. Guest persona is fictional.
            </p>
          </div>
        </div>

        {/* Transcript */}
        <div className="w-80 border-l border-border/30 bg-background/60 backdrop-blur-md">
          <TranscriptPanel messages={transcript} className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default LiveRoom;
