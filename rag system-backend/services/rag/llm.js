import config from "../../config/index.js";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

function buildPrompt(context, question) {
  return {
    system: `You are a helpful assistant. Answer the user's question using ONLY the context provided below.
If the context does not contain enough information to answer confidently, say so honestly.
Do not make up facts.

Context:
${context}`,
    user: question,
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askOpenAI(context, question) {
  const { system, user } = buildPrompt(context, question);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.2,
    max_tokens: 800,
  });

  return response.choices[0].message.content.trim();
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function askAnthropic(context, question) {
  const { system, user } = buildPrompt(context, question);

  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 800,
    system,
    messages: [{ role: "user", content: user }],
  });

  return response.content[0].text.trim();
}

async function askMock(context, question) {
  const words = question.toLowerCase().split(/\s+/);
  const contextSnippet = context.slice(0, 200).replace(/\n/g, " ");

  return `[MOCK LLM RESPONSE]

Question: "${question}"

Based on the retrieved context, here is a simulated answer:

The context mentions: "${contextSnippet}..."

Key terms from your question (${words.slice(0, 5).join(", ")}) appear to be addressed in the retrieved chunks above.

Note: This is a mock response. Set LLM_PROVIDER=openai or LLM_PROVIDER=anthropic in .env and provide a real API key to get actual AI-generated answers.`;
}

async function askLLM(context, question) {
  const provider = config.llmProvider;
  console.log(`[LLM] Provider: ${provider}`);

  switch (provider) {
    case "openai":
      return askOpenAI(context, question);
    case "anthropic":
      return askAnthropic(context, question);
    case "mock":
    default:
      return askMock(context, question);
  }
}

export { askLLM };
