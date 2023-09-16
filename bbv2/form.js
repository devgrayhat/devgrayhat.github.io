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
