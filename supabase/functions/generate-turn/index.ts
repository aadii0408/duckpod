import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { speaker, settings, memory, producerNote, steerDirective } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const hostPersonalityHints: Record<string, string> = {
      "mistral-crisp": "You are a sharp, witty podcast host. Keep sentences short and punchy. Be confident and slightly provocative.",
      professor: "You are a thoughtful, academic podcast host. Structure questions clearly. Use analogies and examples.",
      "founder-mode": "You are an energetic startup podcast host. Frame everything through product/business lenses. Be direct.",
      "late-night-chill": "You are a late-night podcast host with a relaxed, warm tone. Take your time, use casual language.",
    };

    const guestPersonaHints: Record<string, string> = {
      "tech-founder": "You are a fictional tech startup founder. Share insights about building products and scaling teams.",
      "big-tech-leader": "You are a fictional senior tech leader. Bring systems thinking and organizational insights.",
      "ai-researcher": "You are a fictional AI researcher. Explain complex concepts clearly with examples.",
      "investor-journalist": "You are a fictional tech investor/journalist. Offer market analysis and spot trends.",
    };

    const energyDesc =
      settings.energy < 33 ? "calm and measured" : settings.energy < 66 ? "balanced and engaging" : "high-energy and enthusiastic";

    const systemPrompt = `You are generating dialogue for a podcast called DuckPod.
Topic: "${settings.topic}"
Audience level: ${settings.audienceLevel}
Energy: ${energyDesc}
Turn count so far: ${memory?.turnCount ?? 0}
Covered points: ${memory?.coveredPoints?.slice(-5).join("; ") || "none yet"}
Time remaining: ${memory?.timeRemainingSeconds ?? "unlimited"} seconds

${speaker === "HOST" ? hostPersonalityHints[settings.hostPersonality] || "" : guestPersonaHints[settings.guestPersona] || ""}

${speaker === "HOST" ? "As the HOST, ask 1-3 sentences + a question. Keep it conversational with natural filler words like 'so', 'right', 'here\\'s the thing'." : "As the GUEST, respond with 2-6 sentences including at least one concrete example. Be conversational and engaging."}

${memory?.turnCount && memory.turnCount > 0 && memory.turnCount % 6 === 0 ? "This is a good time to briefly summarize what's been discussed and transition to a new angle." : ""}

${producerNote ? `Producer note (incorporate this): ${producerNote}` : ""}
${steerDirective ? `Directive: ${steerDirective}` : ""}

IMPORTANT: Guest persona is entirely fictional. Do NOT impersonate any real person.

You MUST respond with ONLY valid JSON in this exact format:
{"speaker": "${speaker}", "text": "your dialogue here"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate the next ${speaker} turn for this podcast conversation.` },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content ?? "";

    // Parse JSON from response
    let parsed;
    try {
      // Try to extract JSON from the response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch?.[0] ?? rawContent);
    } catch {
      parsed = { speaker, text: rawContent };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-turn error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
