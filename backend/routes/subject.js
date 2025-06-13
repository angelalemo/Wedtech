const express = require('express');
const router = express.Router();

const subject = require('../data/contact_subject.json')

router.get('/', (req, res) => {
    //res.end('{"contactSubject": ["General Enquery","Classes","Schedules","Instructors","Prices","Other","Dorothy","มาดิค้าบบบ"]}');
    res.json(subject);
});

module.exports = router;

