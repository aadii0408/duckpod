import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, Library, Headphones, Radio, MessageSquare, Sparkles, Share2, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import WaveformAnimation from "@/components/WaveformAnimation";
import AvatarSVG from "@/components/AvatarSVG";
import { RAJ_HOST, AVATARS } from "@/lib/constants";

const MOCK_CONVERSATION = [
  { speaker: "HOST", text: "So what excites you most about autonomous AI agents?" },
  { speaker: "GUEST", text: "The composability. When agents can call other agents, you get emergent behavior that nobody explicitly programmed." },
  { speaker: "HOST", text: "That's fascinating — but doesn't that scare you a little?" },
];

const STEPS = [
  { icon: Sparkles, title: "Pick a topic", desc: "Enter any subject — AI picks the rest" },
  { icon: MessageSquare, title: "Watch the conversation", desc: "Raj hosts a live AI debate with real voices" },
  { icon: Share2, title: "Save & share", desc: "Get show notes, transcript, and a shareable card" },
];

const FEATURES = [
  { icon: Mic, title: "Live AI Voices", desc: "ElevenLabs-powered streaming TTS" },
  { icon: Headphones, title: "Real-time Transcript", desc: "Follow along as the conversation unfolds" },
  { icon: Zap, title: "Producer Controls", desc: "Steer, interrupt, and direct the show" },
  { icon: Library, title: "Episode Library", desc: "All your podcasts saved & searchable" },
];

const guestAvatar = AVATARS[7];

const Landing = () => {
  return (
    <div className="relative flex flex-col items-center overflow-hidden">
      {/* BG effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[140px]" />
        <div className="absolute -right-40 top-[40%] h-[500px] w-[500px] rounded-full bg-accent/[0.04] blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[120px]" />
      </div>

      {/* Hero */}
      <motion.section
        className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 section-padding pb-0 pt-16 text-center sm:pt-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Badge */}
        <motion.div
          className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">AI-Powered Podcast Studio</span>
        </motion.div>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Create live podcasts on{" "}
          <span className="gradient-text">any topic</span>{" "}
          in seconds
        </h1>

        <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
          AI-generated conversations hosted by{" "}
          <span className="font-semibold text-foreground">Raj</span>, with AI guests debating in real time.
          You control the direction.
        </p>

        <WaveformAnimation barCount={9} className="h-6" />

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="gap-2 rounded-xl px-8 text-base font-semibold">
            <Link to="/setup">
              <Radio className="h-4 w-4" />
              Start Live Podcast
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 rounded-xl px-8 text-base">
            <Link to="/episodes">
              <Library className="h-4 w-4" />
              Browse Episodes
            </Link>
          </Button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { icon: Mic, text: "Live streaming voices" },
            { icon: Headphones, text: "Real-time transcript" },
            { icon: Library, text: "Episode library" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/20 px-3 py-1.5 text-xs text-secondary-foreground sm:text-sm"
            >
              <Icon className="h-3 w-3 text-primary" />
              {text}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Host card */}
      <motion.section
        className="relative z-10 mt-16 section-padding w-full max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mx-auto flex max-w-md items-center gap-5 rounded-2xl glass p-5">
          <AvatarSVG variant={RAJ_HOST.avatarVariant} size={72} colors={RAJ_HOST.colors} isSpeaking={false} mouthScale={0} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Your Host</p>
            <p className="text-base font-semibold text-foreground">{RAJ_HOST.name}</p>
            <p className="text-sm text-muted-foreground">{RAJ_HOST.tagline}</p>
          </div>
        </div>
      </motion.section>

      {/* Features grid */}
      <motion.section
        className="relative z-10 mt-20 w-full max-w-5xl section-padding"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Everything you need
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group rounded-xl border border-border/50 bg-card/30 p-5 transition-all hover:border-primary/30 hover:bg-card/50">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section
        className="relative z-10 mt-20 w-full max-w-5xl section-padding"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          How it works
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/30 p-6 text-center">
              <div className="absolute -top-3 left-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Conversation preview */}
      <motion.section
        className="relative z-10 mt-20 w-full max-w-3xl section-padding pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Preview a conversation
        </h2>
        <div className="rounded-xl glass p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <AvatarSVG variant={RAJ_HOST.avatarVariant} size={48} colors={RAJ_HOST.colors} />
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">{RAJ_HOST.name}</span>
            </div>
            <div className="text-xs text-muted-foreground/30">vs</div>
            <div className="flex flex-col items-center gap-1">
              <AvatarSVG variant={1} size={48} colors={guestAvatar.colors} />
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">Guest</span>
            </div>
          </div>
          <div className="space-y-3">
            {MOCK_CONVERSATION.map((msg, i) => (
              <motion.div
                key={i}
                className={`flex gap-3 ${msg.speaker === "GUEST" ? "flex-row-reverse text-right" : ""}`}
                initial={{ opacity: 0, x: msg.speaker === "HOST" ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.3 }}
              >
                <div
                  className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.speaker === "HOST"
                      ? "bg-primary/10 text-foreground"
                      : "bg-accent/10 text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Landing;
