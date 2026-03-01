export type Gender = "male" | "female";
export type AvatarStyle = "realistic" | "3d" | "minimal";
export type AudienceLevel = "beginner" | "intermediate" | "expert";
export type Duration = "3" | "5" | "10" | "unlimited";
export type BackgroundPreset = "studio" | "cozy" | "futuristic" | "outdoor";
export type Speaker = "HOST" | "GUEST";

export interface VoiceOption {
  id: string;
  name: string;
  gender: Gender;
}

export interface AvatarOption {
  id: string;
  label: string;
  style: AvatarStyle;
  colors: { bg: string; skin: string; accent: string };
}

export interface HostPersonality {
  id: string;
  label: string;
  description: string;
  systemPromptHint: string;
}

export interface GuestPersona {
  id: string;
  label: string;
  description: string;
  systemPromptHint: string;
}

export interface SessionSettings {
  topic: string;
  duration: Duration;
  energy: number; // 0-100
  audienceLevel: AudienceLevel;
  hostPersonality: string;
  guestPersona: string;
  hostGender: Gender;
  guestGender: Gender;
  hostVoiceId: string;
  guestVoiceId: string;
  hostAvatar: string;
  guestAvatar: string;
  background: BackgroundPreset | string;
}

export interface TurnMessage {
  speaker: Speaker;
  text: string;
  timestamp: number;
}

export interface SessionMemory {
  topic: string;
  coveredPoints: string[];
  currentAngle: string;
  openQuestions: string[];
  timeRemainingSeconds: number;
  turnCount: number;
  producerNote?: string;
  steerDirective?: string;
}

export interface Episode {
  id: string;
  topic: string;
  duration: number;
  created_at: string;
  audio_url?: string;
  transcript: TurnMessage[];
  show_notes?: {
    title: string;
    summary: string;
    takeaways: string[];
    hashtags: string[];
  };
  settings: SessionSettings;
}
