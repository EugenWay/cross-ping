"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// RPC connections and event listening
const vara_1 = require("./vara");
const ethereum_1 = require("./ethereum");
async function main() {
    try {
        await (0, vara_1.connectVara)();
        await (0, ethereum_1.connectEthereum)();
        console.log('Connected to Vara and Ethereum networks');
        console.log('Started listening for events...');
    }
    catch (error) {
        console.error('Error in main:', error);
        process.exit(1);
    }
}
main().catch(console.error);
