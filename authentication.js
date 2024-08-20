import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const users = [
  {
    id: "66cbe771-2129-4eac-95ea-4b9ea6317c72",
    email: "admin@mail.com",
    username: "admin",
    password: "1234",
  },
];

// Register
app.post("/api/register", (req, res) => {
  const { email, username, password } = req.body;

  // Check if the email or username is already registered
  const existingUser = users.find(
    (user) => user.email === email || user.username === username
  );
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email or username already registered" });
  }

  // Generate a unique ID and store the user
  const newUser = {
    id: uuidv4(),
    email,
    username,
    password,
  };

  users.push(newUser);
  res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Find the user by email and password
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({
    message: "Login successful",
    userId: user.id,
    username: user.username,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
