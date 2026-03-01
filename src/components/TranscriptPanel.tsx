import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TurnMessage } from "@/lib/types";

interface TranscriptPanelProps {
  messages: TurnMessage[];
  className?: string;
}

const TranscriptPanel = ({ messages, className = "" }: TranscriptPanelProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`flex flex-col gap-3 overflow-y-auto p-4 ${className}`}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Transcript
      </h3>
      <AnimatePresence>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <span
              className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                msg.speaker === "HOST"
                  ? "bg-primary/20 text-primary"
                  : "bg-accent/20 text-accent"
              }`}
            >
              {msg.speaker}
            </span>
            <p className="text-sm leading-relaxed text-foreground/85">{msg.text}</p>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
};

export default TranscriptPanel;
