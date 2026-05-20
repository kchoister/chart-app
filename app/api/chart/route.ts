import { NextRequest, NextResponse } from 'next/server';
import { Sandbox } from '@vercel/sandbox';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const gatewayRes = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AI_GATEWAY_TOKEN}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Return ONLY executable Python code using standard library. Print a text chart.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  const gatewayData = await gatewayRes.json();
  const code = gatewayData.choices[0].message.content;

  const sandbox = await Sandbox.create({ runtime: 'python3.13' });
  const writeResult = await sandbox.runCommand('bash', ['-c', `cat > /tmp/chart.py << 'EOF'\n${code}\nEOF`]);
  const result = await sandbox.runCommand('python3', ['/tmp/chart.py']);
  const output = await result.stdout();
  await sandbox.stop();

  return NextResponse.json({ output, code });
}
