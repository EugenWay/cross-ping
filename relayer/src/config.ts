import { config } from 'dotenv';

config();

export const VARA_RPC_URL = process.env.VARA_RPC_URL;
export const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL;
export const CROSS_PING_PROGRAM_ID = process.env.CROSS_PING_PROGRAM_ID as `0x${string}`;


export const CROSS_PING_IDL = `
type Error = enum {
  DestinationNotInitialized,
  BridgeSendFailed,
  BridgeReplyFailed,
  InvalidBridgeResponse,
};

type PingSent = struct {
  sender: actor_id,
  nonce: opt u64,
  message_hash: h256,
};

constructor {
  New : (destination: h160);
};

service CrossPing {
  SendPing : () -> result (null, Error);

  events {
    PingSent: PingSent;
  }
};
`;