const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// ใช้ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "data")));

// เส้นทางของไฟล์ JSON
const cartFilePath = path.join(__dirname, "data", "cart.json");

// อ่านตะกร้าสินค้าจากไฟล์
app.get("/cart", (req, res) => {
    fs.readFile(cartFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading cart file:", err);
            return res.status(500).send("Could not read cart file.");
        }

        res.json(JSON.parse(data));
    });
});

// บันทึกตะกร้าสินค้าไปยังไฟล์
app.post("/cart", (req, res) => {
    const newCartData = req.body;

    // อ่านข้อมูลเก่าจาก cart.json
    fs.readFile(cartFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading cart file:", err);
            return res.status(500).send("Could not read cart file.");
        }

        const currentCart = JSON.parse(data || "[]");

        // รวมสินค้าใหม่กับสินค้าที่มีอยู่ในตะกร้า
        newCartData.forEach(newItem => {
            const existingItem = currentCart.find(item => item.id === newItem.id);
            if (existingItem) {
                existingItem.quantity += newItem.quantity; // อัปเดตจำนวนสินค้า
            } else {
                currentCart.push(newItem); // เพิ่มสินค้าใหม่
            }
        });

        // เขียนข้อมูลใหม่กลับไปยัง cart.json
        fs.writeFile(cartFilePath, JSON.stringify(currentCart, null, 2), "utf8", (err) => {
            if (err) {
                console.error("Error saving cart file:", err);
                return res.status(500).send("Could not save cart file.");
            }

            res.send("Cart updated successfully.");
        });
    });
});

app.delete("/cart/:id", (req, res) => {
    const productId = parseInt(req.params.id);

    // อ่านข้อมูลปัจจุบันใน cart.json
    fs.readFile(cartFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading cart file:", err);
            return res.status(500).send("Could not read cart file.");
        }

        let currentCart = JSON.parse(data || "[]");

        // กรองสินค้าที่ไม่ต้องการลบออก
        const updatedCart = currentCart.filter(item => item.id !== productId);

        // เขียนข้อมูลใหม่กลับไปยัง cart.json
        fs.writeFile(cartFilePath, JSON.stringify(updatedCart, null, 2), "utf8", (err) => {
            if (err) {
                console.error("Error saving cart file:", err);
                return res.status(500).send("Could not save cart file.");
            }

            res.send("Product removed successfully.");
        });
    });
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
