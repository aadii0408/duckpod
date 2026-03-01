import { motion } from "framer-motion";
import type { AvatarOption, Speaker } from "@/lib/types";
import { AVATARS } from "@/lib/constants";

interface AvatarCardProps {
  speaker: Speaker;
  avatarId: string;
  isSpeaking: boolean;
  amplitude: number; // 0-1
}

const AvatarCard = ({ speaker, avatarId, isSpeaking, amplitude }: AvatarCardProps) => {
  const avatar = AVATARS.find((a) => a.id === avatarId);
  const colors = avatar?.colors ?? { bg: "hsl(168, 80%, 50%)", skin: "hsl(30, 60%, 70%)", accent: "hsl(270, 60%, 60%)" };
  const label = avatar?.label ?? speaker;
  const mouthScale = 0.2 + amplitude * 0.8;

  return (
    <motion.div
      className={`relative flex flex-col items-center gap-3 rounded-2xl p-6 transition-all duration-300 ${
        isSpeaking ? "glow-speaking" : ""
      }`}
      style={{
        background: "hsl(225, 20%, 10% / 0.8)",
        border: isSpeaking
          ? "2px solid hsl(168, 80%, 50% / 0.7)"
          : "2px solid hsl(225, 15%, 18% / 0.5)",
      }}
      animate={isSpeaking ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 1.5, repeat: isSpeaking ? Infinity : 0 }}
    >
      {/* Speaker badge */}
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {speaker}
      </span>

      {/* Avatar circle */}
      <div
        className="relative flex h-28 w-28 items-center justify-center rounded-full"
        style={{ background: colors.bg }}
      >
        {/* Head */}
        <div
          className="absolute h-16 w-14 rounded-full"
          style={{ background: colors.skin, top: "12%" }}
        />
        {/* Eyes */}
        <div className="absolute flex gap-3" style={{ top: "32%" }}>
          <div className="h-2 w-2 rounded-full bg-background" />
          <div className="h-2 w-2 rounded-full bg-background" />
        </div>
        {/* Mouth - amplitude animated */}
        <motion.div
          className="absolute rounded-full"
          style={{
            background: "hsl(0, 0%, 20%)",
            top: "52%",
            width: 12,
          }}
          animate={{ height: 4 + mouthScale * 10, borderRadius: mouthScale > 0.5 ? "50%" : "999px" }}
          transition={{ duration: 0.05 }}
        />
      </div>

      {/* Name */}
      <p className="text-sm font-medium text-foreground">{label}</p>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1 w-1 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AvatarCard;
