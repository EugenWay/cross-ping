export interface PingSentEvent {
    sender: string;
    messageHash: string;
    payload: string;
    to: string;
}

export interface MerkleRootSubmittedEvent {
    root: string;
}

export interface MerkleProof {
    root: string;
    proof: string[];
    leaf: string;
}

export interface VaraApi {
    events: {
        subscribeToNewEvents: (callback: (event: any) => void) => void;
    };
    rpc: {
        gearEthBridge_merkleProof: (messageHash: string) => Promise<MerkleProof>;
    };
}

export interface EthereumProvider {
    provider: any;
    wallet: any;
    contract: any;
} 