import { NextRequest, NextResponse } from 'next/server';
import { start } from 'workflow/api';
import { sandboxStep } from '../../../workflows/chart';
import { Sandbox } from '@vercel/sandbox';

export const maxDuration = 60;

const CHART_CODE = `
import math
width = 70
height = 20
scale = height / 2
for y in range(height):
    line = ""
    for x in range(width):
        sine_value = math.sin(2 * math.pi * x / width)
        plot_y = scale - int(sine_value * scale)
        line += '*' if plot_y == y else ' '
    print(line)
`;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  start(sandboxStep, [CHART_CODE]);

  const sandbox = await Sandbox.create({ runtime: 'python3.13' });
  await sandbox.runCommand('bash', ['-c', `cat > /tmp/chart.py << 'EOF'\n${CHART_CODE}\nEOF`]);
  const result = await sandbox.runCommand('python3', ['/tmp/chart.py']);
  const output = await result.stdout();
  await sandbox.stop();

  return NextResponse.json({ output, code: CHART_CODE });
}
