## The **cross-ping** program

The program workspace includes the following packages:
- `cross-ping` is the package allowing to build WASM binary for the program and IDL file for it.  
  The package also includes integration tests for the program in the `tests` sub-folder
- `cross-ping-app` is the package containing business logic for the program represented by the `CrossPingService` structure.  
- `cross-ping-client` is the package containing the client for the program allowing to interact with it from another program, tests, or
  off-chain client.

