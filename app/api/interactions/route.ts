import {
  getSummonerByDiscordId,
  registerMember,
  registerSummoner,
} from '@/utils/register';
import { positionOptions } from '@/utils/summoner';
import { PositionType } from '@prisma/client';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  const {
    type,
    data,
    member: { user },
  } = body;

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
          const summoner = await getSummonerByDiscordId(user.id);

          if (!summoner) {
            return NextResponse.json({
              type: InteractionResponseType.MODAL,
              data: {
                title: '소환사 등록',
                custom_id: 'summoner_register_modal',
                components: [
                  {
                    type: 1,
                    components: [
                      {
                        type: 4,
                        custom_id: 'summoner_name',
                        label: '소환사 이름',
                        style: 1,
                        min_length: 1,
                        max_length: 20,
                        placeholder: 'Hide on bush',
                        required: true,
                      },
                    ],
                  },
                ],
              },
            });
          }

          const result = await registerMember(body.guild_id, summoner.id);

          return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: JSON.stringify(result) },
          });
      }
    case InteractionType.MODAL_SUBMIT:
      if (data.custom_id !== 'summoner_register_modal') return;

      const summonerName = data.components[0].components.find(
        ({ custom_id }: { custom_id: string }) => custom_id === 'summoner_name'
      ).value;

      const result = await registerSummoner(user.id, summonerName);

      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: `${result.name} 소환사 등록이 완료되었습니다.` },
      });
  }
}
