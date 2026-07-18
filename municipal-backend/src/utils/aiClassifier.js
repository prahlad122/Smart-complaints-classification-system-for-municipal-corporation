import openai from "../services/aiClient.js";
import { OPENAI_MODEL } from "../config/env.js";

const VALID_CATEGORIES = [
  "Sanitation",
  "Road Maintenance",
  "Electricity",
  "Water Supply",
  "Parks & Recreation",
  "Other",
];

const VALID_PRIORITIES = ["Low", "Medium", "High", "Critical"];

/**
 * Classify a complaint using OpenAI.
 * Returns { category, priority, confidence, summary } or null on failure.
 */
export const classifyWithAI = async (title, description) => {
  if (!openai) return null;

  try {
    const systemPrompt = `You are a municipal complaint classifier. You MUST respond with ONLY valid JSON — no markdown fences, no explanation, no extra text.

Return exactly this JSON schema:
{"category": "", "priority": "", "confidence": 0.0, "summary": ""}

Valid categories: ${VALID_CATEGORIES.join(", ")}
Valid priorities: ${VALID_PRIORITIES.join(", ")}

Rules:
- confidence is a number between 0 and 1 indicating how certain you are
- summary is a single sentence describing the core issue
- Choose the most specific category that applies
- Assign "Critical" priority only for emergencies: floods, collapses, gas leaks, explosions, electrocution, fires
- Assign "High" for dangerous situations, "Medium" for service disruptions, "Low" for minor inconveniences`;

    const userPrompt = `Classify this municipal complaint:

Title: ${title}
Description: ${description}`;
 

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0,
    });

    let result = response.choices[0].message.content;

    

    // Strip markdown fences if present
    result = result.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      console.error(" AI JSON parse failed");
      return null;
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(parsed.category)) {
      console.error(" AI returned invalid category:", parsed.category);
      return null;
    }

    // Validate priority
    if (!VALID_PRIORITIES.includes(parsed.priority)) {
      console.error(" AI returned invalid priority:", parsed.priority);
      return null;
    }

    // Normalize confidence
    const confidence = typeof parsed.confidence === "number"
      ? Math.min(1, Math.max(0, parsed.confidence))
      : 0.8;

    const summary = typeof parsed.summary === "string"
      ? parsed.summary
      : "AI-classified complaint";
 

    return {
      category: parsed.category,
      priority: parsed.priority,
      confidence,
      summary,
    };
  } catch (error) {
    console.error(" AI classification error:", error.message);
    return null;
  }
};