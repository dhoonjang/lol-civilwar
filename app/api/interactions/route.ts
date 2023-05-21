import { fetchToDiscord } from '@/utils/index';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  const { type, id, data } = body;

  console.log(body);

  switch (type) {
    case InteractionType.PING:
      return NextResponse.json({ type: InteractionResponseType.PONG });

    case InteractionType.APPLICATION_COMMAND:
      const { name } = data;

      switch (name) {
        case 'test':
          return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: 'hello world' },
          });
        case 'register':
          const guild = await fetchToDiscord(
            `/guilds/${body.guild_id}/preview`
          );
          return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: JSON.stringify(guild) },
          });
      }
  }
}
