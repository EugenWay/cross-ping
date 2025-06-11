import { connectVara, sails, listenMerkleRootChanged, listenPingSent, getMerkleProof } from './vara';
import { connectEthereum, listenRelayerProxy } from './ethereum';

import { PingSentEvent } from './types';

interface PingProof {
    sender: string;
    messageHash: string;
    nonce: number | null;
    merkleRoot: string;
    proof: any;
}

let latestVaraMerkleRoot: string | null = null;
let latestEthereumMerkleRoot: string | null = null;
const pingProofs: PingProof[] = [];

async function main() {
    try {
        // 1. Connect to Vara & Ethereum
        const varaApi = await connectVara();
        const ethApi = await connectEthereum();

        // 2. Listen to MerkleRoot updates from Vara
        listenMerkleRootChanged(varaApi, (root) => {
            console.log('✅ [Vara] New Merkle Root:', root);
            latestVaraMerkleRoot = root;
        });

        // 3. Listen to MerkleRootSubmitted events from Ethereum
        listenRelayerProxy(ethApi, (root) => {
            // check if the root is the same as the latestMerkleRoot with our massages
            if (root === latestVaraMerkleRoot) {
                console.log('✅ [Ethereum] MerkleRootSubmitted:', root);
                latestEthereumMerkleRoot = root;
            }
        });

        // 4. Listen to PingSent events in Vara & collect proofs
        listenPingSent(sails, async (event: PingSentEvent) => {
            if (!latestVaraMerkleRoot) {
                console.warn('[WARN] Merkle Root not yet received!');
                return;
            }
            const { sender, messageHash, nonce } = event;
            const proof = await getMerkleProof(varaApi, messageHash as `0x${string}`);
            const pingData: PingProof = { sender, messageHash, nonce, merkleRoot: latestVaraMerkleRoot, proof: proof.toHuman() };
            pingProofs.push(pingData);
            console.log('📥 Saved new PingProof:', pingData);
        });

    } catch (error) {
        console.error('Error in main:', error);
        process.exit(1);
    }
}

main().catch(console.error);