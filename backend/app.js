const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key";

const app = express();
const PORT = 4000;

// ใช้ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "data")));

// เส้นทางของไฟล์ JSON
const cartFilePath = path.join(__dirname, "data/cart.json");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).send("Invalid token.");
        }

        req.user = user; // เก็บข้อมูลผู้ใช้ที่ถูกถอดรหัสจาก Token
        next();
    });
}

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

app.post("/add-to-cart", (req, res) => {
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

app.get("/checkout", (req, res) => {
    fs.readFile(cartFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading cart file:", err);
            return res.status(500).send("Could not read cart file.");
        }

        const cart = JSON.parse(data || "[]");
        res.json(cart);
    });
});

app.delete("/cart", (req, res) => {
    fs.writeFile(cartFilePath, "[]", "utf8", (err) => {
        if (err) {
            console.error("Error clearing cart file:", err);
            return res.status(500).send("Could not clear cart.");
        }

        res.send("Cart cleared successfully.");
    });
});


const usersFile = path.join(__dirname, "data", "users.json");

// Helper functions
const readUsers = () => {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile));
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Register route
app.post("/", (req, res) => {
  const { firstName, lastName, email, password, occupationCategory, occupation } = req.body;
  const users = readUsers();

  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = { firstName, lastName, email, password, occupationCategory, occupation };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: "Registered successfully!" });
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find((user) => user.email === email && user.password === password);

  if (user) {
    return res.status(200).json({ message: "Login successful!" });
  }

  res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: "1h" });

  res.json({ message: "Login successful", token });

});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
