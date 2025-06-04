#![no_std]

use sails_rs::prelude::*;

struct CrossPingService(());

#[sails_rs::service]
impl CrossPingService {
    pub fn new() -> Self {
        Self(())
    }

    // Service's method (command)
    pub fn do_something(&mut self) -> String {
        "Hello from CrossPing!".to_string()
    }

    // Service's query
    pub fn get_something(&self) -> String {
        "Hello from CrossPing!".to_string()
    }    
}

pub struct CrossPingProgram(());

#[sails_rs::program]
impl CrossPingProgram {
    // Program's constructor
    pub fn new() -> Self {
        Self(())
    }

    // Exposed service
    pub fn cross_ping(&self) -> CrossPingService {
        CrossPingService::new()
    }
}
