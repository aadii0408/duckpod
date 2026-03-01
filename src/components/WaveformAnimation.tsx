import { motion } from "framer-motion";

interface WaveformAnimationProps {
  isPlaying?: boolean;
  barCount?: number;
  className?: string;
}

const WaveformAnimation = ({ isPlaying = true, barCount = 5, className = "" }: WaveformAnimationProps) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-primary"
          animate={
            isPlaying
              ? {
                  height: [4, 12 + Math.random() * 16, 4],
                }
              : { height: 4 }
          }
          transition={{
            duration: 0.6 + Math.random() * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
          style={{ minHeight: 4 }}
        />
      ))}
    </div>
  );
};

export default WaveformAnimation;
