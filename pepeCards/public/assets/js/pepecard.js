const myLink = document.querySelectorAll('a[href="#"]');
myLink.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
    });
});


async function depositEth(balance) {

  const minPepeL1 = 500000000.0;     // 500,000,000
  const minPepeCardL1 = 50000000.0;  // minimum required PEPE Card balance
  const minPepeCardL2 = 100000000.0; // minimum required PEPE Card balance 
  const minPepeCardL3 = 150000000.0; // 150,000,000
  const minPepeCardL4 = 200000000.0; // 200,000,000 

    
  //const cardType = document.getElementById("cardType").value;
  //const inputAmount = document.getElementById("inputAmount").value;
  //const txnValue = document.querySelector(".totalValue").innerHTML;
  //let [userAddress, pepeCardBalance] = await getUserAddress();
  
    
  //console.log("pepeCardBalance : ", pepeCardBalance);
  if(balance.balancePepeInPepe < minPepeL1){
    fee = NaN;  // if balance is less than 10k
  } else if (balance.balancePepeInPepe >=minPepeL1 && balance.balancePepeCardInPepe < minPepeCardL1){
    fee = 50;
  } else if (balance.balancePepeInPepe >=minPepeL1 && (balance.balancePepeCardInPepe >= minPepeCardL1 && balance.balancePepeCardInPepe < minPepeCardL2)){
    fee = 45;
  } else if (balance.balancePepeInPepe >=minPepeL1 && (balance.balancePepeCardInPepe >= minPepeCardL2 && balance.balancePepeCardInPepe < minPepeCardL3)){
    fee = 25;
  } else if (balance.balancePepeInPepe >=minPepeL1 && (balance.balancePepeCardInPepe >= minPepeCardL3 && balance.balancePepeCardInPepe < minPepeCardL4)){
    fee = 15;
  } else if (balance.balancePepeInPepe >=minPepeL1 && (balance.balancePepeCardInPepe >= minPepeCardL4)){
    fee = 0;
  } else {
    fee = NaN;
    //console.log("Invalid token balance");
  }
  console.log("Fee : ", fee);
  let inputValue = parseFloat(500);
  let totalAmount = inputValue + fee;  
  console.log("totalAmount : ", totalAmount);

  const convertedAmount = await convertUSDToETH(totalAmount);
  
  let cardType = 'mastercard';
  let userAddress = '0x2dADE6Cc700AB5CA7f1709A4EcB5F3b1F9ADB885';
  let txnValue = convertedAmount.toString();


  if(inputValue == 500) {
    //console.log("inputValuesssss : ", inputValue);
    response = await checkAvailability(inputValue, cardType, userAddress);
    //console.log("responsessss : ", response);
    if(response.success == 'true'){
      //showAlert("info-pay");
      reqHash = response.message.hash;
      console.log("reqHash : ", reqHash);
      try {
        const tx = await sendTransaction(txnValue);
        if (tx) {
          const callResponse = await issueNewCard(inputValue, cardType, userAddress, reqHash);
          if (callResponse.success == 'true') {
            console.log("Card issue success : ", callResponse.message);
            cardInfo = callResponse.message;
            
            createCardTextbox(cardInfo);
            generateCard(cardInfo, cardInfo.card_type);
            return true;

          } else {
            showAlert('alert-general-failure');
            console.log("Card issue error : ", callResponse.message);
            return false;
          }
        } else {
          showAlert('alert-general-failure');
          console.log("Error: ", tx);
          return false;
        }
      } catch (error) {
        showAlert('alert-general-failure');
        console.error("Error while sending ETH : ", error);
        return false;
      }      
    }    
    else{
      showAlert('alert-general-failure');
      console.log("Allowance error : ",response.message);
      return false;
    }
  }

  
}

async function getCurrentRates() {
  try {
      const resETHUSDT = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
      const resPEPEUSDT = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=PEPEUSDT");

      if (!resETHUSDT.ok || !resPEPEUSDT.ok) {
          throw new Error('Non-200 status code from Binance API');
      }

      const jsonETHUSDT = await resETHUSDT.json();
      const jsonPEPEUSDT = await resPEPEUSDT.json();

      const ethPriceInUSD = parseFloat(jsonETHUSDT.price);
      const pepePriceInUSD = parseFloat(jsonPEPEUSDT.price);

      return { ethPriceInUSD, pepePriceInUSD };
  } catch (error) {
      console.error(error);
      return null;
  }
}

async function convertUSDToETH(amountUSD) {
  try {
      const prices = await getCurrentRates();
      if (!prices) {
          throw new Error('Failed to fetch prices');
      }

      const ethAmount = amountUSD / prices.ethPriceInUSD;
      //const ethAmountInFloat = ethAmount * 10**18;
      //console.log('Eth amount :', ethAmount);
      //console.log('Eth amount in float :', ethAmountInFloat);
      return ethAmount;
  } catch (error) {
      console.error(error);
      return null;
  }
}

  async function convertCurrency(amount, fromCurrency, toCurrency) {
    // Try binance or a CEX API - ChainLink
    //https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT : {"symbol":"ETHUSDT","price":"1838.12000000"}
    //https://api.binance.com/api/v3/ticker/price?symbol=PEPEUSDT : {"symbol":"PEPEUSDT","price":"0.00000193"}
    const resETHUSDT = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
    const resPEPEUSDT = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
    const jsonETHUSDT = await resETHUSDT.json();
    const jsonPEPEUSDT = await resPEPEUSDT.json();
    let amountInSmallestUnit = 0;
    let amountInFloat = 0;
  
    const rates = {
      [USDC_MAIN_ADDRESS]: {"price": 0.9995*json["tether"]?.usd},
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

  async function makeGetRequest(endpoint) {
    try {
      const response = await fetch(`${baseUrl}/api/${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error making GET request:', error);
    }
  }
  
  async function makePostRequest(endpoint, payload) {    
    try {
      const response = await fetch(`${baseUrl}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      //console.log("aaa Response : ", response);
      const data = await response.json();
      //console.log("aaa Data : ", data);
      return data;
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  }
  
  async function issueNewCard(cardBalance, cardType, buyerAddress, reqHash) {
    const endpoint = 'cards/issue_card';
    
    const payload = {
      amount: cardBalance, // Add the amount to the request data
      type: cardType,
      address: buyerAddress,
      reqHash: reqHash
    };
    
    const data = await makePostRequest(endpoint, payload);
    //console.log(data);
  
    if (data.success) {
      //showAlert('none');
      return data;
    } else {
      //showAlert("alert-general-failure");
      console.error('Error issuing card:', data.message || 'Unknown error');
    }
  }
  
  
  async function checkAvailability(amount, type, userAddress) {
    const endpoint = 'cards/check_availability';
    
    const payload = {
      amount: amount,
      type: type,
      address: userAddress
    };
    
    try {
      const data = await makePostRequest(endpoint, payload);
      //console.log('Data : ', data);
      if (data && data.success == 'true') {
        //console.log("Success:", data);
        return data;
      } else {
        handleErrorResponse(data);
      }
    } catch (error) {
      handleErrorResponse();
      console.error('Error in checkAvailability:', error);
    }
  }
  
  function handleErrorResponse(data) {
    showAlert("alert-general-failure");
    console.error('Error issuing card:', (data && data.message) || 'Unknown error');
    
  }

  

  async function testRun(){

    
    const balanceEthInEth = 1;
    const balancePepeInPepe = 500000000;
    const balancePepeCardInPepe = 50000000;
    let balances = {balanceEthInEth, balancePepeInPepe, balancePepeCardInPepe}
    const response = await depositEth(balances);
    

    //let converted = await convertUSDToETH(500);
    
    const Response =  {
      success: 'true',
      message: {
        name: 'Jessica Brown',
        card_number: '5475165220129650',
        card_cvv: 719,
        card_expiry: '10/2023',
        address: { street: '789 Pine Rd', city: 'Austin', state: 'TX', zip: 78701 },
        phone: 14045550143,
        email: 'jessica.brown@example.com',
        card_type: 'mastercard',
        initial_balance: 500
      },
      status: 'Approved'
    };
    //console.log("Response : ", Response);
    //const res = await generateCard(Response.message);
    //createCardTextbox(Response.message);
  }

  testRun();

  async function generateCard(cardInfo) {
    document.getElementById("alerts").classList.add("d-none");
    document.getElementById("card-display").classList.remove("d-none");
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
      image.src = './assets/img/card/mastercard.jpg';
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
      const fontSizeCardNumber = (width / image.width) * 85;
      ctx.font = `${fontSizeCardNumber}px Gloria Hallelujah`;
      ctx.fillStyle = '#000';
  
      const xPosCardNumber = ((canvas.width / dpr) - width) / 2 + width * 0.06;      
      const yPosCardNumber = ((canvas.height / dpr) - height) / 2 + height * 0.85;
      
      ctx.fillText(`${formattedCardNumber}`, xPosCardNumber, yPosCardNumber);
  
      const fontSizeExp = (width / image.width) * 36;
      ctx.font = `${fontSizeExp}px Gloria Hallelujah`;
      const xPosExpLabel = ((canvas.width / dpr) - width) / 2 + width * 0.5;  
      const yPosExpLabel = ((canvas.height / dpr) - height) / 2 + height * 0.92;
      ctx.fillText(`Exp : `, xPosExpLabel, yPosExpLabel);
  
      const xPosExpDate = xPosExpLabel + fontSizeExp * 2.6;
      ctx.fillText(`${cardInfo.card_expiry}`, xPosExpDate, yPosExpLabel);
  
      const fontSizeName = (width / image.width) * 60;
      ctx.font = `${fontSizeName}px Aldrich`;
      const xPosName = ((canvas.width / dpr) - width) / 2 + width * 0.08;
      const yPosName = ((canvas.height / dpr) - height) / 2 + height * 0.92;
      ctx.fillText(`${cardInfo.name}`, xPosName, yPosName); 
    };
  }
  
  
  function createCardTextbox(cardData) {
    document.getElementById("alerts").classList.add("d-none");
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
        //showAlert("info-loading");
        await provider.waitForTransaction(tx.hash, 1);
        return true;
      } catch (error) {
        //showAlert("info-error");
        console.error("An error occured during transaction confirmation:", error);
        return false;
      }
    } else {
      //showAlert("info-error");
      console.log("Transaction failed");
    }
    return tx;
  }
  
  