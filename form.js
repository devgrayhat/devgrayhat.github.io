function inputValidation(inp){
    let fee;
    let feePercentage;
    const inputValue = parseFloat(inp.value);
    /*
    if(inputValue>=0.005 && inputValue<=0.01){feePercentage = 0.03;}
    else if(inputValue>0.01 && inputValue<=0.03){feePercentage = 0.0275;}
    else if(inputValue>0.03 && inputValue<=0.05){feePercentage = 0.025;}
    */
    
    if(inputValue>=0.5 && inputValue<=1){feePercentage = 0.03;}
    else if(inputValue>1 && inputValue<=3){feePercentage = 0.0275;}
    else if(inputValue>3 && inputValue<=5){feePercentage = 0.025;}

    /*
    //Disabled for now
    //else if(inputValue>5 && inputValue<=10){feePercentage = 0.02;}
    //else if(inputValue>10 && inputValue<=20){feePercentage = 0.015;}
    //else if(inputValue>20){inputValue = 0.01;}
    */

    fee = feePercentage*inputValue;
    document.querySelector('.fee').innerHTML = fee.toFixed(5);
    document.querySelector('.totalValue').innerHTML = (inputValue + fee).toFixed(5);
    document.querySelector(".eth-submit").innerHTML=`Transfer ${(inputValue + fee).toFixed(5)}`  ;  
    
    if(isNaN(fee))
    {
        document.getElementById("transferButton").disabled = true;
        document.getElementById("transferButton").innerText = "Transfer";        
    }    
    else
        document.getElementById("transferButton").disabled = false;
    
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
