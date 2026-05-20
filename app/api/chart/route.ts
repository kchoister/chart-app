import { NextRequest, NextResponse } from 'next/server';
import { Sandbox } from '@vercel/sandbox';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const openai = createOpenAI({
    baseURL: 'https://ai-gateway.vercel.sh/v1',
    apiKey: process.env.AI_GATEWAY_TOKEN,
  });

  const { text: code } = await generateText({
    model: openai('gpt-4o-mini'),
    system: 'Return ONLY executable Python code using standard library. Print a text chart. No markdown, no backticks, just raw Python.',
    prompt,
  });

  const sandbox = await Sandbox.create({ runtime: 'python3.13' });
  const writeResult = await sandbox.runCommand('bash', ['-c', `cat > /tmp/chart.py << 'EOF'\n${code}\nEOF`]);
  const result = await sandbox.runCommand('python3', ['/tmp/chart.py']);
  const output = await result.stdout();
  await sandbox.stop();

  return NextResponse.json({ output, code });
}
