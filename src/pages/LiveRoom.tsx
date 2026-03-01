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
  const [sessionEnded, setSessionEnded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const memoryRef = useRef<SessionMemory | null>(null);
  const producerNoteRef = useRef<string>("");
  const steerRef = useRef<string>("");

  // Redirect if no settings
  useEffect(() => {
    if (!settings) navigate("/setup");
  }, [settings, navigate]);

  // Timer
  useEffect(() => {
    if (isPaused || sessionEnded) return;
    timerRef.current = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [isPaused, sessionEnded]);

  // Check duration limit
  useEffect(() => {
    if (!settings || settings.duration === "unlimited") return;
    const limit = parseInt(settings.duration) * 60;
    if (timeElapsed >= limit) {
      handleEndSession();
    }
  }, [timeElapsed, settings]);

  // Initialize session memory
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
    // Start first turn
    generateTurn("HOST");
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
    const remaining = Math.max(0, limit - timeElapsed);
    return formatTime(remaining);
  };

  const generateTurn = useCallback(
    async (speaker: Speaker) => {
      if (!settings || sessionEnded || isPaused) return;
      setIsGenerating(true);
      setCurrentSpeaker(speaker);

      try {
        // Call edge function to generate turn
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
          // Demo mode: generate placeholder text
          await simulateTurn(speaker);
          return;
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/generate-turn`, {
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

        if (!response.ok) throw new Error("Failed to generate turn");
        const data = await response.json();
        const turnText = data.text;

        // Clear one-time directives
        producerNoteRef.current = "";
        steerRef.current = "";

        // Add to transcript
        const msg: TurnMessage = { speaker, text: turnText, timestamp: timeElapsed };
        setTranscript((prev) => [...prev, msg]);

        // Update memory
        if (memoryRef.current) {
          memoryRef.current.turnCount++;
          memoryRef.current.coveredPoints.push(turnText.slice(0, 50));
        }

        // TTS playback
        await playTTS(turnText, speaker === "HOST" ? settings.hostVoiceId : settings.guestVoiceId);

        // Next turn
        if (!sessionEnded && !isPaused) {
          generateTurn(speaker === "HOST" ? "GUEST" : "HOST");
        }
      } catch (err) {
        console.error("Turn generation error:", err);
        // Fallback to simulation
        await simulateTurn(speaker);
      } finally {
        setIsGenerating(false);
      }
    },
    [settings, sessionEnded, isPaused, timeElapsed]
  );

  const simulateTurn = async (speaker: Speaker) => {
    // Demo placeholder for when backend isn't connected
    const demoTexts: Record<Speaker, string[]> = {
      HOST: [
        `Welcome to DuckPod! Today we're diving into "${settings?.topic}". So, what's the most exciting development you've seen recently?`,
        "That's a fascinating perspective. Can you give us a concrete example of how that plays out in practice?",
        "I love that example. Now, let's shift gears a bit — what do you think are the biggest challenges here?",
        "Great point. So, looking ahead, where do you see this heading in the next few years?",
      ],
      GUEST: [
        "Thanks for having me! I think the most exciting thing is how rapidly the landscape is evolving. We're seeing breakthroughs that would have seemed like science fiction just a few years ago.",
        "Absolutely. Take for instance the way teams are now leveraging these tools in their daily workflows. It's not just about the technology — it's about how it fundamentally changes the way we think about problems.",
        "The biggest challenge, honestly, is adoption. The tech is there, but bridging the gap between what's possible and what organizations are ready for — that's where the real work is.",
        "I think we'll see a convergence. The tools will become more intuitive, the barriers will lower, and we'll hit a tipping point where this becomes as natural as using a search engine.",
      ],
    };

    const texts = demoTexts[speaker];
    const turnIndex = Math.min(
      Math.floor((memoryRef.current?.turnCount ?? 0) / 2),
      texts.length - 1
    );
    const text = texts[turnIndex];

    const msg: TurnMessage = { speaker, text, timestamp: timeElapsed };
    setTranscript((prev) => [...prev, msg]);

    if (memoryRef.current) {
      memoryRef.current.turnCount++;
    }

    // Simulate speaking with amplitude animation
    setIsSpeaking(true);
    const duration = 3000 + Math.random() * 4000;
    const startTime = Date.now();

    await new Promise<void>((resolve) => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= duration || isPaused) {
          setAmplitude(0);
          setIsSpeaking(false);
          resolve();
          return;
        }
        setAmplitude(0.3 + Math.random() * 0.7);
        requestAnimationFrame(animate);
      };
      animate();
    });

    // Pause between turns
    await new Promise((r) => setTimeout(r, 800));

    // Next turn
    if (!sessionEnded && !isPaused) {
      generateTurn(speaker === "HOST" ? "GUEST" : "HOST");
    }
  };

  const playTTS = async (text: string, voiceId: string) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      if (!supabaseUrl || !supabaseKey) return;

      const response = await fetch(`${supabaseUrl}/functions/v1/tts-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({ text, voiceId }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Amplitude tracking
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audio);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      setIsSpeaking(true);

      const trackAmplitude = () => {
        if (audio.paused || audio.ended) {
          setAmplitude(0);
          setIsSpeaking(false);
          return;
        }
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length / 255;
        setAmplitude(avg);
        requestAnimationFrame(trackAmplitude);
      };

      audio.onplay = trackAmplitude;
      await audio.play();
      await new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          audioContext.close();
          resolve();
        };
      });
    } catch (err) {
      console.error("TTS playback error:", err);
    }
  };

  const handleEndSession = () => {
    setSessionEnded(true);
    setIsSpeaking(false);
    clearInterval(timerRef.current);
    navigate("/session-end", {
      state: {
        settings,
        transcript,
        duration: timeElapsed,
      },
    });
  };

  if (!settings) return null;

  const bgPreset = BACKGROUND_PRESETS.find((b) => b.id === settings.background);
  const bgStyle = bgPreset ? bgPreset.gradient : settings.background;

  return (
    <div className="flex h-screen flex-col" style={{ background: bgStyle }}>
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border/30 bg-background/60 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground">{settings.topic}</h2>
          {isGenerating && (
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary animate-pulse">
              Generating…
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-lg font-bold text-foreground">
            {getDurationDisplay()}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEndSession}
            className="gap-1.5"
          >
            <Square className="h-3 w-3" />
            End Session
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Stage */}
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
              onNextQuestion={() => {
                steerRef.current = "Move to next question immediately";
                // Will be picked up on next turn
              }}
              onInterrupt={() => {
                steerRef.current = "Host interrupts with a follow-up question";
              }}
              onSteer={(directive) => {
                steerRef.current = directive;
              }}
              onProducerNote={(note) => {
                producerNoteRef.current = note;
              }}
            />
          </div>

          {/* Disclaimer */}
          <div className="flex items-center justify-center gap-1.5 pb-3">
            <AlertTriangle className="h-3 w-3 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">
              AI-generated conversation for entertainment/education. Guest persona is fictional.
            </p>
          </div>
        </div>

        {/* Transcript panel */}
        <div className="w-80 border-l border-border/30 bg-background/60 backdrop-blur-md">
          <TranscriptPanel messages={transcript} className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default LiveRoom;
