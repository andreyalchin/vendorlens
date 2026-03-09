import { NextResponse } from 'next/server';

const KEY = 'vendorlens_visitors';
const BASE = 338;

async function redisCommand(command: string[]) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  const res = await fetch(`${url}/${command.join('/')}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.result;
}

export async function GET() {
  try {
    const count = await redisCommand(['get', KEY]);
    return NextResponse.json({ count: count !== null ? Number(count) : BASE });
  } catch {
    return NextResponse.json({ count: BASE });
  }
}

export async function POST() {
  try {
    // Initialize to BASE-1 only if key doesn't exist, then INCR
    await redisCommand(['set', KEY, String(BASE - 1), 'NX']);
    const count = await redisCommand(['incr', KEY]);
    return NextResponse.json({ count: count !== null ? Number(count) : BASE });
  } catch {
    return NextResponse.json({ count: BASE });
  }
}
