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
}

async function connectWallet() {
    const { provider, network } = await getProviderAndNetwork();
    if (!await checkMainnet(network)) {
        return;
    }
    updateWalletBalance(provider);
}

function calculateFee(sourceCurrency, input) {
    let fee;
    let feePercentage;
    const inputValue = parseFloat(input).toFixed(5);
  
    if (sourceCurrency === "ETH") {
      if (inputValue >= ETH_LIMIT_1 && inputValue <= ETH_LIMIT_2) {
        feePercentage = 0.03;
      } else if (inputValue > ETH_LIMIT_2 && inputValue <= ETH_LIMIT_3) {
        feePercentage = 0.0275;
      } else if (inputValue > ETH_LIMIT_3 && inputValue <= ETH_LIMIT_4) {
        feePercentage = 0.025;
      }
    } else if (sourceCurrency === "USDC" || sourceCurrency === "USDT") {
      if (inputValue >= USD_LIMIT_1 && inputValue <= USD_LIMIT_2) {
        feePercentage = 0.03;
      } else if (inputValue > USD_LIMIT_2 && inputValue <= USD_LIMIT_3) {
        feePercentage = 0.0275;
      } else if (inputValue > USD_LIMIT_3 && inputValue <= USD_LIMIT_4) {
        feePercentage = 0.025;
      }
    } else if(sourceCurrency === "WBTC"){
        
        if (inputValue >= WBTC_LIMIT_1 && inputValue <= WBTC_LIMIT_2) {
            feePercentage = 0.03;
        } else if (inputValue > WBTC_LIMIT_2 && inputValue <= WBTC_LIMIT_3) {
            feePercentage = 0.0275;
        } else if (inputValue > WBTC_LIMIT_3 && inputValue <= WBTC_LIMIT_4) {
            feePercentage = 0.025;
        }        
    } else if(sourceCurrency === "PAXG"){
        
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

function getSourceCurrency() {
    const sourceCurrency = document.getElementById("sourceCurrency");
    return sourceCurrency.value;
}

function getDestinationCurrency() {
    const destinationCurrency = document.getElementById("destinationCurrency");
    return destinationCurrency.value;
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
  
    // Convert inputValueWithFee to Wei
    const inputValuePlusFeeInWei = inputValueWithFeeBN.toString();
    return inputValuePlusFeeInWei;
}

//=======================================================================

async function transferFunds(){
    
    const inputAmountField = document.getElementById("inputAmount");
    const inputAmount = inputAmountField.value; // amount of Ether to send
    const inputValueFloat = parseFloat(inputAmount);
    const inputValueInWei = ethers.utils.parseEther(inputAmount);

    const resultField = document.getElementById("totalValue");
    const resultAmount = resultField.innerText; // amount of Ether to send
    const resultValueFloat = parseFloat(resultAmount);
    const resultAmountInWei = ethers.utils.parseEther(resultAmount);
    
    let inputValueWithFee;

    const { provider, network } = await getProviderAndNetwork();
    if (!await checkMainnet(network)) {
        console.log("Not on Mainnet");
        alert("Not on Mainnet");
        return;
    }
    let bbContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider.getSigner());
    const receiverAddressField = document.getElementById("receiverAddress");
    if (isValidAddress(receiverAddressField)){
        // Encrypt the message
        const encryptedAddress = await encryptAddress(receiverAddressField.value);
        let dstCurrency;
        let sourceCurrency =  getSourceCurrency();
        let destinationCurrency = getDestinationCurrency();

        if(sourceCurrency === "ETH" && destinationCurrency === "ETH"){
            console.log("ETH to ETH Transfer Request.");

            const signer = await provider.getSigner();
            let balance = await signer.getBalance();
            let balAmountInWei = ethers.utils.formatEther(balance);        
            inputValueWithFee = inputValueFloat + calculateFee(sourceCurrency,inputValueFloat);
            
            if (isValidInputEthValue()) {
                dstCurrency = ethAddress;

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
                        
                        const txResponse = await bbContract.depositETH(parameter1, parameter2, dstCurrency, {value: transactionValue});
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
        else if(sourceCurrency === "USDC" && destinationCurrency === "USDC"){            
            console.log("USDC to USDC Transfer Request.");

            inputValueWithFee = inputValueFloat + calculateFee(sourceCurrency,inputValueFloat);
            dstCurrency = usdcAddress;

            const isTransferSuccessful = await approveAndTransferToken(usdcAddress, encryptedAddress,inputValueFloat, dstCurrency, inputValueWithFee.toFixed(5));
                        
            if(isTransferSuccessful){
                console.log("USDC Transfer successful.");
            }else{
                console.log('USDC deposit error:');            
            }
        }
        else if(sourceCurrency === "USDT" && destinationCurrency === "USDT"){            
            console.log("USDT to USDT Transfer Request.");

            inputValueWithFee = inputValueFloat + calculateFee(sourceCurrency,inputValueFloat);
            dstCurrency = usdtAddress;

            const isTransferSuccessful = await approveAndTransferToken(usdtAddress, encryptedAddress,inputValueFloat, dstCurrency, inputValueWithFee.toFixed(5));
            if(isTransferSuccessful){
                console.log("USDT Transfer successful.");
            }else{
                console.log('USDT Transfer failed.');
            }
        }
        else if(sourceCurrency ==="WBTC" && destinationCurrency === "WBTC"){
            console.log("WBTC to WBTC Transfer Request.");
            inputValueWithFee = inputValueFloat + calculateFee(sourceCurrency, inputValueFloat);
            dstCurrency = wbtcAddress;

            const isTransferSuccessful = await approveAndTransferToken(wbtcAddress, encryptedAddress, inputValueFloat, dstCurrency, inputValueWithFee.toFixed(5));
            if(isTransferSuccessful){
                console.log("WBTC Transfer successful.");
            }else{
                console.log('WBTC Transfer failed.');           
            }
        }
        else if(sourceCurrency === "PAXG" && destinationCurrency === "PAXG"){
            console.log("PAXG to PAXG Transfer Request.");

            inputValueWithFee = inputValueFloat + calculateFee(sourceCurrency, inputValueFloat);
            dstCurrency = paxgAddress;

            const isTransferSuccessful = await approveAndTransferToken(paxgAddress, encryptedAddress,inputValueFloat, dstCurrency, inputValueWithFee.toFixed(5));
            if(isTransferSuccessful){
                console.log("PAXG Transfer successful.");
            }else{
                console.log('PAXG Transfer failed.');           
            }
        }
        else{
            alert("This currency pair is not supported yet. Please visit our website for more details.");
            return;
        }
        

    }
    else{
        alert('Invalid address. Try again. ');
    }



}