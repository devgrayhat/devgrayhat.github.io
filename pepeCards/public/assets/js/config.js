const isProduction = false;
const NETWORK_ID = isProduction ? '0x1' : '0xaa36a7';
const CARD_WALLET = isProduction ? "0x2dADE6Cc700AB5CA7f1709A4EcB5F3b1F9ADB885" : "0x6308c6B2c88B32F8f76C385C8676B76cD0f41B0F"; 

const baseUrl = isProduction ? 'https://www.pepecard.cc' : 'http://127.0.0.1:8001';
const PEPE_CONTRACT_ADDRESS = isProduction ? "0x6982508145454Ce325dDbE47a25d4ec3d2311933" : "0xCBB9EBFbAd74dDc0896c2E00eD23199285d05DB5"; 
const PEPECARD_CONTRACT_ADDRESS = isProduction ? "0x7a003e61653435b21D83Cb6111064DD2A54b1c13" : "0x4e56769531330b752204b58a5b5c7952615ce0e4"; 

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
const ETH_MAIN_ADDRESS = "0x0000000000000000000000000000000000000000";

const contractABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];