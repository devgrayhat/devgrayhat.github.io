const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// Initialize provider and signer variables
let provider;
let signer;

async function connectWallet() {
  // Check if window.ethereum exists
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not detected. Please install MetaMask to continue.");
    console.error("MetaMask not detected");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Request access to user's accounts
    await window.ethereum.request({ method: "eth_requestAccounts" });
    
    console.log("MetaMask connected");

    // Check if connected to the mainnet
    const network = await provider.getNetwork();
    if (network.chainId !== NETWORK_ID) {
      alert("Not connected to mainnet. Please switch to mainnet in MetaMask.");
      console.error("Not connected Networ ID :", network.chainId);
      await disconnectWallet();
      return;
    } else {      
      console.log("Connected to mainnet");
    }

    // Check for account changes
    window.ethereum.on("accountsChanged", (accounts) => {
      console.log("Accounts changed:", accounts);
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
      console.log("Account:", account);
    }

    const balance = await provider.getBalance(account);
    if (balance.gt(0)) {
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
      const decimals = await tokenContract.decimals();
      const tokenBalance = await tokenContract.balanceOf(account);
      const formattedBalance = ethers.utils.formatUnits(tokenBalance, decimals);
      console.log(`Token balance of ${account}: ${formattedBalance}`);
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
  console.log("Connecting wallet...");
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
    document.getElementById("bbtt-balance").innerText = 0 + " BBTT";
    showAlert("info-alert");
    console.log("Token balance is undefined:", balance);
  } else if (balance < MIN_BBTT_BALANCE) {
    document.getElementById("bbtt-balance").innerText = balance.toFixed(0) + " BBTT";
    showAlert("info-token-balance-low");
    console.log("Token balance is low:", balance.toFixed(2));
  } else if(balance >= MIN_BBTT_BALANCE) {
    document.getElementById("bbtt-balance").innerText = balance.toFixed(2) + " BBTT";
    showAlert("info-token-balance-good");
    console.log("Token balance is good:", balance.toFixed(2));
  }
}

async function isMetaMaskConnected() {
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();    
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (network.chainId !== NETWORK_ID && accounts.length > 0) {
      const tokenAddress = TOKEN_ADDRESS;
      let balance = await checkTokenBalance(tokenAddress, accounts[0]);
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
  console.log("Checking started...");
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
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
const connectButton = document.getElementById("btn-connect-wallet");
connectButton.addEventListener("click", connectAndCheckTokenBalance);