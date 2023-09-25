const minEthLimit = 0.005;         // Change to 0.5 for mainnet
const maxEthLimit = 0.05125;       // Change to 5.125 for mainnet

const minUsdLimit = 10;            // Change to 500 for mainnet
const maxUsdLimit = 500;           // Change to 512500 for mainnet

const NETWORK_ID = 5;

const ETH_LIMIT_1 = 0.005;         // Change to 0.5 for mainnet
const ETH_LIMIT_2 = 0.01;          // Change to 5.125 for mainnet
const ETH_LIMIT_3 = 0.03;         // Change to 500 for mainnet
const ETH_LIMIT_4 = 0.05125;          // Change to 512500 for mainnet

const USD_LIMIT_1 = 10;            // Change to 0.5 for mainnet
const USD_LIMIT_2 = 50;            // Change to 5.125 for mainnet
const USD_LIMIT_3 = 100;            // Change to 500 for mainnet
const USD_LIMIT_4 = 512.5;           // Change to 512500 for mainnet

const WBTC_LIMIT_1 = 0.0005;      // Change to 0.5 for mainnet
const WBTC_LIMIT_2 = 0.001;       // Change to 5.125 for mainnet
const WBTC_LIMIT_3 = 0.003;       // Change to 500 for mainnet
const WBTC_LIMIT_4 = 0.005125;       // Change to 512500 for mainnet

const PAXG_LIMIT_1 = 0.005;      // Change to 0.5 for mainnet
const PAXG_LIMIT_2 = 0.01;       // Change to 5.125 for mainnet
const PAXG_LIMIT_3 = 0.03;       // Change to 500 for mainnet
const PAXG_LIMIT_4 = 0.05125;       // Change to 512500 for mainnet

const contractABI = [
  "function addToBlacklist(address _addr) external",
  "function depositETH(string encryptedAddress, uint256 amount, address dst) payable",
  "function depositRateLimit() external view returns (uint256)",
  "function depositToken(address src, string encryptedAddress, uint256 requestAmount, address dst, uint256 txValue) external",
  "function depositUSDC(string encryptedAddress, uint256 requestAmount, address dst, uint256 txValue) external",
  "function depositUSDT(string encryptedAddress, uint256 requestAmount, address dst, uint256 txValue) external",
  "function getUserDeposits(address _addr) external view returns (uint256, uint256, uint256)",
  "function getUserTokenDeposits(address sender, address token) external view returns (uint256)",
  "function isBlacklisted(address) external view returns (bool)",
  "function isOwner(address) external view returns (bool)",
  "function lastDepositTime() external view returns (uint256)",
  "function minEthAmount() external view returns (uint256)",
  "function minTokenAmount(address) external view returns (uint256)",
  "function minUsdAmount() external view returns (uint256)",
  "function modifyMinEthAmount(uint256 amount) external",
  "function modifyMinTokenAmount(address _addr, uint256 amount) external",
  "function modifyRateLimit(uint256 rate) external",
  "function modifyminUsdAmount(uint256 amount) external",
  "function removeFromBlacklist(address _addr) external",
  "function senderEthDeposits(address) external view returns (uint256)",
  "function senderUsdcDeposits(address) external view returns (uint256)",
  "function senderUsdtDeposits(address) external view returns (uint256)",
  "function setOwner(address _owner, bool _isOwner) external",
  "function withdrawETH(address dst) external",
  "function withdrawTokens(address token, address dst) external"
];

// 0xD6eA1686B523EcC32742771d659065E73eC3eE46 Sender

// Define USDC ABI (ERC20 Interface)
const erc20ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

const CONTRACT_ADDRESS = "0x722263e5d06373f9ae9f172dd959650ed7e1b409"; // Test smart contract address
const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
const USDC_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"; // Test USDC
const USDT_ADDRESS = "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49"; // Test USDT
const WBTC_ADDRESS = "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05"; // Test WBTC
const PAXG_ADDRESS = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"; // Chain Link address

