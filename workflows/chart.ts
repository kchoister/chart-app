import { Sandbox } from '@vercel/sandbox';

export async function sandboxStep(code: string) {
  'use workflow';

  const sandbox = await Sandbox.create({ runtime: 'python3.13' });
  await sandbox.runCommand('bash', ['-c', `cat > /tmp/chart.py << 'EOF'\n${code}\nEOF`]);
  const result = await sandbox.runCommand('python3', ['/tmp/chart.py']);
  const output = await result.stdout();
  await sandbox.stop();

  return output;
}
