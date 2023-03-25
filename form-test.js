function handleCurrencyChange() {
    document.getElementById("inputAmount").value = '';
    document.querySelector(".fee").innerHTML = '-';
    document.querySelector(".totalValue").innerHTML = '-';
    document.querySelector(".eth-submit").innerHTML = `Transfer`;
    document.getElementById("destinationCurrency").value = document.getElementById("sourceCurrency").value;
}

function inputValidation(input) {
    let fee;
    let feePercentage;
    const inputValue = parseFloat(input.value);
    const sourceCurrency = document.getElementById("sourceCurrency").value;    
  
    if (sourceCurrency === "ETH") {
      if (inputValue >= 0.005 && inputValue <= 0.01) {
        feePercentage = 0.03;
      } else if (inputValue > 0.01 && inputValue <= 0.03) {
        feePercentage = 0.0275;
      } else if (inputValue > 0.03 && inputValue <= 0.05) {
        feePercentage = 0.025;
      }
    } else if (sourceCurrency === "USDC" || sourceCurrency === "USDT") {
      if (inputValue >= 10 && inputValue <= 50) {
        feePercentage = 0.03;
      } else if (inputValue > 50 && inputValue <= 100) {
        feePercentage = 0.0275;
      } else if (inputValue > 100 && inputValue <= 500) {
        feePercentage = 0.025;
      }
    } else if(sourceCurrency === "WBTC"){
        
        if (inputValue >= 0.0005 && inputValue <= 0.001) {
            feePercentage = 0.03;
        } else if (inputValue > 0.001 && inputValue <= 0.03) {
            feePercentage = 0.0275;
        } else if (inputValue > 0.03 && inputValue <= 0.05) {
            feePercentage = 0.025;
        }
        
    } else if(sourceCurrency === "PAXG"){
        
        if (inputValue >= 0.0005 && inputValue <= 0.001) {
            feePercentage = 0.03;
        } else if (inputValue > 0.001 && inputValue <= 0.03) {
            feePercentage = 0.0275;
        } else if (inputValue > 0.03 && inputValue <= 0.05) {
            feePercentage = 0.025;
        }
        
    }

  
    fee = feePercentage * inputValue;
    document.querySelector(".fee").innerHTML = fee.toFixed(5);
    document.querySelector(".totalValue").innerHTML = (inputValue + fee).toFixed(5);
    document.querySelector(".eth-submit").innerHTML = `Transfer ${(inputValue + fee).toFixed(5)}`;
  
    if (isNaN(fee)) {
      document.getElementById("transferButton").disabled = true;
      document.getElementById("transferButton").innerText = "Transfer";
    } else {
      document.getElementById("transferButton").disabled = false;
    }
}
  

function showForm(btn, mainDiv){
    document.querySelectorAll('.form-toggle').forEach((item) => {
        item.style.borderBottom = 'none';
    })
    document.querySelectorAll('.eth-form').forEach((item) => {
        item.style.display = 'none';
    })
    document.querySelector(`#${mainDiv}`).style.display = 'block';
    btn.style.borderBottom = '2px solid white '
}
