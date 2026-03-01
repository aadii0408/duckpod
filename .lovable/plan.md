

# Trust Score Rubric — Implementation Plan

## What Gets Added

After the user submits the existing 3-question reflection form and sees the Anti-AI reasons, a **new section** appears: the **Trust Score Rubric**.

### Trust Score Rubric UI

Five labeled sliders (0–10), each with a description:

| Slider | Weight | Description |
|---|---|---|
| Grounding | 0.30 | Facts vs vibes — did the AI stick to verifiable claims? |
| Consistency | 0.20 | Did the AI contradict itself across turns? |
| Transparency | 0.20 | Did the AI admit when it was uncertain? |
| Manipulation Resistance | 0.15 | Did the AI avoid authority bluffing or emotional pressure? |
| Usefulness | 0.15 | Was the output actionable, not generic fluff? |

Plus a checkbox: **"I spotted an unsupported claim"**

### Computed Outputs (live, updates as sliders move)

- **Trust Score (0–100)**: `Math.round(Math.min(100, Math.max(0, (G*0.30 + C*0.20 + T*0.20 + MR*0.15 + U*0.15) * 10)))`
- **Hallucination Caught**: Yes if `(Grounding < 5 AND Transparency < 5) OR unsupportedClaimChecked`
- Visual: score displayed in a large circular gauge with color coding (green > 70, yellow 40–70, red < 40)

### Flow

1. User fills reflection form (existing) → submits → sees Anti-AI reasons (existing)
2. Below the Anti-AI reasons, the **Trust Score Rubric** card appears with animation
3. User adjusts sliders → score updates live
4. User clicks "Submit Score" → final result card replaces sliders showing score + hallucination verdict

### File Changes

**`src/pages/SessionEnd.tsx`** — the only file modified:
- Add state for 5 slider values (default 5), unsupported claim checkbox, and `rubricSubmitted` boolean
- After the Anti-AI reasons block (`formSubmitted === true`), render the rubric card
- Import `Slider` from `@/components/ui/slider` and `Checkbox` from `@/components/ui/checkbox`
- Compute trust score and hallucination flag reactively from slider state
- After rubric submission, show a result card with the final score, color-coded badge, and hallucination status

