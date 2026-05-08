import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config/env.js";

if (!OPENAI_API_KEY) {
  console.warn(
    "OPENAI_API_KEY is not set in .env — AI classification will fall back to keyword rules."
  );
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

export default openai;
