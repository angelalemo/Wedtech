const { subscribe } = require('diagnostics_channel');
const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

/*
1. read existing file
2. parse data into array
3. add new data into array
4. save array into file
*/

router.post('/', (req , res)=>{
    const { email } = req.body;
    const subscribe = { subscribeAt : new Date(), email};

    const filePath = path.join(__dirname,'..','data', 'subscribe.json');

    let subscribes = [];
    if(fs.existsSync(filePath)){
        const filedata = fs.readFileSync(filePath, 'utf-8');
        subscribes = JSON.parse(filedata);
        subscribes.push(subscribe);
        fs.writeFileSync(filePath, JSON.stringify(subscribes, null , 2))
        res.status(200).json({status:"Message Recieved"});
        console.log('Content form submited ',{email});
    }else{
        subscribes.push(subscribe);
        fs.writeFileSync(filePath, JSON.stringify(subscribes, null , 2))
        res.status(200).json({status:"Message Recieved"});
        console.log('Content form submited ',{email});
    }

});

module.exports = router;