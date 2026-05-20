import { NextRequest, NextResponse } from 'next/server';
import { chartWorkflow } from '../../../workflows/chart';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const result = await chartWorkflow(prompt);
  return NextResponse.json(result);
}