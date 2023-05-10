// Transfer ERC20 tokens to the contract

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

    if(tokenAddress==USDC_ADDRESS || tokenAddress==USDT_ADDRESS){
      const inputValueInSmallestUnit = ethers.utils.parseUnits(inputValue.toString(), 6);
      const outputValueInSmallestUnit = ethers.utils.parseUnits(outputValue.toString(), 6);
      console.log("inputValueInSmallestUnit: ", inputValueInSmallestUnit);
      console.log("outputValueInSmallestUnit: ", outputValueInSmallestUnit);

      await checkAndApproveToken(userAccount, tokenContract, outputValueInSmallestUnit);
      console.log("USD approval successful");    
      const signer = await tokenContract.provider.getSigner();
      let tx;
      if(tokenAddress==USDC_ADDRESS){
        console.log("USDC deposit initiated");
        tx = await targetContract.connect(signer).depositToken(USDC_ADDRESS,encryptedAddress, inputValueInSmallestUnit, dstCurrency, outputValueInSmallestUnit);
     }
      else if(tokenAddress==USDT_ADDRESS){
        tx = await targetContract.connect(signer).depositToken(USDT_ADDRESS,encryptedAddress, inputValueInSmallestUnit, dstCurrency, outputValueInSmallestUnit);
      }
      await tx.wait();
      console.log("Transfer successful, hash : ", tx.hash);
      return true;
    }    
    else if(tokenAddress==WBTC_ADDRESS){
      const inputValueInSmallestUnit = ethers.utils.parseUnits(inputValue.toString(), 8);
      const outputValueInSmallestUnit = ethers.utils.parseUnits(outputValue.toString(), 8);

      await checkAndApproveToken(userAccount, tokenContract, outputValueInSmallestUnit);
      console.log("Token approval successful");
      const signer = await tokenContract.provider.getSigner();

      const tx = await targetContract.connect(signer).depositToken(WBTC_ADDRESS,encryptedAddress, inputValueInSmallestUnit, dstCurrency, outputValueInSmallestUnit);
      await tx.wait();
        
      console.log("WBTC Transfer successful, hash : ", tx.hash);
      return true;
    }
    else if(tokenAddress==PAXG_ADDRESS){
      const inputValueInSmallestUnit = ethers.utils.parseUnits(inputValue.toString(), 18);
      const outputValueInSmallestUnit = ethers.utils.parseUnits(outputValue.toString(), 18);

      await checkAndApproveToken(userAccount, tokenContract, outputValueInSmallestUnit);
      console.log("Token approval successful");    
      const signer = await tokenContract.provider.getSigner();

      const tx = await targetContract.connect(signer).depositToken(PAXG_ADDRESS,encryptedAddress, inputValueInSmallestUnit, dstCurrency, outputValueInSmallestUnit);
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