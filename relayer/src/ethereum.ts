// ethereum.ts
import { ethers } from 'ethers';
import { ETHEREUM_RPC_URL, RELAYER_PROXY_ADDRESS, MESSAGE_QUEUE_PROXY_ADDRESS, PRIVATE_KEY, RELAYER_PROXY_ABI } from './config';


export let walletSigner: ethers.Wallet | null = null;
export let ethereumProvider: ethers.WebSocketProvider | null = null;

// Connects to the Ethereum Holesky RPC
// @returns The Ethereum provider
export async function connectEthereum(): Promise<ethers.WebSocketProvider> {
    if (ethereumProvider) return ethereumProvider;
  
    ethereumProvider = new ethers.WebSocketProvider(ETHEREUM_RPC_URL);
  
    await ethereumProvider.getBlockNumber();
    console.log('✅ Connected to Ethereum!');
    return ethereumProvider;
  }

// Creates a wallet from the PRIVATE_KEY
// @param provider - The Ethereum provider
// @returns The wallet
export function createWallet(provider: ethers.JsonRpcProvider): ethers.Wallet {
    if (!PRIVATE_KEY) throw new Error('No PRIVATE_KEY in env!');

    walletSigner = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log('👛 Wallet connected:', walletSigner.address);
    return walletSigner;
}

// Connects to the RelayerProxy contract and listens for the MerkleRoot event
// @param provider - The Ethereum provider
// @param onMerkleRoot - The callback function to handle the MerkleRoot event
// Receives (merkleRoot: string, blockNumber: ethers.BigNumberish)
export function listenRelayerProxy(
    provider: ethers.Provider,
    onMerkleRoot: (merkleRoot: string, blockNumber: ethers.BigNumberish) => void
  ) {
    const relayerProxy = new ethers.Contract(RELAYER_PROXY_ADDRESS, RELAYER_PROXY_ABI, provider);

    relayerProxy.on('MerkleRoot', (blockNumber: ethers.BigNumberish, merkleRoot: string, event) => {
      console.log('🟢 MerkleRoot event received (ethers):', { blockNumber, merkleRoot, event });
      onMerkleRoot(merkleRoot, blockNumber);
    });
  
    console.log('🔔 Listening RelayerProxy contract for MerkleRoot events:', RELAYER_PROXY_ADDRESS);
  }
