import { motion } from "framer-motion";

interface AvatarSVGProps {
  variant: number; // 0-5
  mouthScale?: number; // 0-1
  isSpeaking?: boolean;
  size?: number;
  colors: { bg: string; skin: string; accent: string };
}

// 6 distinct character designs with different hairstyles, accessories, head shapes
const characters = [
  // 0: Alex — round face, short spiky hair, headphones
  {
    headShape: (skin: string) => (
      <ellipse cx="60" cy="52" rx="22" ry="24" fill={skin} />
    ),
    hair: (accent: string) => (
      <>
        <path d="M38 42 C38 25, 82 25, 82 42 L80 35 C80 22, 40 22, 40 35Z" fill={accent} />
        {/* spikes */}
        <path d="M42 30 L45 18 L50 28Z" fill={accent} />
        <path d="M55 26 L58 14 L62 24Z" fill={accent} />
        <path d="M68 28 L72 16 L75 30Z" fill={accent} />
      </>
    ),
    eyes: () => (
      <>
        <ellipse cx="50" cy="50" rx="3" ry="3.5" fill="hsl(225, 25%, 6%)" />
        <ellipse cx="70" cy="50" rx="3" ry="3.5" fill="hsl(225, 25%, 6%)" />
        <circle cx="51.5" cy="49" r="1" fill="hsl(210, 20%, 92%)" />
        <circle cx="71.5" cy="49" r="1" fill="hsl(210, 20%, 92%)" />
      </>
    ),
    accessory: (accent: string) => (
      <>
        {/* headphones band */}
        <path d="M34 48 C34 30, 86 30, 86 48" stroke={accent} strokeWidth="3" fill="none" />
        <rect x="30" y="44" width="8" height="12" rx="3" fill={accent} />
        <rect x="82" y="44" width="8" height="12" rx="3" fill={accent} />
      </>
    ),
  },
  // 1: Jordan — square jaw, neat side-part hair, glasses
  {
    headShape: (skin: string) => (
      <path d={`M38 55 C38 30, 82 30, 82 55 L80 72 C80 78, 40 78, 40 72Z`} fill={skin} />
    ),
    hair: (accent: string) => (
      <path d="M36 42 C36 24, 84 24, 84 42 L84 35 C70 28, 50 32, 36 35Z" fill={accent} />
    ),
    eyes: () => (
      <>
        <ellipse cx="49" cy="52" rx="2.5" ry="3" fill="hsl(225, 25%, 6%)" />
        <ellipse cx="71" cy="52" rx="2.5" ry="3" fill="hsl(225, 25%, 6%)" />
        <circle cx="50" cy="51" r="0.8" fill="hsl(210, 20%, 92%)" />
        <circle cx="72" cy="51" r="0.8" fill="hsl(210, 20%, 92%)" />
      </>
    ),
    accessory: (_accent: string) => (
      <>
        {/* glasses */}
        <rect x="42" y="46" width="16" height="12" rx="3" stroke="hsl(225, 15%, 30%)" strokeWidth="1.5" fill="none" />
        <rect x="62" y="46" width="16" height="12" rx="3" stroke="hsl(225, 15%, 30%)" strokeWidth="1.5" fill="none" />
        <line x1="58" y1="52" x2="62" y2="52" stroke="hsl(225, 15%, 30%)" strokeWidth="1.5" />
      </>
    ),
  },
  // 2: Morgan — oval face, curly/afro hair, earring
  {
    headShape: (skin: string) => (
      <ellipse cx="60" cy="55" rx="20" ry="23" fill={skin} />
    ),
    hair: (accent: string) => (
      <circle cx="60" cy="40" r="26" fill={accent} />
    ),
    eyes: () => (
      <>
        <ellipse cx="51" cy="54" rx="2.5" ry="2" fill="hsl(225, 25%, 6%)" />
        <ellipse cx="69" cy="54" rx="2.5" ry="2" fill="hsl(225, 25%, 6%)" />
        {/* lashes */}
        <line x1="48" y1="51" x2="46" y2="49" stroke="hsl(225, 25%, 6%)" strokeWidth="1" />
        <line x1="72" y1="51" x2="74" y2="49" stroke="hsl(225, 25%, 6%)" strokeWidth="1" />
      </>
    ),
    accessory: (accent: string) => (
      <circle cx="82" cy="62" r="3" fill={accent} stroke="hsl(210, 20%, 92%)" strokeWidth="0.5" />
    ),
  },
  // 3: Casey — triangular face, long straight hair, beanie
  {
    headShape: (skin: string) => (
      <path d={`M40 48 C40 30, 80 30, 80 48 L74 74 C74 78, 46 78, 46 74Z`} fill={skin} />
    ),
    hair: (accent: string) => (
      <>
        <path d="M36 44 L36 72 C36 72, 38 50, 40 48" fill={accent} />
        <path d="M84 44 L84 72 C84 72, 82 50, 80 48" fill={accent} />
      </>
    ),
    eyes: () => (
      <>
        <ellipse cx="50" cy="52" rx="2" ry="2.5" fill="hsl(225, 25%, 6%)" />
        <ellipse cx="70" cy="52" rx="2" ry="2.5" fill="hsl(225, 25%, 6%)" />
      </>
    ),
    accessory: (accent: string) => (
      <>
        {/* beanie */}
        <path d="M36 40 C36 22, 84 22, 84 40 L82 44 C82 34, 38 34, 38 44Z" fill={accent} />
        <rect x="36" y="38" width="48" height="6" rx="2" fill={accent} opacity="0.8" />
        <circle cx="60" cy="20" r="3" fill={accent} />
      </>
    ),
  },
  // 4: Quinn — round face, bob cut, mic pin
  {
    headShape: (skin: string) => (
      <ellipse cx="60" cy="54" rx="21" ry="22" fill={skin} />
    ),
    hair: (accent: string) => (
      <>
        <path d="M36 48 C36 26, 84 26, 84 48 L84 62 C84 62, 78 40, 60 40 C42 40, 36 62, 36 62Z" fill={accent} />
        <ellipse cx="36" cy="56" rx="4" ry="8" fill={accent} />
        <ellipse cx="84" cy="56" rx="4" ry="8" fill={accent} />
      </>
    ),
    eyes: () => (
      <>
        <ellipse cx="50" cy="52" rx="3" ry="3" fill="hsl(225, 25%, 6%)" />
        <ellipse cx="70" cy="52" rx="3" ry="3" fill="hsl(225, 25%, 6%)" />
        <circle cx="51" cy="51" r="1.2" fill="hsl(210, 20%, 92%)" />
        <circle cx="71" cy="51" r="1.2" fill="hsl(210, 20%, 92%)" />
      </>
    ),
    accessory: (_accent: string) => (
      <>
        {/* mic pin on collar area */}
        <circle cx="50" cy="76" r="2.5" fill="hsl(225, 15%, 30%)" />
        <rect x="49.5" y="76" width="1" height="4" fill="hsl(225, 15%, 30%)" />
      </>
    ),
  },
  // 5: Riley — diamond face, mohawk, nose ring
  {
    headShape: (skin: string) => (
      <path d={`M42 52 C42 32, 78 32, 78 52 L72 74 C72 78, 48 78, 48 74Z`} fill={skin} />
    ),
    hair: (accent: string) => (
      <>
        {/* mohawk */}
        <path d="M52 32 C52 10, 68 10, 68 32" fill={accent} />
        <path d="M54 30 C54 16, 66 16, 66 30" fill={accent} opacity="0.8" />
      </>
    ),
    eyes: () => (
      <>
        <ellipse cx="51" cy="52" rx="2.5" ry="2" fill="hsl(225, 25%, 6%)" />
        <ellipse cx="69" cy="52" rx="2.5" ry="2" fill="hsl(225, 25%, 6%)" />
      </>
    ),
    accessory: (_accent: string) => (
      <circle cx="60" cy="62" r="1.5" fill="none" stroke="hsl(210, 20%, 80%)" strokeWidth="1" />
    ),
  },
];

const AvatarSVG = ({ variant, mouthScale = 0, isSpeaking = false, size = 120, colors }: AvatarSVGProps) => {
  const char = characters[variant % 6];
  const mouthRy = 1.5 + mouthScale * 6;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 100"
      xmlns="http://www.w3.org/2000/svg"
      animate={isSpeaking ? {} : { y: [0, -2, 0] }}
      transition={isSpeaking ? {} : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Background circle */}
      <circle cx="60" cy="50" r="48" fill={colors.bg} opacity="0.2" />

      {/* Hair behind head */}
      {char.hair(colors.accent)}

      {/* Head */}
      {char.headShape(colors.skin)}

      {/* Eyes */}
      {char.eyes()}

      {/* Animated mouth */}
      <motion.ellipse
        cx="60"
        cy="64"
        rx={mouthScale > 0.3 ? 5 : 3.5}
        fill="hsl(225, 25%, 12%)"
        animate={{ ry: mouthRy }}
        transition={{ duration: 0.05 }}
      />

      {/* Accessory */}
      {char.accessory(colors.accent)}
    </motion.svg>
  );
};

export default AvatarSVG;
