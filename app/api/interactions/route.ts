import { handleLoadMatch } from '@/utils/match';
import {
  handleRegisterMember,
  registerMember,
  registerResponse,
  registerSummoner,
} from '@/utils/register';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  const { type, data } = body;

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
          return await handleRegisterMember(body.guild_id, body.member.user.id);
        case 'match':
          return await handleLoadMatch(body.guild_id, body.member.user.id);
      }
    case InteractionType.MODAL_SUBMIT:
      if (data.custom_id !== 'summoner_register_modal') return;
      const summonerName = data.components[0].components.find(
        ({ custom_id }: { custom_id: string }) => custom_id === 'summoner_name'
      ).value;

      const summoner = await registerSummoner(
        body.member.user.id,
        summonerName
      );

      if (!summoner) {
        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `${body.member.user.username}이 [${summonerName}] 소환사 등록에 실패했습니다.`,
          },
        });
      }

      const [member, guild] = await registerMember(body.guild_id, summoner.id);

      if (!member) return;
      return registerResponse(member.summoner, guild);
  }
}
