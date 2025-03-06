import { StatsigClient, StatsigUser } from '@statsig/js-client';

// This is a dummy client. See our docs (https://docs.statsig.com/sdks/getting-started)
// for how you can integrate the Statsig SDK in your specific application
export async function generateStatsigClient(): Promise<StatsigClient> {
  const user: StatsigUser = { userID: 'some_user_id' };
  const statsigClient = new StatsigClient(process.env.STATSIG_SDK_KEY!, user);
  await statsigClient.initializeAsync();
  return statsigClient;
}
