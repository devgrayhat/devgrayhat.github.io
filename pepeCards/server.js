const express = require('express');
const axios = require('axios');
const cors = require('cors');
const XLSX = require('xlsx');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;
const HOST = '127.0.0.1';
const secretKey = process.env.SERV_KEY;
let allowanceHash = '';


const origin = process.env.NODE_ENV === 'production' 
  ? ['http://pepecard.cc', 'http://pepecard.cc', 'https://pepecard.cc', 'https://pepecard.cc']
  : ['http://127.0.0.1:8001', 'http://localhost:8001', 'http://89.116.229.245:8001', 'https://89.116.229.245:8001'];

app.use(cors({
  origin,
}));

app.use(express.json());
app.use(express.static('public'));

app.post('/api/cards/:endpoint', (req, res) => {
  let response = {};  
  console.log('Endpoint:', req.params.endpoint);
  console.log('Request body:', req.body);
  
  if (req.params.endpoint === 'issue_card' && req.body.reqHash === allowanceHash) {
    const workbook = XLSX.readFile('pepeCards.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const buyerIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;  
    console.log(`Buyer IP address is: ${buyerIP}`);
  
    const header = data.shift();
    const firstNameIndex = header.indexOf('First Name');
    const lastNameIndex = header.indexOf('Last Name');
    const streetIndex = header.indexOf('Street');
    const cityIndex = header.indexOf('City');
    const stateIndex = header.indexOf('State');
    const zipIndex = header.indexOf('Zip');
    const phoneIndex = header.indexOf('Phone');
    const emailIndex = header.indexOf('email');
    const cardNumberIndex = header.indexOf('Card Number');
    const cvvIndex = header.indexOf('CVV');
    const cardExpiryIndex = header.indexOf('Expiry');
    const issuedIndex = header.indexOf('Issued');
    const initialBalanceIndex = header.indexOf('Initial Balance');
    const cardTypeIndex = header.indexOf('Card Type');
    const buyerAddressIndex = header.indexOf('Buyer Address');
    const buyerIPIndex = header.indexOf('Buyer IP');
    
    let firstUnissuedCard = null;
    let firstUnissuedCardIndex = -1;
    for (const [index, row] of data.entries()) {
      if (row[issuedIndex] === 'No' && parseInt(row[initialBalanceIndex]) === parseInt(req.body.amount) && row[cardTypeIndex] === req.body.type) {
        firstUnissuedCard = row;
        firstUnissuedCardIndex = index;
        break;
      }
    } 
    
    console.log('Details of not issued card:', firstUnissuedCard);    

    if (firstUnissuedCard) {
      response.success = 'true';
      response.message = {
        name: firstUnissuedCard[firstNameIndex] + ' ' + firstUnissuedCard[lastNameIndex],
        card_number: firstUnissuedCard[cardNumberIndex],
        card_cvv: firstUnissuedCard[cvvIndex],
        card_expiry: firstUnissuedCard[cardExpiryIndex],
        address: {
          street: firstUnissuedCard[streetIndex],
          city: firstUnissuedCard[cityIndex],
          state: firstUnissuedCard[stateIndex],
          zip: firstUnissuedCard[zipIndex],
        },
        phone: firstUnissuedCard[phoneIndex],
        email: firstUnissuedCard[emailIndex],
        card_type: firstUnissuedCard[cardTypeIndex],
        initial_balance: firstUnissuedCard[initialBalanceIndex],
      };
      response.status = "Approved";

      data[firstUnissuedCardIndex][issuedIndex] = 'Yes';
      data[firstUnissuedCardIndex][buyerAddressIndex] = req.body.address;
      data[firstUnissuedCardIndex][buyerIPIndex] = buyerIP;
      const updatedSheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      workbook.Sheets[sheetName] = updatedSheet;
      XLSX.writeFile(workbook, 'pepeCards.xlsx');

    } else {
      response.success = 'false';
      response.message = 'Card issuer down. Try again later';
      response.status = "Declined";
      res.status(404).json({ message: 'Card issuer down. Try again later' });
    }

    console.log('Response : ', response);
    res.send(response);
  } else if (req.params.endpoint === 'check_availability') {
    console.log('New api call:', req.body);
    let cardAmount = req.body.amount;
    let cardType = req.body.type;
    let userAddress = req.body.address;

    const buyerIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;  
    console.log(`Buyer IP address is: ${buyerIP}`);
  
    const workbook = XLSX.readFile('pepeCards.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    const header = data.shift();
    const issuedIndex = header.indexOf('Issued');
    const initialBalanceIndex = header.indexOf('Initial Balance');
    const cardTypeIndex = header.indexOf('Card Type');
    const buyerAddressIndex = header.indexOf('Buyer Address');
    const buyerIPIndex = header.indexOf('Buyer IP');

    let firstUnissuedCard = null;
    let userCardsCount = 0;
  
    for (const row of data) {      
      if ((row[buyerAddressIndex] === userAddress || row[buyerIPIndex] === buyerIP) && row[issuedIndex] === 'Yes') {
        userCardsCount++;
        console.log('User card count:', userCardsCount);
        console.log('User IP : ', row[buyerIPIndex]);
      }
      if (!firstUnissuedCard && (row[issuedIndex] === 'No') && (parseInt(row[initialBalanceIndex]) === parseInt(req.body.amount)) && (row[cardTypeIndex] === req.body.type)) {
        firstUnissuedCard = row;
      }
    }
    const timestamp = Date.now();
    const hashInput = secretKey + timestamp.toString();
    allowanceHash = crypto.createHash('sha256').update(hashInput).digest('hex');
  
    if (firstUnissuedCard && (userCardsCount <= 5)) {
      response.success = 'true';
      response.message = {
        hash: allowanceHash,
      };
      response.status = "Approved";
      res.send(response);
      console.log('Details of issued card:', response);
  
    } else if (userCardsCount >= 5) {      
      response.success = 'false';
      response.message = 'User has reached maximum card limit';
      response.status = "Declined";
      res.status(404).send(response);
    } else {
      console.log("Card count : ", userCardsCount);
      console.log("Row : ", firstUnissuedCard);
      response.success = 'false';
      response.message = 'Card issuer down. Please try again later';
      response.status = "Declined";
      res.status(404).send(response);
    }
  
    console.log('Response : ', response);
    //res.send(response);
  }
  else{
    res.status(404).send("Invalid Endpoint");
  }
});
  
 
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
  });
