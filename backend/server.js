const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
