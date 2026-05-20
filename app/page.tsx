'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setOutput('');
    const res = await fetch('/api/chart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setOutput(data.output || data.code || 'Done!');
    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Make Me a Chart</h1>
      <textarea
        rows={3}
        style={{ width: '100%', fontSize: '1rem', padding: '0.5rem' }}
        placeholder='Describe a chart, e.g. "plot a sine wave"'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <br />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', fontSize: '1rem' }}
      >
        {loading ? 'Generating...' : 'Generate Chart'}
      </button>
      {output && (
        <pre style={{ marginTop: '2rem', background: '#f4f4f4', padding: '1rem' }}>
          {output}
        </pre>
      )}
    </main>
  );
}