function inpValidation(inp){
    if (/^[0-9]+(\.)?[0-9]*$/.test(inp.value)){
        const result = calcPerc(parseFloat(inp.value))
        document.querySelector('.fee').innerHTML = result
        document.querySelector(".eth-submit").innerHTML=`Transfer ${result}`
    }
    else{
        document.querySelector('.fee').innerHTML = 'Invalid Value'
    }
}

function calcPerc(val){
    var finalVal = 0
    if (0.5 <= val <= 1){
        finalVal = val + (val/100)*3
    }
    else if (1 < val <= 3){
        finalVal = val + (val/100)*2.75
    }
    else if (3 < val <= 5){
        finalVal = val + (val/100)*2.5
    }
    else if (5 < val <= 10){
        finalVal = val + (val/100)*2
    }
    else if (10 < val <= 20){
        finalVal = val + (val/100)*1.5
    }
    else if (val > 20){
        finalVal = val + (val/100)*1
    }
    return finalVal
}

function showForm(btn, mainDiv){
    document.querySelectorAll('.form-toggle').forEach((item) => {
        item.style.borderBottom = 'none'
    })
    document.querySelectorAll('.eth-form').forEach((item) => {
        item.style.display = 'none'
    })
    document.querySelector(`#${mainDiv}`).style.display = 'block';
    btn.style.borderBottom = '2px solid white '
}
