

// Initialize provider and signer variables
const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

async function connectMetaMask() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const network = await provider.getNetwork(); 
    } catch (error) {
      console.error("User denied account access", error);
      return false;
    }
  } else {
    console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
    return false;
  }
  return true;
}

async function checkElgibility(minEth, minPepe, minPepeCard, pepeContractAddress, pepeCardContractAddress) {
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== NETWORK_ID) {
      alert('Please switch your network.');
      return null;
    }
    const isConnected = await connectMetaMask();
    if (!isConnected) {
      alert('Please connect to MetaMask.');
      return null;
    }
  } catch (error) {
    console.error('Error checking connection', error);
    return null;
  }

  try {
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    // Fetch ETH balance
    const balanceEth = await provider.getBalance(address);
    const balanceEthInEth = ethers.utils.formatEther(balanceEth);

    // Fetch PEPE balance
    const pepeContract = new ethers.Contract(pepeContractAddress, ['function balanceOf(address owner) view returns (uint256)'], signer);
    const balancePepe = await pepeContract.balanceOf(address);
    const balancePepeInPepe = ethers.utils.formatUnits(balancePepe, 18); // assuming 18 decimal places for PEPE token, adjust if necessary

    // Fetch PEPE Card balance
    const pepeCardContract = new ethers.Contract(pepeCardContractAddress, ['function balanceOf(address owner) view returns (uint256)'], signer);
    const balancePepeCard = await pepeCardContract.balanceOf(address);
    const balancePepeCardInPepe = ethers.utils.formatUnits(balancePepeCard, 9); // assuming 9 decimal places for PEPE Card token, adjust if necessary 

    // Compare balances to minimum required amounts
    if (parseFloat(balanceEthInEth) >= minEth && parseFloat(balancePepeInPepe) >= minPepe && parseFloat(balancePepeCardInPepe) >= minPepeCard) {
      //alert('Congratulations! You qualify for this tier. \n\nETH balance : ' + balanceEthInEth + ' \nPEPE balance : ' + balancePepeInPepe + ' \nPEPECard balance : ' + balancePepeCardInPepe + ' PEPE Card.')
      return {balanceEthInEth, balancePepeInPepe, balancePepeCardInPepe};
    } else {
      console.log('You do not qualify.');
      alert('ETH balance : ' + balanceEthInEth + ' \nPEPE balance : ' + balancePepeInPepe + ' \nPEPECard balance : ' + balancePepeCardInPepe + ' PEPE Card.')
      
      return false;
    }
  } catch (error) {
    console.error('Error checking balance', error);
    return null;
  }
}


async function checkTier1Eligibility() {
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.classList.remove('d-none'); // Show the loading spinner

  document.getElementById('alert-tier1-success').classList.add("d-none");
  const minEth = 0.5; // minimum required ETH balance
  const minPepe = 500000000.0; // minimum required PEPE balance
  const minPepeCard = 50000000.0; // minimum required PEPE Card balance 

  try {
    let qualifies = await checkElgibility(minEth, minPepe, minPepeCard, PEPE_CONTRACT_ADDRESS, PEPECARD_CONTRACT_ADDRESS);
    
    if (qualifies === null) {
      alert('An error occurred. Please try again.');
    } else if (qualifies) {
        showAlert('alert-tier1-success');
        console.log('You qualify!');
    } else {
        alert('Sorry! You do not qualify. Try again later after loading your bags.');
    }  
    
  } catch (error) {
    console.log('Error checking eligibility', error);
  } finally {
    loadingSpinner.classList.add('d-none'); // Hide the loading spinner
  }  
}

async function checkTier2Eligibility() {
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.classList.remove('d-none'); // Show the loading spinner

  document.getElementById('alert-tier2-success').classList.add("d-none");
  const minEth = 0.5; // minimum required ETH balance
  const minPepe = 500000000.0; // minimum required PEPE balance
  const minPepeCard = 50000000.0; // minimum required PEPE Card balance 

  try {
    let qualifies = await checkElgibility(minEth, minPepe, minPepeCard, PEPE_CONTRACT_ADDRESS, PEPECARD_CONTRACT_ADDRESS);
    
    if (qualifies === null) {
      alert('An error occurred. Please try again.');
    } else if (qualifies) {
        showAlert('alert-tier2-success');
        console.log('You qualify for tier 2!');
    } else {
        alert('Sorry! You do not qualify for Tier 2. Try again later after loading your bags.');
    }  
    
  } catch (error) {
    console.log('Error checking eligibility', error);
  } finally {
    loadingSpinner.classList.add('d-none'); // Hide the loading spinner
  }  
}

async function checkTier3Eligibility() {
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.classList.remove('d-none'); // Show the loading spinner

  document.getElementById('alert-tier3-success').classList.add("d-none");
  const minEth = 0.5; // minimum required ETH balance
  const minPepe = 500000000.0; // minimum required PEPE balance
  const minPepeCard = 150000000.0; // minimum required PEPE Card balance 

  try {
    let qualifies = await checkElgibility(minEth, minPepe, minPepeCard, PEPE_CONTRACT_ADDRESS, PEPECARD_CONTRACT_ADDRESS);
    
    if (qualifies === null) {
      alert('An error occurred. Please try again.');
    } else if (qualifies) {
        showAlert('alert-tier3-success');
        console.log('You qualify for tier 3!');
    } else {
        alert('Sorry! You do not qualify. Try again later after loading your bags.');
    }  
    
  } catch (error) {
    console.log('Error checking eligibility', error);
  } finally {
    loadingSpinner.classList.add('d-none'); // Hide the loading spinner
  }  
}


async function buyTier1Card() {
  const loadingSpinner = document.getElementById('card-loading-spinner');
  
  document.getElementById('alert-tier1-success').classList.add("d-none");
  document.getElementById('alert-tier2-success').classList.add("d-none");
  document.getElementById('alert-tier3-success').classList.add("d-none");
  const minEth = 0.5; // minimum required ETH balance
  const minPepe = 500000000.0; // minimum required PEPE balance
  const minPepeCard = 150000000.0; // minimum required PEPE Card balance 

  try {
    let balances = await checkElgibility(minEth, minPepe, minPepeCard, PEPE_CONTRACT_ADDRESS, PEPECARD_CONTRACT_ADDRESS);
    if (balances === null) {
      // An error occurred
      alert('An error occurred. Please try again.');
    } else if (balances) {
        // The user's balances are sufficient
        console.log('Your balances are : ', balances.balanceEthInEth, balances.balancePepeInPepe, balances.balancePepeCardInPepe);
        loadingSpinner.classList.remove('d-none'); // Show the loading spinner
        await depositEth(balances);
      } else {
        // The user's balances are not sufficient
        alert('Sorry! You do not qualify for tier 1.');
    }
    
  } catch (error) {
    console.log('Error making payment', error);
  } finally {
    loadingSpinner.classList.add('d-none'); // Hide the loading spinner
  }  
}

async function buyTier2Card() {
  const loadingSpinner = document.getElementById('card-loading-spinner');
  
  document.getElementById('alert-tier1-success').classList.add("d-none");
  document.getElementById('alert-tier2-success').classList.add("d-none");
  document.getElementById('alert-tier3-success').classList.add("d-none");
  const minEth = 0.5; // minimum required ETH balance
  const minPepe = 500000000.0; // minimum required PEPE balance
  const minPepeCard = 150000000.0; // minimum required PEPE Card balance 

  try {
    let balances = await checkElgibility(minEth, minPepe, minPepeCard, PEPE_CONTRACT_ADDRESS, PEPECARD_CONTRACT_ADDRESS);
    if (balances === null) {
      // An error occurred
      alert('An error occurred. Please try again.');
    } else if (balances) {
        // The user's balances are sufficient
        console.log('Your balances are : ', balances.balanceEthInEth, balances.balancePepeInPepe, balances.balancePepeCardInPepe);
        loadingSpinner.classList.remove('d-none'); // Show the loading spinner

        await depositEth(balances);
      } else {
        // The user's balances are not sufficient
        alert('Sorry! You do not qualify for tier 1.');
    }
    
  } catch (error) {

    console.log('Error making payment', error);
  } finally {
    loadingSpinner.classList.add('d-none'); // Hide the loading spinner
  }  
}


function showAlert(alert_id){  
  document.getElementById("alert-tier1-success").classList.add("d-none");
  document.getElementById("alert-tier2-success").classList.add("d-none");
  document.getElementById("alert-tier3-success").classList.add("d-none");
  document.getElementById("alert-general-failure").classList.add("d-none");

  document.getElementById(alert_id).classList.remove("d-none");
}















/*

async function connectWallet() {
  // Check if window.ethereum exists
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not detected. Please install MetaMask to continue.");
    console.error("MetaMask not detected");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const network = await provider.getNetwork();
    if (network.chainId !== NETWORK_ID) {
      alert("Not connected to mainnet. Please switch to mainnet in MetaMask.");
      await disconnectWallet();
      return;
    } else {
      console.log("Connected to mainnet.");
    }

    // Check for account changes
    window.ethereum.on("Account Changed", (accounts) => {
      checkAccounts();
    });

    // Check for network changes
    window.ethereum.on("chainChanged", async (chainId) => {
      console.log("Network changed:", chainId);
      const newNetwork = await provider.getNetwork();
      if (newNetwork.chainId === NETWORK_ID) {
        console.log("Connected to mainnet");
      } else {
        alert("Not connected to mainnet. Please switch to mainnet in MetaMask.");
        console.error("Not connected to mainnet");
      }
    });

    checkAccounts();
  } catch (error) {
    if (error.code === 4001) {
      // User denied account access
      alert("Please allow access to your MetaMask account to continue.");
      console.error("User denied account access");
    } else {
      // Other errors
      alert("An error occurred. Please try again later.");
      console.error("Error:", error);
    }
  }
}

async function getsUserAddress(){
  const accounts = await provider.listAccounts();
  return accounts[0];
}

async function checkAccounts() {
  try {
    const accounts = await provider.listAccounts();
    console.log("Accounts:", accounts);
  } catch (error) {
    console.error("Error fetching accounts", error);
  }
}

async function checkTokenBalance(tokenAddress, account) {
  try {
    if (!account) {
      const accounts = await provider.listAccounts();
      account = accounts[0];
      //console.log("Account:", account);
    }

    const balance = await provider.getBalance(account);
    if (balance.gt(0)) {
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
      const decimals = await tokenContract.decimals();
      const tokenBalance = await tokenContract.balanceOf(account);
      const formattedBalance = ethers.utils.formatUnits(tokenBalance, decimals);
      //console.log(`Token balance of ${account}: ${formattedBalance}`);
      return parseFloat(formattedBalance);
    } else {
      console.log("Wallet address has zero balance");
      return 0;
    }

  } catch (error) {
    console.error("Error fetching token balance", error);
  }
}

async function connectAndCheckTokenBalance() {
  await connectWallet();
  let account;
  
  const tokenAddress = TOKEN_ADDRESS;
  const accounts = await provider.listAccounts();
  account = accounts[0];

  const balance = await checkTokenBalance(tokenAddress, account);
  updateUI(account, balance);
}

function updateUI(account, balance) {
  const shortAddress = `${account.slice(0, 6)}...${account.slice(-4)}`;
  document.getElementById("connect-btn-section").classList.add("d-none");
  document.getElementById("connected-wallet-section").classList.remove("d-none");
  document.getElementById("connected-wallet-address").innerText = shortAddress;
  
  if(balance == undefined) {
    document.getElementById("pepeCard-balance").innerText = 0 + " pepeCard";
    showAlert("info-alert");
    console.log("Token balance is undefined:", balance);
  } else if (balance < MIN_pepeCard_BALANCE) {
    document.getElementById("pepeCard-balance").innerText = balance.toFixed(0) + " pepeCard";
    showAlert("info-token-balance-low");
    //console.log("Token balance is low:", balance.toFixed(2));
  } else if(balance >= MIN_pepeCard_BALANCE) {
    document.getElementById("pepeCard-balance").innerText = balance.toFixed(2) + " pepeCard";
    showAlert("info-token-balance-good");
    //console.log("Token balance is good:", balance.toFixed(2));
  }
}

async function isMetaMaskConnected() {
  if (typeof window.ethereum !== "undefined") {
    const network = await provider.getNetwork();    
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (network.chainId !== NETWORK_ID && accounts.length > 0) {
      let balance = await checkTokenBalance(TOKEN_ADDRESS, accounts[0]);
      updateUI(accounts[0], balance);
      console.log("Account addres and balance:", accounts[0], balance);
      return (accounts[0], balance);
    }
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  } else {
    showAlert("alert-info");
    console.log("MetaMask not detected");
  }
}

async function getUserAddress() {
  if (typeof window.ethereum !== "undefined") {
    const network = await provider.getNetwork();    
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (network.chainId === NETWORK_ID && accounts.length > 0) {
      const tokenAddress = TOKEN_ADDRESS;
      let balance = await checkTokenBalance(tokenAddress, accounts[0]); 
      updateUI(accounts[0], balance);
      const userAddress = accounts[0];
      return [userAddress, balance];
    } else {
      //showAlert("alert-info");
      console.log("Checking...");
    }
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  } else {
    showAlert("alert-info");
    console.log("MetaMask not detected");
  }
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    document.getElementById("connect-btn-section").classList.remove("d-none");
    document.getElementById("connected-wallet-section").classList.add("d-none");
    document.querySelector(".transfer-funds").disabled = true;
    showAlert("info-alert");
  } else {
    const account = accounts[0];
    const tokenAddress = TOKEN_ADDRESS;
    checkTokenBalance(tokenAddress, account).then((balance) => {
      updateUI(account, balance);
    });
  }
}


// Called n page load
window.addEventListener("DOMContentLoaded", isMetaMaskConnected);


*/