const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const productsFilePath = path.join(__dirname, "../products.js");


function getProducts() {
  delete require.cache[require.resolve("../products")]; 
  return require("../products");
}


function saveToJSFile(products) {
  const jsContent = "const products = " + JSON.stringify(products, null, 2) + ";\n\nmodule.exports = products;\n";
  fs.writeFileSync(productsFilePath, jsContent, "utf8");
}


router.get("/products", (req, res) => {
  const products = getProducts();
  res.json(products);
});


router.post("/products/update", (req, res) => {
  const newProducts = req.body;
  saveToJSFile(newProducts);
  res.json({ success: true });
});

module.exports = router;
