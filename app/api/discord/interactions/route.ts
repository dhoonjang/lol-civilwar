import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  const { type, id, data } = body;

  if (type === InteractionType.PING) {
    return NextResponse.json({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world',
        },
      });
    }
  }
}
