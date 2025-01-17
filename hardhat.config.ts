import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "@tenderly/hardhat-tenderly"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "solidity-coverage"
import "hardhat-abi-exporter"

import "ts-node/register"
import "tsconfig-paths/register"

// chainId?: number
// from?: string;
// gas: "auto" | number;
// gasPrice: "auto" | number;
// gasMultiplier: number;
// url: string;
// timeout: number;
// httpHeaders: { [name: string]: string };
// accounts: HttpNetworkAccountsConfig;

export const hardhatConfig = {
    networks: {
        hardhat: {
            allowUnlimitedContractSize: true,
        },
        localhost: { url: "http://localhost:7545" },
        fork: {
            url: "http://localhost:7545",
        },
        // export the NODE_URL environment variable to use remote nodes like Alchemy or Infura. eg
        // export NODE_URL=https://eth-mainnet.alchemyapi.io/v2/yourApiKey
        env: { url: process.env.NODE_URL || "" },
        ropsten: {
            url: process.env.NODE_URL || "",
            gasPrice: 30000000000,
            gasLimit: 8000000,
        },
        polygon_testnet: {
            url: process.env.NODE_URL || "https://rpc-mumbai.maticvigil.com",
        },
        polygon_mainnet: {
            url: process.env.NODE_URL || "https://rpc-mainnet.matic.quiknode.pro",
        },
        mainnet: {
            url: process.env.NODE_URL || "https://main-light.eth.linkpool.io",
        },
    },
    solidity: {
        version: "0.8.6",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            outputSelection: {
                "*": {
                    Masset: ["storageLayout"],
                    FeederPool: ["storageLayout"],
                },
            },
        },
    },
    paths: { artifacts: "./build" },
    abiExporter: {
        path: "./abis",
        clear: true,
        flat: true,
    },
    gasReporter: {
        currency: "USD",
        gasPrice: 30,
    },
    mocha: {
        timeout: 240000, // 4 min timeout
    },
    typechain: {
        outDir: "types/generated",
        target: "ethers-v5",
    },
    tenderly: {
        username: "mStable",
        project: "mStable-contracts",
    },
}

export default hardhatConfig
