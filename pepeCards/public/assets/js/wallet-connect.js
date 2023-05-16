

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
      return {address, balanceEthInEth, balancePepeInPepe, balancePepeCardInPepe};
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
  //showAlert("none");
  const minEth = 0.5; // minimum required ETH balance
  const minPepe = MIN_PEPE_L1; // minimum required PEPE balance
  const minPepeCard = MIN_PEPE_CARD_L1; // minimum required PEPE Card balance 

  try {
    let response = await checkElgibility(minEth, minPepe, minPepeCard, PEPE_CONTRACT_ADDRESS, PEPECARD_CONTRACT_ADDRESS);
    
    if (response === null) {
      showAlert('alert-general-failure');
    } else if (response) {
        showAlert('alert-tier1-success');
        console.log('You qualify for tier 1!');
        return response;
    } else {
      showAlert('alert-tier1-failure');
    }  
    
  } catch (error) {
    showAlert('alert-general-failure');
    console.log('Error checking eligibility', error);
  } finally {
    loadingSpinner.classList.add('d-none'); // Hide the loading spinner
  }  
}

async function checkTier2Eligibility() {
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.classList.remove('d-none'); // Show the loading spinner

  document.getElementById('alert-tier2-success').classList.add("d-none");
  const minEth = 1; // minimum required ETH balance
  const minPepe = 500000000.0; // minimum required PEPE balance
  const minPepeCard = 100000000.0; // minimum required PEPE Card balance 

  try {
    let response = await checkElgibility(minEth, minPepe, minPepeCard, PEPE_CONTRACT_ADDRESS, PEPECARD_CONTRACT_ADDRESS);
    
    if (response === null) {
      alert('An error occurred. Please try again.');
    } else if (response) {
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
  const minEth = 1; // minimum required ETH balance
  const minPepe = 500000000.0; // minimum required PEPE balance
  const minPepeCard = 150000000.0; // minimum required PEPE Card balance 

  try {
    let response = await checkElgibility(minEth, minPepe, minPepeCard, PEPE_CONTRACT_ADDRESS, PEPECARD_CONTRACT_ADDRESS);
    
    if (response === null) {
      alert('An error occurred. Please try again.');
    } else if (response) { 
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
  const minPepe = MIN_PEPE_L1; // minimum required PEPE balance
  const minPepeCard = MIN_PEPE_CARD_L1; // minimum required PEPE Card balance 

  try {
    let balances = await checkElgibility(minEth, minPepe, minPepeCard, PEPE_CONTRACT_ADDRESS, PEPECARD_CONTRACT_ADDRESS);
    if (balances === null) {
      // An error occurred
      showAlert('alert-general-failure');
    } else if (balances) {
        // The user's balances are sufficient
        console.log('Your balances are : ', balances.address, balances.balanceEthInEth, balances.balancePepeInPepe, balances.balancePepeCardInPepe);
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

/*
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
*/

function showAlert(alert_id){  
  document.getElementById("alert-tier1-success").classList.add("d-none");
  document.getElementById("alert-tier2-success").classList.add("d-none");
  document.getElementById("alert-tier3-success").classList.add("d-none");
  document.getElementById("alert-tier1-failure").classList.add("d-none");
  document.getElementById("alert-general-failure").classList.add("d-none");

  document.getElementById(alert_id).classList.remove("d-none");
}