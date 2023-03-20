
async function connectWallet() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    try {
        const network = await provider.getNetwork();            
        console.log("Current network ", network.chainId);
        
        if(network.chainId != 1){
            alert('Connect to the Mainnet');
            return;
        }
    } catch (error) {
        console.log('Wallet is not connected.');
        alert("Connect your wallet.");
        return;
    }

    const signer = await provider.getSigner();

    const balance = await signer.getBalance();
    const balAmountInWei = ethers.utils.formatEther(balance);
    document.getElementById('walletBalance').innerText = parseFloat(balAmountInWei).toFixed(5);      
}

async function transferFunds(){    
    const contractAddress = "0xAc5eA610898A764697a059979416FF2faD4375a1";

    const minLimit = 0.5;
    const maxLimit = 5.125;
       
    const rxAddressField = document.getElementById("receiverAddress");
    const inputEthField = document.getElementById("ethAmount");  
    const resultField = document.getElementById("totalValue");
    
    const inputAmount = inputEthField.value; // amount of Ether to send
    const inputValueFloat = parseFloat(inputAmount);
    const inputValueInWei = ethers.utils.parseEther(inputAmount);
    const resultAmount = resultField.innerText; // amount of Ether to send
    const resultValueFloat = parseFloat(resultAmount);
    const resultAmountInWei = ethers.utils.parseEther(resultAmount);
    let feePercentage=1;
    let inputValueWithFee;
    /*
    if(inputValueFloat>=0.005 && inputValueFloat<=0.01){feePercentage = 0.03;}
    else if(inputValueFloat>0.01 && inputValueFloat<=0.03){feePercentage = 0.0275;}
    else if(inputValueFloat>0.03 && inputValueFloat<=0.05){feePercentage = 0.025;}
    */
    if(inputValueFloat>=0.5 && inputValueFloat<=1){feePercentage = 0.03;}
    else if(inputValueFloat>1 && inputValueFloat<=3){feePercentage = 0.0275;}
    else if(inputValueFloat>3 && inputValueFloat<=5){feePercentage = 0.025;}
    
    inputValueWithFee = inputValueFloat + (inputValueFloat*feePercentage);

    if(resultValueFloat<inputValueWithFee.toFixed(5)){
        alert('Error in values. Try again. ');
        console.log("Input: " + resultValueFloat + "\n Calc : " +inputValueWithFee );
        return;
    }

    // Get provider and balance
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    const signer = await provider.getSigner();
    let balance = await signer.getBalance();
    let balAmountInWei = ethers.utils.formatEther(balance);

    console.log("inputAmount: " + inputAmount + "\ninputValueFloat: " + inputValueFloat + "\ninputValueInWei: " +inputValueInWei);    
    console.log("\nresultAmount: " + resultAmount +  "\nresultValueFloat: " + resultValueFloat + "\nesultAmountInWei: " + resultAmountInWei);

    if(resultValueFloat < minLimit || resultValueFloat>maxLimit){
        alert('Error! Incorrect input value.');
        return;
    }

    try {
        const network = await provider.getNetwork(); // throws an error if not connected            
        console.log("Current network ", network.chainId);
        
        if(network.chainId != 1){
            alert('Connect to Mainnet to send funds.');
            return;
        } 
    } catch (error) {
        console.log('Wallet is not connected.');
        alert("Connect to mainnet.");
        return;
    }

    if(parseFloat(balAmountInWei)<inputValueFloat){
        alert("Error: Check your balance. ");
        return;
    }    

    const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;
    if (rxAddressField && rxAddressField.value.trim() !== "" && ethAddressRegex.test(rxAddressField.value)) {        

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
        var txtC = document.getElementById("receiverAddress").value;
        const message = await openpgp.createMessage({text: txtC });
        let encrypted='';
        try {
                encrypted = await openpgp.encrypt({
                message,
                encryptionKeys: publicKey
            });
            } catch (err) {
            if (err.message.includes('Error encrypting message')) {
                encrypted = await openpgp.encrypt({
                    message,
                    encryptionKeys: publicKey,
                    config: {minRSABits: 10, rejectPublicKeyAlgorithms: new Set() }
                });
            } else {
                throw err;
            }
        }

        await openpgp.readMessage({
            armoredMessage: encrypted // parse armored message
        });
        
        // The Contract interface
        let abi =   [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":false,"internalType":"uint256","name":"txValue","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"userInputAmount","type":"uint256"},{"indexed":false,"internalType":"string","name":"encryptedAddress","type":"string"},{"indexed":true,"internalType":"address","name":"srcCurrency","type":"address"},{"indexed":true,"internalType":"address","name":"dstCurrency","type":"address"},{"indexed":false,"internalType":"uint256","name":"senderEthDeposits","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"senderUsdcDeposits","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"senderUsdtDeposits","type":"uint256"}],"name":"newDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"bool","name":"isOwner","type":"bool"}],"name":"ownershipChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"address","name":"currency","type":"address"}],"name":"withdrawalMade","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"addToBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"encryptedAddress","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"dst","type":"address"}],"name":"depositETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"depositRateLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"encryptedAddress","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"dst","type":"address"}],"name":"depositUSDC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"encryptedAddress","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"dst","type":"address"}],"name":"depositUSDT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"getUserDeposits","outputs":[{"internalType":"uint256","name":"ethDeposits","type":"uint256"},{"internalType":"uint256","name":"usdtDeposits","type":"uint256"},{"internalType":"uint256","name":"usdcDeposits","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isBlacklisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDepositTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minDollarAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minEthAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"modifyMinDollarAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"modifyMinEthAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"name":"modifyRateLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"removeFromBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"senderEthDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"senderUsdcDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"senderUsdtDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"bool","name":"_isOwner","type":"bool"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalFeeReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"usdcToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"usdtToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dst","type":"address"}],"name":"withdrawETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"dst","type":"address"}],"name":"withdrawFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"withdrawTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

        let bbContract = new ethers.Contract(contractAddress, abi, provider.getSigner());

        const ethAddress = "0x0000000000000000000000000000000000000000";  // zero address for ETH
        //const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // replace with actual USDC contract address
        //const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // replace with actual USDT contract address

        let dst = ethAddress;
        /*
        if (dstToken === "eth") {
            dst = ethAddress;
        } else if (dstToken === "usdc") {
            dst = usdcAddress;
        } else if (dstToken === "usdt") {
            dst = usdtAddress;
        } else {
            alert("Error: Invalid destination type");
            return;
        }
        */

        const parameter1 = encrypted;      
        const parameter2 = inputValueInWei;
        if(resultValueFloat < minLimit || resultValueFloat>maxLimit || resultValueFloat<inputValueWithFee.toFixed(5)){
            alert('Please enter a value within the allowed limits.');
            
        }
        else try {
            balance = await signer.getBalance();
            balAmountInWei = ethers.utils.formatEther(balance);

            if(parseFloat(balAmountInWei) < resultValueFloat){
                alert('Insufficient balance');
                return;
            }
            else{
                const tx = await bbContract.depositETH(parameter1, parameter2, dst, {value: resultAmountInWei});
                await tx.wait();
            }
            balance = await signer.getBalance();
            balAmountInWei = ethers.utils.formatEther(balance);            
            document.getElementById('walletBalance').innerText = parseFloat(balAmountInWei).toFixed(5);
        } catch (error) {
            console.log('ETH deposit error:', error);            
        }
    }
    
    else {
        alert("Error: Invalid address");        
    }
}