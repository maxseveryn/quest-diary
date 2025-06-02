const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const TASKS_FILE = path.join(__dirname, "data", "tasks.json");
const PROFILE_FILE = "./data/profile.json";

app.use(cors());
app.use(express.json());

if (!fs.existsSync("./data")) fs.mkdirSync("./data");
if (!fs.existsSync(TASKS_FILE)) fs.writeFileSync(TASKS_FILE, "[]");
if (!fs.existsSync(PROFILE_FILE)) {
  fs.writeFileSync(
    PROFILE_FILE,
    JSON.stringify(
      {
        name: "",
        age: null,
        status: "Unknown",
        completed: 0,
      },
      null,
      2
    )
  );
}

app.get("/api/tasks", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { text } = req.body;
  const tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
  const newTask = { id: Date.now(), text, completed: false };
  tasks.push(newTask);
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  res.status(201).json(newTask);
});

app.delete("/api/tasks/:id", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
  const taskId = parseInt(req.params.id);
  const updated = tasks.filter((task) => task.id !== taskId);
  fs.writeFileSync(TASKS_FILE, JSON.stringify(updated, null, 2));
  res.status(200).json({ success: true });
});

app.get("/api/profile", (req, res) => {
  const data = JSON.parse(fs.readFileSync(PROFILE_FILE, "utf8"));
  res.json(data);
});

app.post("/api/profile", (req, res) => {
  const profile = req.body;
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2));
  res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
