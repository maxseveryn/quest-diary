const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_DIR = path.join(__dirname, "data");
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");
const COMPLETED_FILE = path.join(DATA_DIR, "completed_tasks.json");
const PROFILE_FILE = path.join(DATA_DIR, "profile.json");

app.use(cors());
app.use(express.json());

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(TASKS_FILE)) fs.writeFileSync(TASKS_FILE, "[]");
if (!fs.existsSync(COMPLETED_FILE)) fs.writeFileSync(COMPLETED_FILE, "[]");
if (!fs.existsSync(PROFILE_FILE)) {
  fs.writeFileSync(
    PROFILE_FILE,
    JSON.stringify(
      { name: "", age: null, status: "Unknown", completed: 0 },
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

app.get("/api/completed", (req, res) => {
  const completed = JSON.parse(fs.readFileSync(COMPLETED_FILE));
  res.json(completed);
});

app.post("/api/tasks/:id/complete", (req, res) => {
  const taskId = parseInt(req.params.id);
  const tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
  const completedTasks = JSON.parse(fs.readFileSync(COMPLETED_FILE));

  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const [completedTask] = tasks.splice(taskIndex, 1);
  completedTask.completed = true;
  completedTasks.push(completedTask);

  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  fs.writeFileSync(COMPLETED_FILE, JSON.stringify(completedTasks, null, 2));
  res.status(200).json({ success: true, task: completedTask });
});

app.delete("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);

  const tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
  const completed = JSON.parse(fs.readFileSync(COMPLETED_FILE));

  const taskToMove = tasks.find((task) => task.id === taskId);
  if (!taskToMove) return res.status(404).json({ error: "Task not found" });

  const updatedTasks = tasks.filter((task) => task.id !== taskId);
  const updatedCompleted = [...completed, taskToMove];

  fs.writeFileSync(TASKS_FILE, JSON.stringify(updatedTasks, null, 2));
  fs.writeFileSync(COMPLETED_FILE, JSON.stringify(updatedCompleted, null, 2));

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
