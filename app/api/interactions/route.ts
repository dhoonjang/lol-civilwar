import {
  getSummonerByDiscordId,
  registerMember,
  registerSummoner,
} from '@/utils/register';
import { Guild, Summoner } from '@prisma/client';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { NextResponse } from 'next/server';

const registerResponse = (summoner: Summoner, guild: Guild | null) =>
  NextResponse.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `[${summoner.name}] 소환사가 길드${
        !guild ? '에 합류했습니다.' : '를 만들었습니다.'
      }`,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: !guild
                ? `[${summoner.name}] 소환사 바로가기`
                : `길드 바로가기`,
              style: 5,
              url: `https://lol-civilwar.vercel.app/${
                !guild ? `summoners/${summoner.id}` : `guilds/${guild.id}`
              }`,
            },
          ],
        },
      ],
    },
  });

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

          const [member, guild] = await registerMember(
            body.guild_id,
            summoner.id
          );

          if (!member) return;
          return registerResponse(member.summoner, guild);
      }
    case InteractionType.MODAL_SUBMIT:
      if (data.custom_id !== 'summoner_register_modal') return;

      const summonerName = data.components[0].components.find(
        ({ custom_id }: { custom_id: string }) => custom_id === 'summoner_name'
      ).value;

      const summoner = await registerSummoner(user.id, summonerName);

      if (!summoner) {
        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `${user.username}이 [${summonerName}] 소환사 등록에 실패했습니다.`,
          },
        });
      }

      const [member, guild] = await registerMember(body.guild_id, summoner.id);

      if (!member) return;
      return registerResponse(member.summoner, guild);
  }
}
