"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethereumProvider = void 0;
exports.connectEthereum = connectEthereum;
// ethereum.ts
const ethers_1 = require("ethers");
const config_1 = require("./config");
exports.ethereumProvider = null;
async function connectEthereum() {
    if (exports.ethereumProvider) {
        return exports.ethereumProvider;
    }
    console.log('Connecting to Ethereum Holesky RPC...');
    exports.ethereumProvider = new ethers_1.ethers.JsonRpcProvider(config_1.ETHEREUM_RPC_URL);
    try {
        await exports.ethereumProvider.getBlockNumber();
        console.log('Connected to Ethereum Holesky!');
    }
    catch (err) {
        console.error('Ethereum Holesky connection failed:', err);
        throw err;
    }
    return exports.ethereumProvider;
}
