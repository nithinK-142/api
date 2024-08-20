import express, { json } from "express";
import { createConnection } from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(json());

const db = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "angular",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
    return;
  }
  console.log("Connected to database");
});

// CRUD operations

app.get("/", (_req, res) => res.send("Hello from server!"));

app.get("/users", (_req, res) => {
  db.query("SELECT * FROM `angular-db`", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

app.post("/users", (req, res) => {
  const { username, password } = req.body;
  console.log("creating user backend");
  db.query(
    "INSERT INTO `angular-db` (username, password) VALUES (?, ?)",
    [username, password],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: result.insertId, username, password });
      }
    }
  );
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  db.query(
    "UPDATE `angular-db` SET username = ?, password = ? WHERE id = ?",
    [username, password, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id, username, password });
      }
    }
  );
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM `angular-db` WHERE id = ?", [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
