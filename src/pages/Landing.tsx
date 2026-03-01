import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, Library, Headphones, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import WaveformAnimation from "@/components/WaveformAnimation";

const Landing = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 flex max-w-2xl flex-col items-center gap-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 glow-primary">
            <Radio className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Duck<span className="gradient-text">Pod</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="max-w-md text-lg text-muted-foreground">
          AI-generated live podcasts on any topic. Two AI speakers, one studio, infinite conversations.
        </p>

        {/* Waveform animation */}
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
    </div>
  );
};

export default Landing;
