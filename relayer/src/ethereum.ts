// ethereum.ts
import { ethers } from 'ethers';
import { ETHEREUM_RPC_URL } from './config';

export let ethereumProvider: ethers.JsonRpcProvider | null = null;

export async function connectEthereum(): Promise<ethers.JsonRpcProvider> {
    if (ethereumProvider) {
        return ethereumProvider;
    }

    console.log('🔗 Connecting to Ethereum Holesky RPC...');
    ethereumProvider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);

    try {
        await ethereumProvider.getBlockNumber();
        console.log('✅ Connected to Ethereum Holesky!');
    } catch (err) {
        console.error('❌ Ethereum Holesky connection failed:', err);
        throw err;
    }

    return ethereumProvider;
}
