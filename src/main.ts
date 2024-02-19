import { getLatestDrandRound } from './drand';
import { generateAddresses } from './utils/addressGenerator';
import blake2b from 'blake2b';
import fs from 'fs';
import { fromHEX } from '@mysten/sui.js/utils';


async function main() {
  if(!fs.existsSync('result')) {
    fs.mkdirSync('result', { recursive: true });
  }
  await generateHashResults();
  sortHashResult();
}

async function generateHashResults() {
  const addresses = generateAddresses(10);
  const drand = await getLatestDrandRound();

  const hashedResults: {address: string, randomness: string, hashResultHex: string, hashResultNumber: string}[] = []; 
  addresses.forEach((address) => {
    const input = Buffer.from(`${address}${drand.randomness}`);
    const output = new Uint8Array(32);
    // Use personalization message to make the hash unique each application
    const hash = blake2b(output.length, undefined, undefined, Buffer.from("scallop-pyth-air")).update(input).digest('hex');
    let view = new DataView(fromHEX(hash).buffer, 0);
    hashedResults.push({
      address,
      randomness: drand.randomness,
      hashResultHex: hash,
      hashResultNumber: view.getBigUint64(0, true).toString(),
    });
    
  });
  fs.writeFileSync('result/hashedResults.json', JSON.stringify(hashedResults, null, 2));
}

function sortHashResult() {
  const hashedResults = JSON.parse(fs.readFileSync('hashedResults.json', 'utf-8'));
  const sortedResults = hashedResults.sort((a: any, b: any) => {
    const aHashResultNumber = BigInt(a.hashResultNumber);
    const bHashResultNumber = BigInt(b.hashResultNumber);
    if (aHashResultNumber > bHashResultNumber) {
      return -1;
    }
    if (aHashResultNumber < bHashResultNumber) {
      return 1;
    }
    return 0;
  });
  fs.writeFileSync('result/sortedResults.json', JSON.stringify(sortedResults, null, 2));
}


main();
