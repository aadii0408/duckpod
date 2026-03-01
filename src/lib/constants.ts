import type { VoiceOption, HostPersonality, GuestPersona, AvatarOption, AvatarStyle } from "./types";

export const VOICES: VoiceOption[] = [
  // Male voices
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", gender: "male" },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie", gender: "male" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", gender: "male" },
  { id: "N2lVS1w4EtoT3dr4eOWO", name: "Callum", gender: "male" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", gender: "male" },
  { id: "cjVigY5qzO86Huf0OWal", name: "Eric", gender: "male" },
  { id: "iP95p4xoKVk53GoZ742B", name: "Chris", gender: "male" },
  { id: "nPczCjzI2devNBz1zQrb", name: "Brian", gender: "male" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel", gender: "male" },
  { id: "pqHfZKP75CvOlQylNhV4", name: "Bill", gender: "male" },
  { id: "bIHbv24MWmeRgasZH58o", name: "Will", gender: "male" },
  // Female voices
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", gender: "female" },
  { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura", gender: "female" },
  { id: "SAz9YHcvj6GT2YYXdXww", name: "River", gender: "female" },
  { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice", gender: "female" },
  { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda", gender: "female" },
  { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica", gender: "female" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", gender: "female" },
];

export const HOST_PERSONALITIES: HostPersonality[] = [
  {
    id: "mistral-crisp",
    label: "Mistral Crisp",
    description: "Short, witty, confident",
    systemPromptHint: "You are a sharp, witty podcast host. Keep your sentences short and punchy. Be confident and slightly provocative. Use clever wordplay.",
  },
  {
    id: "professor",
    label: "Professor",
    description: "Structured, calm, examples",
    systemPromptHint: "You are a thoughtful, academic podcast host. Structure your questions clearly. Use analogies and examples. Maintain a calm, measured pace.",
  },
  {
    id: "founder-mode",
    label: "Founder Mode",
    description: "Punchy, product framing",
    systemPromptHint: "You are an energetic startup podcast host. Frame everything through product/business lenses. Be direct, action-oriented, and talk about impact and scale.",
  },
  {
    id: "late-night-chill",
    label: "Late-night Chill",
    description: "Relaxed, soothing",
    systemPromptHint: "You are a late-night podcast host with a relaxed, warm tone. Take your time, use casual language, and create a cozy conversational atmosphere.",
  },
];

export const GUEST_PERSONAS: GuestPersona[] = [
  {
    id: "tech-founder",
    label: "Tech Founder vibe",
    description: "Startup energy, product thinking",
    systemPromptHint: "You are a fictional tech startup founder. Share insights about building products, scaling teams, and navigating the startup world. Be enthusiastic and use real-world analogies.",
  },
  {
    id: "big-tech-leader",
    label: "Big Tech leader vibe",
    description: "Enterprise perspective, systems thinking",
    systemPromptHint: "You are a fictional senior tech leader at a major company. Bring systems thinking, organizational insights, and large-scale engineering perspectives.",
  },
  {
    id: "ai-researcher",
    label: "AI Researcher vibe",
    description: "Deep technical, research focus",
    systemPromptHint: "You are a fictional AI researcher. Explain complex concepts clearly with examples. Be excited about breakthroughs while honest about limitations.",
  },
  {
    id: "investor-journalist",
    label: "Investor/Journalist vibe",
    description: "Market analysis, trend spotting",
    systemPromptHint: "You are a fictional tech investor and journalist. Offer market analysis, spot trends, ask probing questions about business models and competitive landscapes.",
  },
];

const makeAvatars = (style: AvatarStyle): AvatarOption[] => {
  const palettes = [
    { bg: "hsl(168, 80%, 50%)", skin: "hsl(30, 60%, 70%)", accent: "hsl(270, 60%, 60%)" },
    { bg: "hsl(270, 60%, 55%)", skin: "hsl(25, 55%, 65%)", accent: "hsl(168, 80%, 50%)" },
    { bg: "hsl(340, 70%, 55%)", skin: "hsl(35, 50%, 75%)", accent: "hsl(45, 90%, 60%)" },
    { bg: "hsl(210, 70%, 50%)", skin: "hsl(20, 45%, 60%)", accent: "hsl(45, 80%, 55%)" },
    { bg: "hsl(45, 85%, 55%)", skin: "hsl(15, 50%, 68%)", accent: "hsl(340, 65%, 50%)" },
    { bg: "hsl(150, 50%, 45%)", skin: "hsl(28, 48%, 72%)", accent: "hsl(210, 60%, 55%)" },
  ];
  const labels = ["Alex", "Jordan", "Morgan", "Casey", "Quinn", "Riley"];
  return palettes.map((colors, i) => ({
    id: `${style}-${i}`,
    label: labels[i],
    style,
    colors,
  }));
};

export const AVATARS: AvatarOption[] = [
  ...makeAvatars("realistic"),
  ...makeAvatars("3d"),
  ...makeAvatars("minimal"),
];

export const BACKGROUND_PRESETS: { id: string; label: string; gradient: string }[] = [
  { id: "studio", label: "Studio", gradient: "linear-gradient(135deg, hsl(225, 25%, 8%) 0%, hsl(225, 20%, 15%) 50%, hsl(225, 25%, 8%) 100%)" },
  { id: "cozy", label: "Cozy", gradient: "linear-gradient(135deg, hsl(25, 30%, 12%) 0%, hsl(15, 25%, 18%) 50%, hsl(25, 30%, 12%) 100%)" },
  { id: "futuristic", label: "Futuristic", gradient: "linear-gradient(135deg, hsl(260, 40%, 8%) 0%, hsl(200, 60%, 12%) 50%, hsl(260, 40%, 8%) 100%)" },
  { id: "outdoor", label: "Outdoor", gradient: "linear-gradient(135deg, hsl(200, 40%, 15%) 0%, hsl(150, 30%, 20%) 50%, hsl(200, 40%, 15%) 100%)" },
];

export const DURATION_OPTIONS = [
  { value: "3", label: "3 min" },
  { value: "5", label: "5 min" },
  { value: "10", label: "10 min" },
  { value: "unlimited", label: "Until I stop" },
] as const;

export const STEER_CHIPS = [
  "More technical",
  "Simplify",
  "Add examples",
  "Debate harder",
  "Wrap up in 30s",
] as const;
