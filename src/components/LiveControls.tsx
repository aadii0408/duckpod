import { useState } from "react";
import { Pause, Play, SkipForward, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STEER_CHIPS } from "@/lib/constants";

interface LiveControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onNextQuestion: () => void;
  onInterrupt: () => void;
  onSteer: (directive: string) => void;
  onProducerNote: (note: string) => void;
}

const LiveControls = ({
  isPaused,
  onTogglePause,
  onNextQuestion,
  onInterrupt,
  onSteer,
  onProducerNote,
}: LiveControlsProps) => {
  const [note, setNote] = useState("");

  const handleSendNote = () => {
    if (note.trim()) {
      onProducerNote(note.trim());
      setNote("");
    }
  };

  return (
    <div className="flex flex-col gap-2.5 rounded-xl glass p-3 sm:p-4">
      {/* Main controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={isPaused ? "default" : "secondary"}
          size="sm"
          onClick={onTogglePause}
          className="gap-1.5"
        >
          {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {isPaused ? "Resume" : "Pause"}
        </Button>
        <Button variant="outline" size="sm" onClick={onNextQuestion} className="gap-1.5">
          <SkipForward className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Next Question</span>
          <span className="sm:hidden">Next</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onInterrupt} className="gap-1.5">
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Interrupt</span>
          <span className="sm:hidden">Cut In</span>
        </Button>
      </div>

      {/* Steer chips */}
      <div className="flex flex-wrap gap-1.5">
        {STEER_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => onSteer(chip)}
            className="rounded-full border border-border/50 bg-secondary/30 px-2.5 py-1 text-[11px] text-secondary-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Producer note */}
      <div className="flex gap-2">
        <Input
          placeholder="Producer note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendNote()}
          className="h-8 text-xs"
        />
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleSendNote}>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default LiveControls;
