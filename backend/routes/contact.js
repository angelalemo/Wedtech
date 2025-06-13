const express = require('express');
const router = express.Router();

sqlite3 = require('sqlite3').verbose();

const dbPath = this.patch.join(__dirname, '..', 'data', 'contact.db');
const db = new sqlite3.Database(dbPath);

db.run('CREATE TABLE IF NOT EXISTS contact (fname TEXT, lname TEXT, email TEXT, subject TEXT, message TEXT)');

router.post('/', (req , res)=>{
    const {fname,lname,email,subject,message} = req.body;

    var sql = 'INSERT INTO contact (fname,lname,email,subject,message) VALUES ("'+fname+'","'+lname+'","'+email+'","'+subject+'","'+message+'")';

    db.run('INSERT INTO contact (fname,lname,email,subject,message) VALUES (?, ?, ?, ?, ?)', [fname,lname,email,subject,message]);
    console.log('Content form submited', {fname,lname,email,subject,message});
    res.status(200).json({status:"Message Recieved"});
});

router.get('/:action', (req, res) => {
    const action = req.params;

    switch(action){
        case 'all':
            var sql = 'SELECT * FROM contact ORDER BY id';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    return res.status(500).json({error: 'Failed to retrieve contacts from DB!!'})
                }
                res.json(rows);

            });
            break;

        case'last':
            var sql = 'SELECT * FROM contact ORDER BY id = (SELECT MAX(id) FROM contact)';
            db.all(sql, [],(err, rows) => {
                if (err) {
                    return res.status(500).json({error: 'Failed to retrieve contacts from DB!!'})
                }
                res.json(rows);
            });
            break;

            default:
                return res.status(500).json({error: 'Failed to retrieve contacts from DB!!'});
                break;
    }
});

module.exports = router;