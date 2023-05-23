import { verifyKey } from 'discord-interactions';
import { NextResponse } from 'next/server';
import nextAuthMiddleware, { WithAuthArgs } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

export const config = {
  matcher: ['/api/interactions'],
};

async function getRawbody(readable: ReadableStream<Uint8Array> | null) {
  if (!readable) return '';
  const result = await readable.getReader().read();
  return result.value || '';
}

export default async function middleware(...args: WithAuthArgs) {
  const request = args[0] as NextRequest;

  if (request.nextUrl.pathname === '/api/interactions') {
    const signature = request.headers.get('X-Signature-Ed25519') || '';
    const timestamp = request.headers.get('X-Signature-Timestamp') || '';

    const isValidRequest = verifyKey(
      await getRawbody(request.body),
      signature,
      timestamp,
      process.env.DISCORD_PUBLIC_KEY || ''
    );

    if (!isValidRequest) {
      return NextResponse.json('Invalid Signature', { status: 401 });
    }

    return NextResponse.next();
  }

  return nextAuthMiddleware(...args);
}
