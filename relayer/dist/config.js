"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETHEREUM_RPC_URL = exports.VARA_RPC_URL = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.VARA_RPC_URL = process.env.VARA_RPC_URL;
exports.ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL;
