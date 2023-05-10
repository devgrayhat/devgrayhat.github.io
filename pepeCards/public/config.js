const isProduction = false;
const NETWORK_ID = isProduction ? 1 : 11155111;
const MIN_PEPECARD_BALANCE = isProduction ? 10000 : 10000;
const CARD_WALLET = isProduction ? "0x2dADE6Cc700AB5CA7f1709A4EcB5F3b1F9ADB885" : "0x6308c6B2c88B32F8f76C385C8676B76cD0f41B0F"; 
const TOKEN_ADDRESS = isProduction ? "0x7a003e61653435b21D83Cb6111064DD2A54b1c13" : "0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0"; // BBTT on mainnet
const baseUrl = isProduction ? 'https://www.pepecard.cc' : 'http://127.0.0.1:8001';
const CONTRACT_ADDRESS = "0x7a003e61653435b21D83Cb6111064DD2A54b1c13";
const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
const PEPE_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
const ETH_MAIN_ADDRESS = "0x0000000000000000000000000000000000000000";
const PEPE_MAIN_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const contractABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

// Define USDC ABI (ERC20 Interface)
const erc20ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];