const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const productsRoute = require('./routes/products');

const app = express();

app.use(bodyParser.json());
app.use('/api', productsRoute);


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin.html'));
});


app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
