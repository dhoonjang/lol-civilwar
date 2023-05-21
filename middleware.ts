import { verifyKey } from 'discord-interactions';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function buffer(readable: ReadableStream<Uint8Array> | null) {
  if (!readable) return '';
  const result = await readable.getReader().read();
  return result.value || '';
}

export default async function middleware(request: NextRequest) {
  const signature = request.headers.get('X-Signature-Ed25519') || '';
  const timestamp = request.headers.get('X-Signature-Timestamp') || '';

  const isValidRequest = verifyKey(
    await buffer(request.body),
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY || ''
  );

  if (!isValidRequest) {
    return NextResponse.json('Invalid Signature', { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/interactions',
};
