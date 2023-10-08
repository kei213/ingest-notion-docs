import { OpenAI } from 'langchain/llms';
import dotenv from 'dotenv';
dotenv.config();
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI Credentials');
}

export const openai = new OpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0.4,
  maxTokens: 500,
});
