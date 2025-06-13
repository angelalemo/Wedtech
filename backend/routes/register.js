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
const {
    firstName,
    lastName,
    email,
    password,
    occupationCategory,
    occupation
  } = req.body;

  const newUser = {
    firstName,
    lastName,
    email,
    password,
    occupationCategory,
    occupation
  };

    const filePath = path.join(__dirname,'..','data', 'user.json');

    let users = [];
    if(fs.existsSync(filePath)){
        const filedata = fs.readFileSync(filePath, 'utf-8');
        users = JSON.parse(filedata);

  
    const emailExists = users.some(user => user.email === email);

    if (emailExists) {
      return res.status(400).json({ success: false,  message: 'Email already exists' }); 
    }


        users.push(newUser);
        fs.writeFileSync(filePath, JSON.stringify(users, null , 2))
        res.status(200).json({ success: true,  message: 'Register successfully' });
        console.log('New user registered:', newUser);
    }else{
        users.push(newUser);
        fs.writeFileSync(filePath, JSON.stringify(users, null , 2))
        res.status(200).json({ success: true,  message: 'Register successfully' });
        console.log('New user registered:', newUser);
    }

});

module.exports = router;