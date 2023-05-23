export const fetchToRiot = async (endpoint: string, region?: string) => {
  try {
    const response = await fetch(
      `https://${region ?? 'kr'}.api.riotgames.com${endpoint}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY ?? '',
        },
      }
    );

    return await response.json();
  } catch {
    return null;
  }
};

export async function fetchToDiscord(
  endpoint: string,
  options: RequestInit = {}
) {
  try {
    const url = 'https://discord.com/api/v10' + endpoint;

    if (options.body) options.body = JSON.stringify(options.body);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
      },
      ...options,
    });

    return await response.json();
  } catch {
    return null;
  }
}
