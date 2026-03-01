

# DuckPod — UI Polish + Avatar Enhancement Plan

Based on the user's feedback, there are four areas to address. Here's what currently exists and what needs to change.

## Current State

The app has a working 4-page flow: Landing → Setup → Live Room → Session End, plus Episodes/EpisodeDetail. Avatars are colored circles with simple eyes/mouth shapes. The UI is functional but feels like a prototype — minimal storytelling, no visual narrative, avatars are abstract colored dots.

---

## 1. Story-Driven UI Flow

Make each page feel like a step in a product journey, not just a form.

**Landing page**: Add a "How it works" section below the hero with 3 steps (Pick a topic → Watch the conversation → Save & share). Add a mini demo/preview section showing a mock conversation snippet to sell the experience before the user clicks "Start."

**Setup page**: Add a "preview card" at the bottom that shows the selected Host + Guest avatars side-by-side on the chosen background — a live preview of what the studio will look like. This makes the setup feel purposeful.

**Live Room**: Add a brief "Going Live" countdown animation (3...2...1...) before the first turn starts, to build anticipation.

**Session End**: Add a share-ready "Episode Card" — a styled card with the episode title, duration, and a visual that users could screenshot/share.

## 2. Avatar Upgrade — Animated Illustrated Characters

Replace the plain colored circles with proper illustrated SVG avatars rendered inline. Each avatar will have:
- A distinct head shape, hairstyle, and accessory (glasses, headphones, etc.)
- Inline SVG so the mouth element can be animated in real-time
- The mouth element scales based on audio amplitude (already wired)
- A subtle idle animation (gentle breathing/sway) when not speaking

This keeps everything performant (no GIFs/external assets needed) while looking polished. Six distinct character designs per style category (realistic = more detailed SVG, 3D = bold/rounded shapes, minimal = simple geometric).

## 3. Consistent Host Identity

- Make the Host avatar and personality persist across the app — show the Host avatar on the Landing page hero, in the Setup page header, and in the Episodes list.
- Add a small "Your Host" section on the Landing page featuring the default host avatar with a tagline.
- The host avatar selection in Setup becomes "Choose your Host's look" rather than feeling disconnected.

## 4. Backend Already Connected

The backend (database + AI gateway) is already wired. This plan focuses on the frontend improvements only. No backend changes needed.

---

## Technical Approach

### New/Modified Files

| File | Change |
|---|---|
| `src/components/AvatarSVG.tsx` | New component: inline SVG avatar renderer with 6 character designs per style, animatable mouth |
| `src/components/AvatarCard.tsx` | Replace colored circle with `AvatarSVG`, add idle sway animation |
| `src/pages/Landing.tsx` | Add "How it works" steps, host avatar preview, mock conversation snippet |
| `src/pages/Setup.tsx` | Add live studio preview card at bottom showing selected avatars on background |
| `src/pages/LiveRoom.tsx` | Add 3-2-1 countdown before first turn |
| `src/pages/SessionEnd.tsx` | Add shareable episode card component |
| `src/lib/constants.ts` | Update avatar definitions with SVG variant identifiers |

### Avatar SVG Design

Each avatar is a self-contained SVG component that accepts props:
- `variant` (which of the 6 characters)
- `style` (realistic/3d/minimal — affects detail level)
- `mouthScale` (0-1, drives mouth animation)
- `isSpeaking` (toggles glow + breathing animation)

The SVG includes: head, hair, eyes, mouth (the animated element), and optional accessories. Mouth is a `<ellipse>` or `<path>` whose `ry` scales with amplitude.

