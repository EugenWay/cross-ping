"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.varaProvider = void 0;
exports.connectVara = connectVara;
exports.listenPingSent = listenPingSent;
exports.getMerkleProof = getMerkleProof;
const api_1 = require("@gear-js/api");
const config_1 = require("./config");
exports.varaProvider = null;
async function connectVara() {
    if (exports.varaProvider) {
        return exports.varaProvider;
    }
    exports.varaProvider = await api_1.GearApi.create({ providerAddress: config_1.VARA_RPC_URL });
    console.log('Connected to Vara!');
    return exports.varaProvider;
}
function listenPingSent(api, onPingSent) {
    // @ts-expect-error: 'MessageEnqueued' is a runtime event not present in IGearEvent type
    api.gearEvents.subscribeToGearEvent('MessageEnqueued', (event) => {
        if (event.payload && event.payload.includes('PingSent')) {
            onPingSent({
                sender: event.source,
                messageHash: event.id,
                payload: event.payload,
                to: event.destination
            });
        }
    });
}
async function getMerkleProof(api, messageHash) {
    try {
        // @ts-ignore - gearEthBridge is available at runtime but not in types
        return await api.rpc.gearEthBridge.merkleProof(messageHash);
    }
    catch (error) {
        console.error('Failed to get merkle proof:', error);
        throw error;
    }
}
