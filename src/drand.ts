import { z as zod } from 'zod';

const CHAIN_HASH = '8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce';
const GENESIS_TIME = 1595431050;
const PERIOD = 30; // each round is 30s

const latestRoundZod = zod.object({
  round: zod.number(),
  randomness: zod.string(),
  signature: zod.string(),
  previous_signature: zod.string(),
});

export type DrandType = zod.infer<typeof latestRoundZod>;

/**
 * Fetch latest round from drand
 *
 * NOTE: We can improve this by using fallback mechanism for the endpoints (there are 2 other endpoints)
 * - [api2.drand.sh](https://api2.drand.sh)
 * - [api3.drand.sh](https://api3.drand.sh)
 */
export const getLatestDrandRound = async (): Promise<DrandType> => {
  const data = await (
    await fetch(`https://api.drand.sh/${CHAIN_HASH}/public/latest`, { method: 'GET' })
  ).json();
  const drand = latestRoundZod.parse(data) as DrandType;
  return drand;
};

export const getDrandRound = async (round: number) => {
  const data = await (
    await fetch(`https://api.drand.sh/${CHAIN_HASH}/public/${round}`, { method: 'GET' })
  ).json();
  const drand = latestRoundZod.parse(data) as DrandType;
  return drand;
};

/**
 * Get round remaining time in second
 * @param round
 * @returns
 */
export const getRemainingRoundTime = (round: number) => {
  console.log(Math.floor(Date.now() / 1000));
  console.log(GENESIS_TIME + round * PERIOD);
  const remainingTime = GENESIS_TIME + round * PERIOD - Math.floor(Date.now() / 1000);
  console.log(`Remaining time: ${remainingTime}`);
  return remainingTime;
};
