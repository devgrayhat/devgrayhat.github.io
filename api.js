function getBalance(key){
    fetch('https://api-goerli.etherscan.io/api?module=account&action=txlist&address=0xf576C78729Fa4f113940E09791FAE0BEA902843E&sort=dsc&apikey=V8KMB25SHNYZ1ZY34JCWECCDRJK9YB3XIG')
    .then(response => response.json())
    .then(res => {
        var nData = res.result.filter(sItem => sItem.from === key);
        var val = 0;
        nData.forEach((item) => {
            val = val + parseFloat(item.value)
        })
        return parseFloat(val)/10**18
    })
}
