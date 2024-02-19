import { SuiKit } from '@scallop-io/sui-kit';
import dotenv from 'dotenv';
dotenv.config();

export function generateAddresses(total: number): string[] {
  const suiKit = new SuiKit({
    mnemonics: process.env.MNEMONIC,
    networkType: 'mainnet',
  });

  const addresses: string[] = []
  for (let i = 0; i < total; i++) {
    suiKit.switchAccount({
      accountIndex: i,
    });
    const address = suiKit.currentAddress();
    addresses.push(address);
  }
  return addresses;
}