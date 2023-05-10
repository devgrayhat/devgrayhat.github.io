
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
    //console.log(data);

    if (data.success) {
      return data;
    } else {
      showAlert("info-error");
      console.error('Error issuing card:', data.message || 'Unknown error');
    }
  }


  async function checkAllowance(amount, type, userAddress) {
    const endpoint = 'cards/check_allowance';
    //console.log('Endpoint:', endpoint);
  
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
    
  
    
  }

 