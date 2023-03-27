const CONTRACT_ADDRESS = "";    // Enter contract address
const contractABI =   ;         // Define contract ABI

const minEthLimit = 0.5;
const maxEthLimit = 5.125;

const minUsdLimit = 500;
const maxUsdLimit = 5125;

const NETWORK_ID = 1;

const ETH_LIMIT_1 = 0.5;
const ETH_LIMIT_2 = 1;
const ETH_LIMIT_3 = 3;
const ETH_LIMIT_4 = 5.125;

const USD_LIMIT_1 = 500;
const USD_LIMIT_2 = 1000;
const USD_LIMIT_3 = 3000;
const USD_LIMIT_4 = 5125;

const WBTC_LIMIT_1 = 0.03;
const WBTC_LIMIT_2 = 0.06;
const WBTC_LIMIT_3 = 0.2;
const WBTC_LIMIT_4 = 0.375;

const PAXG_LIMIT_1 = 0.5;
const PAXG_LIMIT_2 = 1;
const PAXG_LIMIT_3 = 3;
const PAXG_LIMIT_4 = 5.125;

// Define USDC ABI (ERC20 Interface)
const erc20ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

const ethAddress = "0x0000000000000000000000000000000000000000";
const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const wbtcAddress = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const paxgAddress = "0x45804880De22913dAFE09f4980848ECE6EcbAf78";
