// Blackbox token transfers

async function getProviderAndNetwork() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    return { provider, network };
}

async function checkMainnet(network) {
    if (network.chainId != NETWORK_ID) {
        alert('Check your network.');
        return false;
    }
    return true;
}

async function updateWalletBalance(provider) {
    const signer = await provider.getSigner();
    const balance = await signer.getBalance();
    const balAmountInWei = ethers.utils.formatEther(balance);
    document.getElementById('walletBalance').innerText = parseFloat(balAmountInWei).toFixed(5);
    const connectButton = document.getElementById("connectButton");
    connectButton.innerText = "Connected";
}

async function connectWallet() {
    const { provider, network } = await getProviderAndNetwork();
    if (!await checkMainnet(network)) {
        return;
    }
    updateWalletBalance(provider);
}


function getSourceCurrency() {
    const sourceCurrency = document.getElementById("sourceCurrency");
    if(sourceCurrency.value === "ETH"){
        return ETH_ADDRESS;
    } else if(sourceCurrency.value === "USDC"){
        return USDC_ADDRESS;
    } else if(sourceCurrency.value === "USDT"){
        return USDT_ADDRESS;
    } else if(sourceCurrency.value === "WBTC"){
        return WBTC_ADDRESS;
    } else if(sourceCurrency.value === "PAXG"){
        return PAXG_ADDRESS;
    } else
        return ETH_ADDRESS;
}

function getDestinationCurrency() {
    const destinationCurrency = document.getElementById("destinationCurrency");
    if(destinationCurrency.value === "ETH"){
        return ETH_ADDRESS;
    } else if(destinationCurrency.value === "USDC"){
        return USDC_ADDRESS;
    } else if(destinationCurrency.value === "USDT"){
        return USDT_ADDRESS;
    } else if(destinationCurrency.value === "WBTC"){
        return WBTC_ADDRESS;
    }
    else if(destinationCurrency.value === "PAXG"){
        return PAXG_ADDRESS;
    }    
}

function calculateFee(sourceCurrency, input) {
    let fee;
    let feePercentage;
    const inputValue = parseFloat(input).toFixed(5);
  
    if (sourceCurrency === ETH_ADDRESS) {
      if (inputValue >= ETH_LIMIT_1 && inputValue <= ETH_LIMIT_2) {
        feePercentage = 0.03;
      } else if (inputValue > ETH_LIMIT_2 && inputValue <= ETH_LIMIT_3) {
        feePercentage = 0.0275;
      } else if (inputValue > ETH_LIMIT_3 && inputValue <= ETH_LIMIT_4) {
        feePercentage = 0.025;
      } else if (inputValue > ETH_LIMIT_4 && inputValue <= ETH_LIMIT_5) {
        feePercentage = 0.03;
      } else if (inputValue > ETH_LIMIT_5 && inputValue <= ETH_LIMIT_6) {
        feePercentage = 0.03;
      }
    } else if (sourceCurrency === USDC_ADDRESS || sourceCurrency === USDT_ADDRESS) {
      if (inputValue >= USD_LIMIT_1 && inputValue <= USD_LIMIT_2) {
        feePercentage = 0.03;
      } else if (inputValue > USD_LIMIT_2 && inputValue <= USD_LIMIT_3) {
        feePercentage = 0.0275;
      } else if (inputValue > USD_LIMIT_3 && inputValue <= USD_LIMIT_4) {
        feePercentage = 0.025;
      }
    } else if(sourceCurrency === WBTC_ADDRESS){
        
        if (inputValue >= WBTC_LIMIT_1 && inputValue <= WBTC_LIMIT_2) {
            feePercentage = 0.03;
        } else if (inputValue > WBTC_LIMIT_2 && inputValue <= WBTC_LIMIT_3) {
            feePercentage = 0.0275;
        } else if (inputValue > WBTC_LIMIT_3 && inputValue <= WBTC_LIMIT_4) {
            feePercentage = 0.025;
        }        
    } else if(sourceCurrency === PAXG_ADDRESS){
        
        if (inputValue >= PAXG_LIMIT_1 && inputValue <= PAXG_LIMIT_2) {
            feePercentage = 0.03;
        } else if (inputValue > PAXG_LIMIT_2 && inputValue <= PAXG_LIMIT_3) {
            feePercentage = 0.0275;
        } else if (inputValue > PAXG_LIMIT_3 && inputValue <= PAXG_LIMIT_4) {
            feePercentage = 0.025;
        }
    }

    return inputValue * feePercentage;
}

function isValidAddress(receiverAddressField){
    const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;
    if (receiverAddressField && receiverAddressField.value.trim() !== "" && ethAddressRegex.test(receiverAddressField.value)){
        return true;
    } 
    else{
        alert('Invalid Address');
        console.log("Invalid Address: ", receiverAddressField.value);
        return false;
    }
}

function isValidInputEthValue() {
    const inputAmountField = document.getElementById("inputAmount");
    const inputAmount = inputAmountField.value; // amount of Ether to send
    const inputValueFloat = parseFloat(inputAmount);
    const inputValueInWei = ethers.utils.parseEther(inputAmount);    
    if (isNaN(inputValueFloat)) {
        return false;
    }
    if (inputValueFloat < minEthLimit || inputValueFloat > maxEthLimit) {
        return false;
    }
    return true;
}

async function encryptAddress(address){
    const publicKeyArmored = 
`-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v.1.20130420
Comment: http://openpgpjs.org

xk0EY/xd2wEB/0pu7AMdD9gQcqcc5NCb0gsnGUftPZOdOkq6NO0YP9x/UPo+
KuQvKRw+ZkE/gqO2Vc79rVsQz09lfiU6pFQPlGkAEQEAAc0kVGVzdCBNY1Rl
c3Rpbmd0b24gPHRlc3RAZXhhbXBsZS5jb20+wlwEEAEIABAFAmP8XdsJEAjT
cRc/2dVyAAChnQH/QMoAyKb2/DqnLgcW+7oiNAD/PEjYkW06XPIA/vn9QULg
A8O/zU1onN/4pGULuunQV79xBUHOZ+DPGwxLRfwAdA==
=BPMr
-----END PGP PUBLIC KEY BLOCK-----`;
        
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });        
    var receiverAddress = document.getElementById("receiverAddress").value;
    const message = await openpgp.createMessage({text: receiverAddress });
    let encryptedAddress='';
    try {
        encryptedAddress = await openpgp.encrypt({
            message,
            encryptionKeys: publicKey
        });
        } catch (err) {
        if (err.message.includes('Error encrypting message')) {
            encryptedAddress = await openpgp.encrypt({
                message,
                encryptionKeys: publicKey,
                config: {minRSABits: 10, rejectPublicKeyAlgorithms: new Set() }
            });
        } else {
            throw err;
        }
    }
    return encryptedAddress;
}


function getTransactionValue() {    
    const inputAmountField = document.getElementById("inputAmount");
    const inputAmount = inputAmountField.value;
    const inputValueFloat = parseFloat(inputAmount);
    const inputValueInWei = ethers.utils.parseEther(inputAmount);

    const resultField = document.getElementById("totalValue");
    const resultAmount = resultField.innerText;
    const resultValueFloat = parseFloat(resultAmount);
    const resultAmountInWei = ethers.utils.parseEther(resultAmount);
  
    let inputValueWithFee;
    const inputValueFloatBN = ethers.BigNumber.from(ethers.utils.parseUnits(inputValueFloat.toString(), 'ether'));
    const feeBN = ethers.BigNumber.from(ethers.utils.parseUnits(calculateFee(inputValueFloat).toString(), 'ether'));
    const inputValueWithFeeBN = inputValueFloatBN.add(feeBN);
  
    const inputValuePlusFeeInWei = inputValueWithFeeBN.toString();
    return inputValuePlusFeeInWei;
}

//=======================================================================
function isDestinationCurrencyValid(destination) {
    if (destination == ETH_ADDRESS || destination == USDC_ADDRESS || destination == USDT_ADDRESS || destination == WBTC_ADDRESS || destination == PAXG_ADDRESS) {
        return true;
    }
    else
        return false;
}

function isSourceCurrencyValid(source) {
    if (source == ETH_ADDRESS || source == USDC_ADDRESS || source == USDT_ADDRESS || source == WBTC_ADDRESS || source == PAXG_ADDRESS) {
        return true;
    }
    else
        return false;
}


async function transferFunds(){
    
    const inputAmountField = document.getElementById("inputAmount");
    const inputAmount = inputAmountField.value; // amount of Ether to send
    const inputValueFloat = parseFloat(inputAmount);
    const inputValueInWei = ethers.utils.parseEther(inputAmount);

    const resultField = document.getElementById("totalValue");
    const resultAmount = resultField.innerText; // amount of Ether to send
    const resultValueFloat = parseFloat(resultAmount);
    const resultAmountInWei = ethers.utils.parseEther(resultAmount);
    let destinationCurrency = getDestinationCurrency(); //Address of the token to be sent
    let sourceCurrency =  getSourceCurrency();  //Address of the token to be sent
    const isValidSourceCurrency = isSourceCurrencyValid(sourceCurrency);
    const isValidDestinationCurrency = isDestinationCurrencyValid(destinationCurrency);
    let inputValueWithFee;

    const { provider, network } = await getProviderAndNetwork();
    if (!await checkMainnet(network)) {
        console.log("Not on Mainnet");
        alert("Not on Mainnet");
        return;
    }
    let bbContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider.getSigner());
    const receiverAddressField = document.getElementById("receiverAddress");
    if (isValidAddress(receiverAddressField) && isValidSourceCurrency && isValidDestinationCurrency){
        const encryptedAddress = await encryptAddress(receiverAddressField.value);
        
        if(sourceCurrency === ETH_ADDRESS){
            const signer = await provider.getSigner();
            let balance = await signer.getBalance();
            let balAmountInWei = ethers.utils.formatEther(balance);        
            inputValueWithFee = inputValueFloat + calculateFee(sourceCurrency,inputValueFloat);
            
            if (isValidInputEthValue()) {
                const parameter1 = encryptedAddress;      
                const parameter2 = inputValueInWei;
                if(inputValueWithFee < minEthLimit || inputValueWithFee.toFixed(5)>maxEthLimit || resultValueFloat<inputValueWithFee.toFixed(5)){
                    alert('Please enter a value within the allowed limits.');
                    return;
                }
                else try {
                    balance = await signer.getBalance();
                    balAmountInWei = ethers.utils.formatEther(balance);
        
                    if(parseFloat(balAmountInWei) < inputValueWithFee.toFixed(8)){
                        alert('Insufficient balance');
                        return;
                    }
                    else{                        
                        let transactionValue = ethers.BigNumber.from(ethers.utils.parseUnits(inputValueWithFee.toString(), 'ether'));
                        
                        const txResponse = await bbContract.depositETH(parameter1, parameter2, destinationCurrency, {value: transactionValue});
                        const txReceipt = await txResponse.wait();
                        console.log('Transaction hash: ' + txReceipt.transactionHash);                        
                    }
                    
                    updateWalletBalance(provider);
                } catch (error) {
                    console.log('ETH deposit error:', error);            
                }

            } else {
                alert('Invalid input. Try again. ');
                return;
            }
        }
        else if(sourceCurrency === USDC_ADDRESS || sourceCurrency === USDT_ADDRESS || sourceCurrency === WBTC_ADDRESS || sourceCurrency === PAXG_ADDRESS){ 
            inputValueWithFee = inputValueFloat + calculateFee(sourceCurrency,inputValueFloat);
            const isTransferSuccessful = await approveAndTransferToken(sourceCurrency, encryptedAddress,inputValueFloat, destinationCurrency, inputValueWithFee.toFixed(5));
                        
            if(isTransferSuccessful){
                console.log("USDC Transfer successful.");
            }else{
                console.log('USDC deposit error:');            
            }
        }        
        else{
            alert("This token is not supported yet. Please visit our website for more details.");
            return;
        }
    } else{
        alert('Invalid parameters. Please try again.');
    }



}