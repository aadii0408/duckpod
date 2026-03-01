import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, Library, Headphones, Radio, MessageSquare, Sparkles, Share2 } from "lucide-react";
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

const guestAvatar = AVATARS[7];

const Landing = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden px-4 pb-20">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />
      </div>

      {/* Hero */}
      <motion.div
        className="relative z-10 flex max-w-2xl flex-col items-center gap-8 pt-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 glow-primary">
            <Radio className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Duck<span className="gradient-text">Pod</span>
          </h1>
        </div>

        <p className="max-w-md text-lg text-muted-foreground">
          AI-generated live podcasts on any topic. Hosted by <span className="font-semibold text-foreground">Raj</span>, with AI guests debating in real time.
        </p>

        <WaveformAnimation barCount={9} className="h-8" />

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { icon: Mic, text: "Live streaming voices" },
            { icon: Headphones, text: "Real-time transcript" },
            { icon: Library, text: "Episode library" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-4 py-2 text-sm text-secondary-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {text}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-4">
          <Button asChild size="lg" className="gap-2 rounded-xl px-8 font-semibold">
            <Link to="/setup">
              <Radio className="h-4 w-4" />
              Start Live Podcast
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 rounded-xl px-8">
            <Link to="/episodes">
              <Library className="h-4 w-4" />
              Browse Episodes
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Your Host: Raj */}
      <motion.div
        className="relative z-10 mt-16 flex items-center gap-5 rounded-2xl border border-border bg-card/40 px-6 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <AvatarSVG variant={RAJ_HOST.avatarVariant} size={72} colors={RAJ_HOST.colors} isSpeaking={false} mouthScale={0} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Host</p>
          <p className="text-base font-medium text-foreground">{RAJ_HOST.name}</p>
          <p className="text-sm text-muted-foreground">{RAJ_HOST.tagline}</p>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.section
        className="relative z-10 mt-20 w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          How it works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/30 p-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-bold text-primary">Step {i + 1}</span>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Mock conversation preview */}
      <motion.section
        className="relative z-10 mt-16 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Preview a conversation
        </h2>
        <div className="rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-4 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <AvatarSVG variant={RAJ_HOST.avatarVariant} size={56} colors={RAJ_HOST.colors} />
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">{RAJ_HOST.name}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <AvatarSVG variant={1} size={56} colors={guestAvatar.colors} />
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
                  className={`rounded-xl px-4 py-2.5 text-sm ${
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
