


const contractABI =   [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":false,"internalType":"uint256","name":"txValue","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"userInputAmount","type":"uint256"},{"indexed":false,"internalType":"string","name":"encryptedAddress","type":"string"},{"indexed":true,"internalType":"address","name":"srcCurrency","type":"address"},{"indexed":true,"internalType":"address","name":"dstCurrency","type":"address"},{"indexed":false,"internalType":"uint256","name":"senderEthDeposits","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"senderUsdcDeposits","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"senderUsdtDeposits","type":"uint256"}],"name":"newDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":false,"internalType":"uint256","name":"txValue","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"userInputAmount","type":"uint256"},{"indexed":false,"internalType":"string","name":"encryptedAddress","type":"string"},{"indexed":true,"internalType":"address","name":"srcCurrency","type":"address"},{"indexed":true,"internalType":"address","name":"dstCurrency","type":"address"},{"indexed":false,"internalType":"uint256","name":"senderTokenDeposits","type":"uint256"}],"name":"newTokenDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"bool","name":"isOwner","type":"bool"}],"name":"ownershipChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"address","name":"currency","type":"address"}],"name":"withdrawalMade","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"addToBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"encryptedAddress","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"dst","type":"address"}],"name":"depositETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"depositRateLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"string","name":"encryptedAddress","type":"string"},{"internalType":"uint256","name":"requestAmount","type":"uint256"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"txValue","type":"uint256"}],"name":"depositToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"encryptedAddress","type":"string"},{"internalType":"uint256","name":"requestAmount","type":"uint256"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"txValue","type":"uint256"}],"name":"depositUSDC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"encryptedAddress","type":"string"},{"internalType":"uint256","name":"requestAmount","type":"uint256"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"txValue","type":"uint256"}],"name":"depositUSDT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"getUserDeposits","outputs":[{"internalType":"uint256","name":"ethDeposits","type":"uint256"},{"internalType":"uint256","name":"usdtDeposits","type":"uint256"},{"internalType":"uint256","name":"usdcDeposits","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"token","type":"address"}],"name":"getUserTokenDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isBlacklisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDepositTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minDollarAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minEthAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"minTokenAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minWbtcAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"modifyMinDollarAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"modifyMinEthAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"modifyMinTokenAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"modifyMinWbtcAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"name":"modifyRateLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"removeFromBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"senderEthDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"senderUsdcDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"senderUsdtDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"bool","name":"_isOwner","type":"bool"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dst","type":"address"}],"name":"withdrawETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"dst","type":"address"}],"name":"withdrawTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

// Define USDC ABI (ERC20 Interface)
const erc20ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

// You should replace these constants with the appropriate values
//const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const CONTRACT_ADDRESS = "0x06cec798ec90aa79a023b40b716d32577d9d0b8d";
const ethAddress = "0x0000000000000000000000000000000000000000";
const usdcAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
const usdtAddress = "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49";
const wbtcAddress = "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05";
const paxgAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"; //Chain Link address

async function getEthereumProvider() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Please install MetaMask or another Web3 provider.');
  }

  return new ethers.providers.Web3Provider(window.ethereum);
}

async function getUserAccount() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  console.log("User account: ", accounts[0]);
  return accounts[0];
}

async function getTokenContract(provider, address) {
  return new ethers.Contract(address, erc20ABI, provider.getSigner());
}

async function getTargetContract(provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider.getSigner());
}

async function checkAndApproveToken(userAccount, tokenContract, outputValue) {
  const currentAllowance = await tokenContract.allowance(userAccount, CONTRACT_ADDRESS);
  console.log("Current Allowance: ", currentAllowance.toString());

  if (currentAllowance.lt(outputValue)) {
    const approvalTx = await tokenContract.approve(CONTRACT_ADDRESS, outputValue);
    const receipt = await approvalTx.wait();

    if (receipt.status !== 1) {
      throw new Error("Token approval failed");
    }
  }
}

async function approveAndTransferToken(tokenAddress, encryptedAddress, inputValue, dstCurrency, outputValue) {
  try {
    const provider = await getEthereumProvider();
    const userAccount = await getUserAccount();
    const tokenContract = await getTokenContract(provider, tokenAddress);
    const targetContract = await getTargetContract(provider);

    if(tokenAddress==usdcAddress || tokenAddress==usdtAddress){
      const inputValueInSmallestUnit = ethers.utils.parseUnits(inputValue.toString(), 6);
      const outputValueInSmallestUnit = ethers.utils.parseUnits(outputValue.toString(), 6);
      console.log("inputValueInSmallestUnit: ", inputValueInSmallestUnit);
      console.log("outputValueInSmallestUnit: ", outputValueInSmallestUnit);

      await checkAndApproveToken(userAccount, tokenContract, outputValueInSmallestUnit);
      console.log("Dollar approval successful");    
      const signer = await tokenContract.provider.getSigner();
      let tx;
      if(tokenAddress==usdcAddress){
        //console.log("USDC deposit initiated");
        document.getElementById("transferButton").innerText = "Processing transaction...";      
        tx = await targetContract.connect(signer).depositUSDC(encryptedAddress, inputValueInSmallestUnit, dstCurrency, outputValueInSmallestUnit);
      }
      else if(tokenAddress==usdtAddress){
        document.getElementById("transferButton").innerText = "Processing transaction...";      
        tx = await targetContract.connect(signer).depositUSDT(encryptedAddress, inputValueInSmallestUnit, dstCurrency, outputValueInSmallestUnit);
      }
      await tx.wait();
      console.log("Transfer successful, hash : ", tx.hash);
      return true;
    }    
    else if(tokenAddress==wbtcAddress){
      const inputValueInSmallestUnit = ethers.utils.parseUnits(inputValue.toString(), 8);
      const outputValueInSmallestUnit = ethers.utils.parseUnits(outputValue.toString(), 8);
      console.log("inputValueInSmallestUnit: ", inputValueInSmallestUnit);
      console.log("outputValueInSmallestUnit: ", outputValueInSmallestUnit);

      await checkAndApproveToken(userAccount, tokenContract, outputValueInSmallestUnit);
      console.log("Token approval successful");
      const signer = await tokenContract.provider.getSigner();

      document.getElementById("transferButton").innerText = "Processing transaction...";
      const tx = await targetContract.connect(signer).depositToken(wbtcAddress,encryptedAddress, inputValueInSmallestUnit, dstCurrency, outputValueInSmallestUnit);
      await tx.wait();
      console.log("WBTC Transfer successful, hash : ", tx.hash);
      return true;
    }
    else if(tokenAddress==paxgAddress){
      const inputValueInSmallestUnit = ethers.utils.parseUnits(inputValue.toString(), 18);
      const outputValueInSmallestUnit = ethers.utils.parseUnits(outputValue.toString(), 18);

      await checkAndApproveToken(userAccount, tokenContract, outputValueInSmallestUnit);
      console.log("Token approval successful");    
      const signer = await tokenContract.provider.getSigner();

      document.getElementById("transferButton").innerText = "Processing transaction...";
      const tx = await targetContract.connect(signer).depositToken(paxgAddress,encryptedAddress, inputValueInSmallestUnit, dstCurrency, outputValueInSmallestUnit);
      await tx.wait();
      console.log("PAXG Transfer successful, hash : ", tx.hash);
      return true;
    }
  }
  catch (error) {
    console.log("Error: ", error.message);
    return false;
  }
}