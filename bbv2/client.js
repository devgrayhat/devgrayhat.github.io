async function makeGetRequest(endpoint) {
    try {
      const response = await fetch(`https://www.bbtt.io/api/${endpoint}`, {
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
      const response = await fetch(`https://www.bbtt.io/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
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
    console.log(data);

    if (data.success) {
      return data;
    } else {
      showAlert("info-error");
      console.error('Error issuing card:', data.message || 'Unknown error');
    }
  }


  async function checkAllowance(amount, type, userAddress) {
    const endpoint = 'cards/check_allowance';
    console.log('Endpoint:', endpoint);
  
    const payload = {
      amount: amount,
      type: type,
      address: userAddress
    };
  
    try {
      const data = await makePostRequest(endpoint, payload);
  
      if (data && data.success == 'true') {
        console.log("Success:", data);
        return data;
      } else {
        handleErrorResponse(data);
      }
    } catch (error) {
      handleErrorResponse();
      console.error('Error in checkAllowance:', error);
    }
  }
  
  function handleErrorResponse(data) {
    showAlert("info-error");
    console.error('Error issuing card:', (data && data.message) || 'Unknown error');
    document.querySelector(".feeValueUsd").innerHTML = 0;
    document.querySelector(".totalValue").innerHTML = 0;
  
    document.getElementById("cardType").options[0].innerText = "Select card type";
    document.getElementById("cardType").value = "None";
  
    document.getElementById("inputAmount").options[0].innerText = "Enter amount";
    document.getElementById("inputAmount").value = NaN;
  }

  
   

  // Call the getAvailableCurrencies function when the page loads
async function init() {
  //Check if there is enough allowance to issue a card
  
  let allowance = await getCardAllowance();
  //let allowance = 1000;
  let cardInfo;
  let cardType = 'visa';

  const requestedBalance = 100;
  
  const cardFee = calculateFee(requestedBalance, cardType);
  console.log("Card Fee: " + cardFee);

  if(allowance > requestedBalance + cardFee) {
    
    if(cardType == 'master' || cardType == 'visa'){
      result = await issueNewCard(requestedBalance);
      if(result && result.success){
        cardInfo = result.message;
        createCardTextbox(cardInfo);
        generateCard(cardInfo, cardInfo.card_type);
      }
    } else {
      console.log("Card type not supported");
    }
    loadingOverlay.style.display = "none";
    cardCanvas.style.display = "block";
    console.log("Requested Balance + Fee : " + (requestedBalance + cardFee));
  }
  else
    console.log("Due to high demand, our Card provider is currently experiencing issues. Please try again later.");
}

async function checkCardDisplay(){
  let cardInfo={};
  
  const data = {
    "success": true,
    "message": {
      "name" : "Mr Derek Smith",   
      "card_number": "5183752230064044",
      "card_cvv": "086",
      "card_expiry": "04/2024",      
      "address" : {
        street : "667 Lesch Row",
        city : "Nikolausstad",
        state : "LA",        
        zip : "60220-6026"
      },
      "phone" : "1234567890",
      "email" : "Derek.smith@gmail.com",
      "card_type" : "visa",
      "initial_balance" : "100"
      },
      "status": "Approved"
    }
  
  cardInfo = data.message;

    
  createCardTextbox(cardInfo);
  generateCard(cardInfo);
  //loadingOverlay.style.display = "none";

  console.log('Card info: ', cardInfo);
  //createCardDisplay(cardInfo);
}

//init();
//checkCardDisplay();

 
