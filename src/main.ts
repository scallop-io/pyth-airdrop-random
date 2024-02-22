import { getLatestDrandRound } from './drand';
import blake2b from 'blake2b';
import fs from 'fs';
import { fromHEX } from '@mysten/sui.js/utils';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const isTest = true;
const folderName = isTest ? 'test_result' : 'result';


async function main() {
  if(!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }
  const addresses = await getAddressFromDb();
  await generateHashResults(addresses);
  sortHashResult();
}

async function getAddressFromDb(): Promise<string[]> {
  const mongo = new MongoClient(process.env.MONGO_URI ?? 'mongodb://localhost:27017');
  await mongo.connect();
  const pythAirdrop = mongo.db().collection('pyth-airdrop');
  const addresses = await pythAirdrop.find({}, {
    projection: {
      address: 1,
      _id: 0
    }
  }).toArray();
  await mongo.close();
  return addresses.map((address: any) => address.address as string);
}


async function generateHashResults(addresses: string[]) {
  const drand = await getLatestDrandRound();

  const hashedResults: {address: string, randomness: string, hashResultHex: string, hashResultNumber: string}[] = []; 
  addresses.forEach((address) => {
    const input = Buffer.from(`${address}${drand.randomness}`);
    const output = new Uint8Array(32);
    // Use personalization message to make the hash unique each application
    const hash = blake2b(output.length, undefined, undefined, Buffer.from("scallop-pyth-air")).update(input).digest('hex');
    hashedResults.push({
      address,
      randomness: drand.randomness,
      hashResultHex: hash,
      hashResultNumber: BigInt('0x' + hash).toString(),
    });
    
  });
  fs.writeFileSync(`${folderName}/hashedResults.json`, JSON.stringify(hashedResults, null, 2));
}

function sortHashResult() {
  const hashedResults = JSON.parse(fs.readFileSync(`${folderName}/hashedResults.json`, 'utf-8'));
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
  }).map((result: any, index: number) => {
    return {...result, rank: index + 1}
  });
  fs.writeFileSync(`${folderName}/sortedResults.json`, JSON.stringify(sortedResults, null, 2));
}


main();
