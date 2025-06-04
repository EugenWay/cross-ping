#![no_std]
#![allow(static_mut_refs)]

use sails_rs::prelude::*;
use gbuiltin_eth_bridge::{Request as BridgeRequest, Response as BridgeResponse};


// built-in bridge actor id
const BRIDGE_ACTOR_ID: [u8; 32] = [
    0xf2, 0x81, 0x6c, 0xed, 0x0b, 0x15, 0x74, 0x95,
    0x95, 0x39, 0x2d, 0x3a, 0x18, 0xb5, 0xa2, 0x36,
    0x3d, 0x6f, 0xef, 0xe5, 0xb3, 0xb6, 0x15, 0x37,
    0x39, 0xf2, 0x18, 0x15, 0x1b, 0x7a, 0xcd, 0xbf
];

const GAS_TO_SEND_REQUEST: u64 = 100_000_000;
const FEE_BRIDGE: u128 = 0;
const GAS_FOR_REPLY_DEPOSIT: u64 = 10_000_000;

#[derive(Default, Encode, Decode, TypeInfo)]
pub struct State {
    pub destination: Option<H160>,
}
static mut STATE: Option<State> = None;

#[derive(Debug, Encode, Decode, TypeInfo)]
pub enum Error {
    DestinationNotInitialized,
    BridgeSendFailed,
    BridgeReplyFailed,
    InvalidBridgeResponse,
}

#[derive(Debug, Encode, Decode, TypeInfo)]
pub struct PingSent {
    pub sender: gstd::ActorId,
    pub nonce: Option<u64>,
}

pub struct CrossPingService;

#[service]
impl CrossPingService {
    pub fn send_ping(&self) -> Result<(), Error> {
        let state = unsafe { STATE.as_ref().expect("State not initialized") };
        let destination = state.destination.ok_or(Error::DestinationNotInitialized)?;

        let sender = gstd::exec::program_id();
        let payload = sender.as_ref().to_vec();

        let bridge_actor_id = gstd::ActorId::from(BRIDGE_ACTOR_ID);

        let request = BridgeRequest::SendEthMessage { destination, payload }.encode();

        gstd::msg::send_bytes_with_gas_for_reply(
            bridge_actor_id,
            request,
            GAS_TO_SEND_REQUEST,
            FEE_BRIDGE,
            GAS_FOR_REPLY_DEPOSIT,
        )
        .map_err(|_| Error::BridgeSendFailed)?
        .up_to(None)
        .map_err(|_| Error::BridgeReplyFailed)?
        .handle_reply(move || {
            let reply_bytes = gstd::msg::load_bytes().expect("Unable to load reply bytes");
            let reply = BridgeResponse::decode(&mut &reply_bytes[..])
                .expect("Failed to decode bridge reply");
            match reply {
                BridgeResponse::EthMessageQueued { nonce, .. } => {
                    gstd::msg::reply(
                        PingSent {
                            sender,
                            nonce: Some(nonce.as_u64()),
                        },
                        0,
                    )
                    .expect("Failed to emit PingSent event");
                }
            }
        })
        .map_err(|_| Error::BridgeReplyFailed)?;

        Ok(())
    }
}

pub struct CrossPingProgram;


impl CrossPingProgram {
    pub fn new(destination: H160) -> Self {
        unsafe { STATE = Some(State { destination: Some(destination) }); }
        Self
    }
    pub fn cross_ping(&self) -> CrossPingService {
        CrossPingService
    }
}
