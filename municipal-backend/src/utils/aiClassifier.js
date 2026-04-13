import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const classifyWithAI = async (text) => {
  try {

    const prompt = `
Classify this municipal complaint.

Categories:
Sanitation
Road Maintenance
Electricity
Water Supply
Other

Priority:
Low
Medium
High

Return JSON only:

{
 "category": "",
 "priority": ""
}

Complaint:
${text}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You classify municipal complaints." },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    });

    let result = response.choices[0].message.content;

    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(result);

  } catch (error) {

    console.log("AI unavailable → using fallback classifier");

    return null; // important for fallback

  }
};