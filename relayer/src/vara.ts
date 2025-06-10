import { GearApi, Proof, HexString } from '@gear-js/api';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import { H256 } from '@polkadot/types/interfaces';
import { VARA_RPC_URL, CROSS_PING_IDL, CROSS_PING_PROGRAM_ID } from './config';

export interface PingSentEvent {
  sender: string;
  nonce: number | null;
  messageHash: '0x${string}';
}

export let varaProvider: GearApi | null = null;
let sails: Sails;

export async function connectVara(): Promise<GearApi> {
  if (varaProvider) return varaProvider;

  varaProvider = await GearApi.create({ providerAddress: VARA_RPC_URL });
  console.log('✅ Connected to Vara!');

  const parser = await SailsIdlParser.new();
  sails = new Sails(parser);
  sails.parseIdl(CROSS_PING_IDL);
  sails.setApi(varaProvider);
  sails.setProgramId(CROSS_PING_PROGRAM_ID as `0x${string}`);

  return varaProvider;
}

export async function listenMerkleRootChanged(api: GearApi, onRoot: (root: string) => void) {
  const unsub = await api.query.system.events((events) => {
    events.forEach(({ event }) => {
      const { section, method, data } = event;

      if (section === 'gearEthBridge' && method === 'QueueMerkleRootChanged') {
        const merkleRoot = data[0] as H256;

        console.log('📦 Merkle Root Event Detected:', merkleRoot.toHex());
        onRoot(merkleRoot.toHex());
      }
    });
  });

  return unsub;
}

export function listenPingSent(api: GearApi, onPingSent: (event: PingSentEvent) => void) {
  const unsub = api.gearEvents.subscribeToGearEvent(
    'UserMessageSent',
    ({ data: { message } }) => {
      const { source, payload } = message;

      if (source.toString() !== CROSS_PING_PROGRAM_ID) return;

      let decoded: any;

      try {
        decoded = sails.services.CrossPing.events.PingSent.decode(payload.toHex());
      } catch (e) {
        console.warn('Failed to decode PingSent payload:', e);
        return;
      }

      onPingSent({
        sender: decoded.sender,
        nonce: decoded.nonce,
        messageHash: decoded.message_hash,
      });
    },
  );

  return unsub;
}

export async function getMerkleProof(api: GearApi, messageHash: HexString): Promise<Proof> {
  try {
    return await api.ethBridge.merkleProof(messageHash);
  } catch (error) {
    console.error('Failed to get merkle proof:', error);
    throw error;
  }
}