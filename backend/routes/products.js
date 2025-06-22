
const express = require('express');
const router = express.Router();

let products = [
    { id: 1, name: "Product 1", description: "Description 1", category: ["Adventure", "Racing"], price: 100 , image: "assets/images/trending-01.jpg"},
    { id: 2, name: "Product 2", description: "Description 2", category: ["Strategy"], price: 200 , image: "assets/images/trending-02.jpg"},
    { id: 3, name: "Product 3", description: "Description 3", category: ["Strategy", "Racing"], price: 300 , image: "assets/images/trending-03.jpg"},
    { id: 4, name: "Product 4", description: "Description 4", category: ["Racing"], price: 200 , image: "assets/images/trending-04.jpg"},
    { id: 5, name: "Product 5", description: "Description 5", category: ["Adventure", "Strategy"], price: 100 , image: "assets/images/top-game-01.jpg"},
    { id: 6, name: "Product 6", description: "Description 6", category: ["Adventure"], price: 100 , image: "assets/images/top-game-02.jpg"},
    { id: 7, name: "Product 7", description: "Description 7", category: ["Racing"], price: 200 , image: "assets/images/top-game-03.jpg"},
    { id: 8, name: "Product 8", description: "Description 8", category: ["Strategy"], price: 300 , image: "assets/images/top-game-04.jpg"},
    { id: 9, name: "Product 9", description: "Description 9", category: ["Adventure", "Racing"], price: 100 , image: "assets/images/top-game-05.jpg"},
    { id: 10, name: "Product 10", description: "Description 10", category: ["Adventure", "Strategy"], price: 200 , image: "assets/images/top-game-06.jpg"}
];

router.get('/products', (req, res) => {
  res.json(products);
});

router.post('/products/update', (req, res) => {
  const updatedList = req.body;
  products = updatedList; 
  res.json({ success: true });
});

module.exports = router;
