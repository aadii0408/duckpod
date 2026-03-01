# DuckPod

Human-first AI Podcast Studio.  
AI can speak. Humans decide if it deserves trust.

🔗 Live App: https://duckpod.lovable.app

---

## Overview

DuckPod is an AI-powered podcast studio with a built-in human trust evaluation system.

It generates short AI-hosted podcast episodes and then requires a human audit using a structured rubric to determine reliability, grounding, and hallucination risk.

This is not AI judging itself.  
This is Human-as-Judge.

---

## Core Concept

AI-generated content is fast, fluent, and confident.  
Confidence is not accuracy.

DuckPod enforces:

- Structured evaluation
- Human scoring
- Hallucination detection
- Trust score generation (0–100)

Trust is earned, not assumed.

---

## Features

### AI Podcast Generation
- Topic-based episode creation
- Host + guest conversational format
- Structured transcript rendering
- Multi-turn dialogue flow

### Human Evaluation Layer
After each episode, users score the content across five trust dimensions:

- Grounding (facts vs vibes)
- Consistency
- Transparency (admits uncertainty)
- Manipulation Resistance (no authority bluffing)
- Usefulness (actionable, not fluff)

### Trust Score (0–100)

Weighted formula:

TrustScore =  
(Grounding × 0.30 +  
Consistency × 0.20 +  
Transparency × 0.20 +  
ManipulationResistance × 0.15 +  
Usefulness × 0.15) × 10  

Grounding carries the highest weight to reinforce fact-based reliability.

### Hallucination Detection

Hallucination is flagged when:

- Grounding < 5 AND Transparency < 5  
OR  
- User marks unsupported claims  

Outputs:

- Trust Score: 0–100  
- Hallucination Caught: Yes / No  
- Reliability Verdict  

---

## Product Flow

1. Setup  
   - Enter topic  
   - Configure episode  
   - Generate AI podcast  

2. Studio  
   - View transcript  
   - Observe structured discussion  

3. Reflection  
   - Fill rubric sliders  
   - Submit human evaluation  

4. Trust Report  
   - Trust Score displayed  
   - Hallucination detection result  
   - Reliability classification  

---

## Trust Scale

| Score | Verdict |
|--------|----------|
| 80–100 | Highly Reliable |
| 60–79  | Moderately Reliable |
| 40–59  | Risky – Review Claims |
| 0–39   | Low Trust – Likely Hallucination |

---

## Architecture Overview

Frontend  
- Built with Lovable  
- Multi-page structured flow  
- Deterministic scoring logic  

AI Layer  
- Gemini API for podcast generation  
- Structured claim extraction  
- Optional red-flag verification pass  

Database  
- Supabase for session storage  
- Reflection storage  
- Trust score persistence  

---

## Why DuckPod Exists

AI systems are powerful.  
But they are not inherently trustworthy.

DuckPod keeps humans in control of the narrative and the final verdict.

AI can host the show.  
Humans decide if it tells the truth.

---

## Future Enhancements

- Citation-required mode  
- Adversarial questioning mode  
- Multi-model comparison  
- Confidence gap detection  
- Shareable Trust Cards  

---

## License

MIT License
