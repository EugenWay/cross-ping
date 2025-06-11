import { config } from 'dotenv';

config();

export const VARA_RPC_URL = process.env.VARA_RPC_URL;
export const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL as string;
export const CROSS_PING_PROGRAM_ID = process.env.CROSS_PING_PROGRAM_ID as `0x${string}`;

// ethereum contract addresses
export const RELAYER_PROXY_ADDRESS = process.env.RELAYER_PROXY_ADDRESS as string;
export const MESSAGE_QUEUE_PROXY_ADDRESS = process.env.MESSAGE_QUEUE_PROXY_ADDRESS;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;

// cross-ping idl
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

export const RELAYER_PROXY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "blockNumber", "type": "uint256" },
      { "indexed": true, "internalType": "bytes32", "name": "merkleRoot", "type": "bytes32" }
    ],
    "name": "MerkleRoot",
    "type": "event"
  }
];