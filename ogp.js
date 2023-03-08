// Connect Metamask with Dapp =========================================
async function connectWallet() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    const signer = await provider.getSigner();

    const balance = await signer.getBalance();
    const balAmount = ethers.utils.formatEther(balance);
    document.getElementById('walletBalance').innerText = parseFloat(balAmount).toFixed(8);      
}
        
async function transferFunds(){
    //bbttAddress ----> '0xad8c765ed9387ef4ca12ed194237ab1a79fc0659';
    //testAddress ----> '0x66b8eC92462678295fA4316FaBC37e035238b4C8';
    var balance = 0;
    const minLimit = 0.005;
    const maxLimit = 0.05125;    
    
    // Get provider and balance
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const balance = await signer.getBalance();
    const balAmount = ethers.utils.formatEther(balance);

    // Contract address
    const contractAddress = "0x66b8eC92462678295fA4316FaBC37e035238b4C8";
    
    const resultField = document.getElementById("totalValue");
    const rxAddress = document.getElementById("receiverAddress");    
    const inputValue = parseFloat(resultField.innerText);
    const sendAmount = resultField.innerText; // amount of Ether to send
    const amountInETH = ethers.utils.parseEther(sendAmount); 
    if(amountInETH < minLimit || amountInETH>maxLimit){
        alert('Error! Please enter value between within the allowed limits.');
        return;
    }

    try {
        await provider.getNetwork(); // throws an error if not connected
        console.log('Wallet is connected!');
    } catch (error) {
        console.log('Wallet is not connected.');
        alert("Connect your wallet.");
        return;
    }

    if(parseFloat(balAmount)<inputValue){
        alert("Error: Recheck your balance. ");
        return;
    }    

    const ethAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
    if (rxAddress && rxAddress.value.trim() !== "" && ethAddressRegex.test(rxAddress.value)) {        

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

        try {
            const encrypted = await openpgp.encrypt({
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

        const encMessage = await openpgp.readMessage({
            armoredMessage: encrypted // parse armored message
        });
                
                   
        console.log("Address : ",contractAddress);
        console.log("Encrypted Address :", encrypted);
        console.log ("Amount to transfer :",amountInETH);
        
    // The Contract interface
        let abi =             
            [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"string","name":"encryptedAddress","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"depositETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"encryptedMessagesList","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ethAmountList","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"listLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"readEncryptedMessagesList","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"readEthAmountList","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wipeList","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"dst","type":"address"}],"name":"withdrawETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"withdrawTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
                
        let bbContract = new ethers.Contract(contractAddress, abi, provider.getSigner());

        const parameter1 = encrypted; // value of the first parameter
        const inputAmount = document.getElementById('eth-amount'); //eth-amount from user wallet
        const parameter2 = ethers.utils.parseEther(inputAmount.value); // value of the second parameter
        if(parameter2<minLimit || parameter2>maxLimit){
            alert('Please enter a value within the allowed limits.');
            return;
        }
        try {
            const tx = await bbContract.depositETH(parameter1, parameter2, {value: amountInETH});
            await tx.wait(); // wait for the transaction to be confirmed on the blockchain
        } catch (error) {
            console.log('ETH deposit error:', error);
        }
    }
    
    else {
        alert("Error: Invalid address");
        return;
    }
}