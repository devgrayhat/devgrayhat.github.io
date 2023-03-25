// Change contract address
// Change usdcAddress
// Change network to Mainnet in CheckMAinnet function
// Change fee percentage in calculateFee function
// Change Abi if smart contract is redeployed


const minEthLimit = 0.005;         // Change to 0.5 for mainnet
const maxEthLimit = 0.05125;       // Change to 5.125 for mainnet

const minUsdLimit = 10;            // Change to 500 for mainnet
const maxUsdLimit = 500;           // Change to 512500 for mainnet


async function getProviderAndNetwork() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    return { provider, network };
}

async function checkMainnet(network) {
    if (network.chainId != 5) { // Chain ID : 5 for Goerli, change to 1 for mainnet
        alert('Connect to the Goerli Testnet.');
        //alert('Connect to the Mainnet.'); // Chain ID : 1
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

function calculateFee(token, input) {
    let feePercentage = 1;
    /*
    if (input >= 0.5 && input <= 1) {
        feePercentage = 0.03;
    } else if (input > 1 && input <= 3) {
        feePercentage = 0.0275;
    } else if (input > 3 && input <= 5) {
        feePercentage = 0.025;
    }
    */
    if(token=="ETH"){
        if (input >= 0.005 && input <= 0.01) {
            feePercentage = 0.03;
        } else if (input > 0.01 && input <= 0.03) {
            feePercentage = 0.0275;
        } else if (input > 0.03 && input <= 0.05) {
            feePercentage = 0.025;
        }
    }
    else if(token=="USDC" || token=="USDT"){
        if (input >= 10 && input <= 50) {
            feePercentage = 0.03;
        } else if (input > 50 && input <= 100) {
            feePercentage = 0.0275;
        } else if (input > 100 && input <= 500) {
            feePercentage = 0.025;
        }
    }
    else if(token=="WBTC"){
        if (input >= 0.0005 && input <= 0.001) {
            feePercentage = 0.03;
        } else if (input > 0.001 && input <= 0.003) {
            feePercentage = 0.0275;
        } else if (input > 0.003 && input <= 0.005) {
            feePercentage = 0.025;
        }
    }
    else if(token=="PAXG"){
        if (input >= 0.0005 && input <= 0.001) {
            feePercentage = 0.03;
        } else if (input > 0.001 && input <= 0.003) {
            feePercentage = 0.0275;
        } else if (input > 0.003 && input <= 0.005) {
            feePercentage = 0.025;
        }
    }

    return input * feePercentage;
}

function isValidAddress(){
    const receiverAddressField = document.getElementById("receiverAddress");

    const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;
    if (receiverAddressField && receiverAddressField.value.trim() !== "" && ethAddressRegex.test(receiverAddressField.value)){
        console.log("Valid Address: ", receiverAddressField.value);
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

    /*
    await openpgp.readMessage({
        armoredMessage: encryptedAddress // parse armored message
    });
    */
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
    const inputAmount = inputAmountField.value; // amount of Ether to send
    const inputValueFloat = parseFloat(inputAmount);
    const inputValueInWei = ethers.utils.parseEther(inputAmount);

    const resultField = document.getElementById("totalValue");
    const resultAmount = resultField.innerText; // amount of Ether to send
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
    
    const receiverAddressField = document.getElementById("receiverAddress");
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
        return;
    }
    let bbContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider.getSigner());

    if (isValidAddress()){
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
                dstCurrency = ethAddress;   // Token address for ETH

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
                        document.getElementById("transferButton").innerText = "Processing transaction...";
                        const txReceipt = await txResponse.wait();
                        document.getElementById("transferButton").innerText = "Transfer again";
                        console.log('Transaction hash: ' + txReceipt.transactionHash);                        
                    }
                                     
                    alert('Successfully transferred to BlackBox. \nYou will received your funds within 5 minutes in your destination wallet.');
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
            console.log("Input value Float: " + inputValueFloat);
            console.log("Input value with Fee: " + inputValueWithFee);
            dstCurrency = usdcAddress;   // Token address for USDC

            const isTransferSuccessful = await approveAndTransferToken(usdcAddress, encryptedAddress,inputValueFloat, dstCurrency, inputValueWithFee);
                        
            if(isTransferSuccessful){
                console.log("USDC Transfer successful.");
            }else{
                console.log('USDC deposit error:', error);            
            }
        }
        else if(sourceCurrency === "USDT" && destinationCurrency === "USDT"){            
            console.log("USDT to USDT Transfer Request.");

            inputValueWithFee = inputValueFloat + calculateFee(sourceCurrency,inputValueFloat);
            console.log("Input value Float: " + inputValueFloat);
            console.log("Input value with Fee: " + inputValueWithFee);
            dstCurrency = usdcAddress;   // Token address for USDC

            const isTransferSuccessful = await approveAndTransferToken(usdtAddress, encryptedAddress,inputValueFloat, dstCurrency, inputValueWithFee);
            if(isTransferSuccessful){
                console.log("USDT Transfer successful.");
            }else{
                console.log('USDT deposit error:', error);            
            }
        }
        else if(sourceCurrency ==="WBTC" && destinationCurrency === "WBTC"){
            console.log("WBTC to WBTC Transfer Request.");

            inputValueWithFee = inputValueFloat + calculateFee(sourceCurrency, inputValueFloat);
            console.log("Input value Float: " + inputValueFloat);
            console.log("Input value with Fee: " + inputValueWithFee);
            dstCurrency = wbtcAddress;   // Token address for USDC

            const isTransferSuccessful = await approveAndTransferToken(wbtcAddress, encryptedAddress, inputValueFloat, dstCurrency, inputValueWithFee);
            if(isTransferSuccessful){
                console.log("WBTC Transfer successful.");
            }else{
                console.log('WBTC deposit error:', error);            
            }
        }
        else if(sourceCurrency === "PAXG" && destinationCurrency === "PAXG"){
            console.log("PAXG to PAXG Transfer Request.");

            inputValueWithFee = inputValueFloat + calculateFee(sourceCurrency, inputValueFloat);
            console.log("Input value Float: " + inputValueFloat);
            console.log("Input value with Fee: " + inputValueWithFee);
            dstCurrency = paxgAddress;   // Token address for USDC

            const isTransferSuccessful = await approveAndTransferToken(paxgAddress, encryptedAddress,inputValueFloat, dstCurrency, inputValueWithFee);
            if(isTransferSuccessful){
                console.log("PAXG Transfer successful.");
            }else{
                console.log('PAXG deposit error:', error);            
            }
        }
        else{
            alert("This currency pair is not supported yet. Please visit our website for more details.");
            return;
        }
        

    }
    else{
        //alert('Invalid address. Try again. ');
    }



}