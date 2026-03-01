

# DuckPod — AI-Powered Live Podcast Agent

## Overview
A live podcast studio where an AI Host and Guest have a real-time, turn-based conversation on any topic. Users configure the session, then watch and listen as two avatars converse with streaming ElevenLabs voices, live transcript, and interactive controls.

**Tech:** React + Vite + Tailwind (frontend), Supabase Edge Functions (backend), Supabase Postgres + Storage (data).

---

## Page 1: Landing Page
- DuckPod branding with a podcast-themed hero section
- Brief explanation: "AI-generated live podcasts on any topic"
- Two CTA buttons: **"Start Live Podcast"** → Setup page, **"Browse Episodes"** → Library
- Subtle animated waveform or microphone illustration

## Page 2: Session Setup
A clean form page with all configuration options:

- **Topic** (text input, required)
- **Duration**: 3 min / 5 min / 10 min / "Until I stop"
- **Energy slider**: Calm ↔ Hype
- **Audience level**: Beginner / Intermediate / Expert (radio group)
- **Host personality**: Dropdown with 4 presets (Mistral Crisp, Professor, Founder Mode, Late-night Chill)
- **Guest persona**: Dropdown with 4 fictional styles (Tech Founder vibe, Big Tech leader vibe, AI Researcher vibe, Investor/Journalist vibe)
- **Gender selection**: Male/Female for Host and Guest separately
- **Voice selection**: Curated ElevenLabs voice dropdowns filtered by selected gender
- **Avatar selection**: 3 styles (Realistic/3D/Minimal) × 6 illustrated character presets each, for Host and Guest
- **Background**: 4 presets (Studio/Cozy/Futuristic/Outdoor) + image upload option
- **"Enter Live Room"** button

## Page 3: Live Podcast Room (Core Experience)

### Layout
- **Top bar**: Topic title, countdown timer, "End Session" button
- **Main stage**: Two avatar cards side-by-side (Host left, Guest right) over the selected background
  - Name labels ("HOST" / "GUEST")
  - Glowing border on the active speaker
  - Pulsing/scaling mouth shape animation synced to audio amplitude
- **Transcript panel** (bottom or side): Real-time scrolling transcript with speaker tags
- **Controls bar**:
  - Pause / Resume
  - "Next Question" — force host to move on
  - "Interrupt" — host cuts in with a follow-up
  - Quick steer chips: "More technical", "Simplify", "Add examples", "Debate harder", "Wrap up in 30s"
  - "Producer Note" text input — guidance injected into next Host turn
- **Disclaimer**: "AI-generated conversation. Guest persona is fictional."

### Conversation Engine
- Turn-based: Host → Guest → Host → ...
- Host turns: 1–3 sentences + question (8–15 sec)
- Guest turns: 2–6 sentences with examples (12–25 sec)
- Every ~60s the host summarizes and transitions
- Session memory object tracks: topic, covered points, current angle, open questions, time remaining
- Conversational filler words added naturally

### Audio Streaming
- Each turn's text is split by sentence and sent to ElevenLabs streaming TTS
- Audio chunks play immediately as they arrive (low latency)
- Audio amplitude is analyzed in real-time to drive the mouth animation
- Retry once on TTS failure; show error UI if still failing

## Page 4: Episodes Library
- List of past episodes: title, date, duration
- Click to open episode detail:
  - Audio player with playback controls
  - Full transcript with speaker tags
  - Show notes: title, summary, key takeaways, hashtags
  - Download buttons (MP3, transcript)

## Page 5: End-of-Session / Export
- When session ends (timer or manual):
  - Generate show notes via LLM (title, summary, 3–5 takeaways, 5–10 hashtags)
  - Save merged audio to Supabase Storage
  - Save transcript and show notes to Supabase Postgres
  - Show summary screen with playback, transcript, and download options

---

## Backend (Supabase Edge Functions)

1. **`generate-turn`** — Calls Mistral API to generate the next Host or Guest turn as JSON `{speaker, text}`. Accepts session memory, settings, producer note. Optional OpenAI "polish" pass or Gemini "creative variant" mode.
2. **`tts-stream`** — Takes text + voice ID, calls ElevenLabs streaming TTS, returns chunked audio stream to client.
3. **`generate-show-notes`** — Takes full transcript, generates title/summary/takeaways/hashtags via Mistral.
4. **`upload-episode`** — Saves audio file to Supabase Storage, episode metadata + transcript to Postgres.

## Database (Supabase Postgres)
- **episodes** table: id, topic, duration, created_at, audio_url, transcript (JSON), show_notes (JSON), settings (JSON)
- **Storage bucket**: `episodes` for MP3 files, `backgrounds` for custom uploaded backgrounds

## API Keys (Supabase Secrets)
- `ELEVENLABS_API_KEY`
- `MISTRAL_API_KEY`
- `OPENAI_API_KEY` (optional polish pass)
- `GEMINI_API_KEY` (optional creative variant)

## Design
- Dark theme with accent colors (podcast studio aesthetic)
- Smooth transitions between pages
- Responsive layout, optimized for desktop, usable on mobile
- Subtle animations: waveforms, speaker glow, mouth pulsing

