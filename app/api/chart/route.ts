import { NextRequest, NextResponse } from 'next/server';
import { start } from 'workflow/api';
import { sandboxStep } from '../../../workflows/chart';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const openai = createOpenAI({
    baseURL: 'https://ai-gateway.vercel.sh/v1',
    apiKey: process.env.AI_GATEWAY_TOKEN,
  });
  const { text: code } = await generateText({
    model: openai('gpt-4o-mini'),
    system: 'Return ONLY executable Python code using standard library. Print a text chart. No markdown, no backticks.',
    prompt,
  });
  const run = await start(sandboxStep, [code]);
  return NextResponse.json({ output: `Workflow started: ${run.runId}`, code });
}
