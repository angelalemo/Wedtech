const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// ✅ POST /api/check-login
router.post('/', (req, res) => {
  const { email, password } = req.body;

  const filePath = path.join(__dirname, '..', 'data', 'user.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Read error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.email === email);

    if (user) {
      if (user.password === password) {
      return res.json({ success: true, message: 'Login successful' });
      } else {
      return res.status(401).json({ success: false, message: 'Incorrected Password'});
    }
    } else {
      return res.status(401).json({ success: false, message: 'Incorrected Username' });
    }
  });
});

module.exports = router;