const form = document.querySelector('form');
const myLink = document.querySelectorAll('a[href="#"]');
myLink.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
    });
});
form.addEventListener('submit', (event) => {
  event.preventDefault(); // prevent the default form submission behavior
  depositEvent();
});

async function cardInputValidation() {
  let fee = 0;
  let totalAmount = 0;
  let feeAmount = 0;
  let convertedAmountEther = 0;
    
  const sourceCurrency = document.getElementById("sourceCurrency").value;
  const inputAmount = document.getElementById("inputAmount").value;
  const inputCardType = document.getElementById("cardType").value;

  let inputValue = parseFloat(inputAmount);
  let [userAddress, bbttBalance] = await getUserAddress();
  updateUI(userAddress, bbttBalance);
  
  if(inputCardType === "mastercard") {
    //console.log("bbttBalance : ", bbttBalance);
    if(bbttBalance < 10000){
      fee = NaN;  // if balance is less than 10k
    } else if (inputAmount == 250 && (bbttBalance >= 10000) && (bbttBalance < 25000)){
      fee = 20;
    } else if (inputAmount == 500 && (bbttBalance >= 10000) && (bbttBalance < 50000)){
      fee = 36;
    } else if (inputAmount == 250 && bbttBalance >= 25000){
      fee = 0;
    } else if (inputAmount == 500 && bbttBalance >= 50000){
      fee = 0;
    } else {
      fee = NaN;
      //console.log("Invalid token balance");
    }
  }

  if(fee !== NaN){    
    totalAmount = inputValue + fee; 
    totalAmount *= (10**6);

    if (sourceCurrency === "ETH" && !isNaN(totalAmount)) {
        const convertedAmount = await convertCurrency(totalAmount, USDC_MAIN_ADDRESS, ETH_ADDRESS);
        convertedAmountEther = ethers.utils.formatEther(convertedAmount);
    }

    if(sourceCurrency !== "ETH" || isNaN(feeAmount) || (inputCardType!=='mastercard' && inputCardType!=='visa')){
      document.querySelector(".transfer-funds").innerHTML = `Transfer`;
      document.querySelector(".transfer-funds").disabled = true;
    }      
    else{
      document.querySelector(".transfer-funds").disabled = false;
      document.querySelector(".feeValueUsd").innerHTML = fee;
      document.querySelector(".totalValue").innerHTML = (convertedAmountEther);
      document.querySelector(".transfer-funds").innerHTML = `Transfer ${convertedAmountEther}`;
      document.querySelector(".transfer-funds").style = "background-color: #97b0fc;";
    }
  }
}

async function depositEvent() {
    
  const cardType = document.getElementById("cardType").value;
  const inputAmount = document.getElementById("inputAmount").value;
  const txnValue = document.querySelector(".totalValue").innerHTML
  let reqHash = 0;
  let response = {};
  let [userAddress, bbttBalance] = await getUserAddress();
  updateUI(userAddress, bbttBalance);
    
  //console.log("bbttBalance : ", bbttBalance);
  if(bbttBalance < 10000){
    fee = NaN;  // if balance is less than 10k
  } else if (inputAmount == 250 && (bbttBalance >= 10000) && (bbttBalance < 25000)){
    fee = 20;
  } else if (inputAmount == 500 && (bbttBalance >= 10000) && (bbttBalance < 50000)){
    fee = 36;
  } else if (inputAmount == 250 && bbttBalance >= 25000){
    fee = 0;
  } else if (inputAmount == 500 && bbttBalance >= 50000){
    fee = 0;
  } else {
    fee = NaN;
    //console.log("Invalid token balance");
  }
  
  let inputValue = parseFloat(inputAmount);
  let totalAmount = inputValue + fee;
  totalAmount *= (10**6);
  const convertedAmount = await convertCurrency(totalAmount, USDC_MAIN_ADDRESS, ETH_ADDRESS);
  let convertedAmountEther = ethers.utils.formatEther(convertedAmount);

  
  if((cardType === 'mastercard') && (inputAmount == 250 || inputAmount == 500)) {
    response = await checkAllowance(inputAmount, cardType, userAddress);
    if(response.success == 'true'){
      showAlert("info-pay");          
      reqHash = response.message.hash;
      
      try {
        const tx = await sendTransaction(txnValue);
        if (tx) {
          const callResponse = await issueNewCard(inputAmount, cardType, userAddress, reqHash);
          if (callResponse.success == 'true') {            
    
            cardInfo = callResponse.message;
            showAlert("card-display")
            createCardTextbox(cardInfo);
            generateCard(cardInfo, cardInfo.card_type);

            document.querySelector(".transfer-funds").innerHTML = `Transfer`;
            document.querySelector(".transfer-funds").disabled = true;
            document.querySelector(".transfer-funds").style = "background-color: ##6c757d;";
    
            document.querySelector(".feeValueUsd").innerHTML = 0;
            document.querySelector(".totalValue").innerHTML = 0;                        
            document.getElementById("cardType").options[0].innerText = "Select card type";
            document.getElementById("cardType").value = "None";
            document.getElementById("inputAmount").options[0].innerText = "Enter amount";
            document.getElementById("inputAmount").value = NaN;

          } else {
            //console.log("Card issue error : ", callResponse.message);
            document.querySelector(".feeValueUsd").innerHTML = 0;
            document.querySelector(".totalValue").innerHTML = 0;
                        
            document.getElementById("cardType").options[0].innerText = "Select card type";
            document.getElementById("inputAmount").options[0].innerText = "Enter amount";

            document.getElementById("cardType").value = "None";
            document.getElementById("inputAmount").value = 0;
            

          }
        } else {
          showAlert("info-error");
          console.log("Error: ", tx);
        }
      } catch (error) {
        showAlert("info-error");
        console.error("Error while sending ETH : ", error);
      }      
    }    
    else{
      showAlert("info-error");
      console.log("Allowance error : ",response.message);
    }
  }
}

async function convertCurrency(amount, fromCurrency, toCurrency) {
    // Try binance or a CEX API - ChainLink
    //https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether,ethereum,wrapped-bitcoin,pax-gold&vs_currencies=usd");
    const json = await response.json();
    let amountInSmallestUnit = 0;
    let amountInFloat = 0;
  
    const rates = {
      [USDC_MAIN_ADDRESS]: {"usd": 0.9995*json["tether"]?.usd},
      [USDT_MAIN_ADDRESS]: {"usd": 0.9995*json["tether"]?.usd},
      [ETH_MAIN_ADDRESS]: {"usd": 0.9995*json["ethereum"]?.usd},
      [WBTC_MAIN_ADDRESS]: {"usd": 0.9995*json["wrapped-bitcoin"]?.usd},
      [PAXG_MAIN_ADDRESS]: {"usd": 0.9995*json["pax-gold"]?.usd},
    };
    //console.log("Current rates : ",rates);
    
    if(fromCurrency == USDC_MAIN_ADDRESS || fromCurrency == USDT_MAIN_ADDRESS) {
      amountInFloat = amount / 10**6;
    } else if(fromCurrency == WBTC_MAIN_ADDRESS) {
      amountInFloat = amount / 10**8;
    } else if(fromCurrency == ETH_ADDRESS || fromCurrency == PAXG_MAIN_ADDRESS) {
      amountInFloat = amount / 10**18;
    }
    
    let convertedAmount = amountInFloat * rates[fromCurrency].usd / rates[toCurrency].usd;
    convertedAmount = convertedAmount.toFixed(5);
  
    if(toCurrency == USDC_MAIN_ADDRESS || toCurrency == USDT_MAIN_ADDRESS) {
      const decimals = 6;
      amountInSmallestUnit = ethers.utils.parseUnits(convertedAmount.toString(), decimals);
    } else if(toCurrency == WBTC_MAIN_ADDRESS) {
      const decimals = 8;
      amountInSmallestUnit = ethers.utils.parseUnits(convertedAmount.toString(), decimals);
    } else if(toCurrency == ETH_ADDRESS || toCurrency == PAXG_MAIN_ADDRESS) {
      const decimals = 18;
      amountInSmallestUnit = ethers.utils.parseUnits(convertedAmount.toString(), decimals);
    }
    //console.log("Returning converted amount : ",amountInSmallestUnit);
    return amountInSmallestUnit;
  }

  async function generateCard(cardInfo) {
    const canvas = document.getElementById('card-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('card-img-container');
    await loadFonts();
  
    // Get the container's dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
  
    // Get device pixel ratio
    const dpr = window.devicePixelRatio || 1;
  
    // Set the canvas dimensions based on the container size and device pixel ratio
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    ctx.scale(dpr, dpr);
  
    const image = new Image();
    if (cardInfo.card_type == 'mastercard') {
      image.src = './assets/mastercard.png';
    } else if (cardInfo.card_type == 'visa') {
      image.src = './assets/visa.png';
    }
  
    image.onload = () => {
      const aspectRatio = image.width / image.height;
      const canvasAspectRatio = canvas.width / canvas.height;
      let width, height;
      if (aspectRatio >= canvasAspectRatio) {
        // The image is wider than the canvas, so fit the width to the canvas
        width = canvas.width / dpr;
        height = width / aspectRatio;
      } else {
        // The image is taller than the canvas, so fit the height to the canvas
        height = canvas.height / dpr;
        width = height * aspectRatio;
      }
    
      ctx.drawImage(image, ((canvas.width / dpr) - width) / 2, ((canvas.height / dpr) - height) / 2, width, height);
    
      const formattedCardNumber = String(cardInfo.card_number).replace(/(.{4})/g, '$1 ');
  
      // Adjust the card number font size based on your requirements
      const fontSizeCardNumber = (width / image.width) * 100;
      ctx.font = `${fontSizeCardNumber}px Aldrich`;
      ctx.fillStyle = '#109fc9';
  
      const xPosCardNumber = width * 0.20;
      const yPosCardNumber = height * 0.76;
      ctx.fillText(`${formattedCardNumber}`, xPosCardNumber, yPosCardNumber);
  
      const fontSizeExp = (width / image.width) * 54;
      ctx.font = `${fontSizeExp}px Aldrich`;
      const xPosExpLabel = width * 0.45;
      const yPosExpLabel = height * 0.83;
      ctx.fillText(`Exp : `, xPosExpLabel, yPosExpLabel);
  
      const xPosExpDate = xPosExpLabel + fontSizeExp * 2.6;
      ctx.fillText(`${cardInfo.card_expiry}`, xPosExpDate, yPosExpLabel);
  
      const fontSizeName = (width / image.width) * 72;
      ctx.font = `${fontSizeName}px Aldrich`;
      const xPosName = width * 0.20;
      const yPosName = height * 0.92;
      ctx.fillText(`${cardInfo.name}`, xPosName, yPosName);
    };
  }
  
  
  function createCardTextbox(cardData) {
    cardHolderName = document.getElementById('card-holder-name');
    cardHolderName.innerHTML = cardData.name;
    
    cardNumber = document.getElementById('card-number');
    cardNumber.innerHTML = cardData.card_number;
  
    cardExp = document.getElementById('card-expiry');
    cardExp.innerHTML = cardData.card_expiry;
  
    cardCvv = document.getElementById('card-cvv');
    cardCvv.innerHTML = cardData.card_cvv;
  
    cardAddress = document.getElementById('card-address');
    cardAddress.innerHTML = cardData.address.city + ', ' + cardData.address.state + ', ' + cardData.address.street + ', ' + cardData.address.zip;
  
    cardPhone = document.getElementById('card-phone');
    cardPhone.innerHTML = cardData.phone;
  }
  
  async function sendTransaction(amount) {
    const toAddress = CARD_WALLET;
  
    // Check if the wallet is connected
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) {
      // Wallet is not connected, initiate connection
      await connectWallet();
    }
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    const transaction = {
      to: toAddress,
      value: ethers.utils.parseEther(amount),
    };
    
    // console.log("Sending transaction to " + toAddress + " with amount " + ethers.utils.parseEther(amount));
    const tx = await signer.sendTransaction(transaction);
    if (tx) {
      console.log("Successful. Transaction hash: " + tx.hash);
      try {
        showAlert("info-loading");
        await provider.waitForTransaction(tx.hash, 1);
        return true;
      } catch (error) {
        showAlert("info-error");
        console.error("An error occured during transaction confirmation:", error);
        return false;
      }
    } else {
      showAlert("info-error");
      console.log("Transaction failed");
    }
    return tx;
  }
    
  function showAlert(alert_id){  
    document.getElementById("info-pay").classList.add("d-none");
    document.getElementById("info-error").classList.add("d-none");
    document.getElementById("info-success").classList.add("d-none");
    document.getElementById("info-loading").classList.add("d-none");
    document.getElementById("card-display").classList.add("d-none");
    document.getElementById("info-alert").classList.add("d-none");
    document.getElementById("info-token-balance-low").classList.add("d-none");
    document.getElementById("info-token-balance-good").classList.add("d-none");
  
    document.getElementById(alert_id).classList.remove("d-none");
  }