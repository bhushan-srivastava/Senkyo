const path = require('path');

module.exports = {
    contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545, // Change this to your Ganache port
            network_id: "*", // Match any network id
        },
        // Configure other networks (Rinkeby, etc.) if needed
    },
    compilers: {
        solc: {
            version: "0.8.0", // Specify the Solidity compiler version you want to use
        },
    },
};
