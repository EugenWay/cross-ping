import { connectVara, sails, listenMerkleRootChanged, listenPingSent, getMerkleProof } from './vara';
import { connectEthereum } from './ethereum';

interface PingProof {
    messageHash: string;
    nonce: number | null;
    merkleRoot: string;
    proof: any;
}

let latestMerkleRoot: string | null = null;
const pingProofs: PingProof[] = [];

async function main() {
    try {
        const varaApi = await connectVara();
        const ethApi = await connectEthereum();

        console.log('Connected to Vara and Ethereum networks');
        console.log('Started listening for events...');

        await listenMerkleRootChanged(varaApi, (root) => {
            console.log('✅ Received Merkle Root:', root);
            latestMerkleRoot = root;
        });

        await listenPingSent(sails, async (event: any) => {
            if (!latestMerkleRoot) {
                console.warn(' Merkle Root ещё не получен!');
                return;
            }

            const { messageHash, nonce } = event;
            const proof = await getMerkleProof(varaApi, messageHash);

            const pingData: PingProof = {
                messageHash,
                nonce,
                merkleRoot: latestMerkleRoot,
                proof: proof.toHuman(),
            };
            pingProofs.push(pingData);
            console.log('📥 Saved new PingProof:', pingData);
        });

    } catch (error) {
        console.error('Error in main:', error);
        process.exit(1);
    }
}

main().catch(console.error);