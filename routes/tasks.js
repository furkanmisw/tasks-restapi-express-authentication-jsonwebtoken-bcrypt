const Err = require("../mw/err");
const { tokens, tasks } = require("../src/data");
const { decode } = require("../utils/jwt");
const crypto = require("crypto");
const router = require("express").Router();

router.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Err(401, "Token is missing");

  if (tokens.filter((_token) => _token.token === token).length === 0) {
    throw new Err(401, "Unauthorized");
  }
  req.username = decode(token).username;
  next();
});

router.get("/", (req, res) => {
  const username = req.username;
  const _tasks = tasks.filter((_task) => _task.username === username);
  res.status(200).json({
    tasks: _tasks,
  });
});

router.get("/:taskid", (req, res) => {
  const taskid = req.params.taskid;
  const _task = tasks.find((_task) => _task.id === taskid);
  if (!_task) throw new Err(404, "Task not found");
  res.status(200).json({
    task: _task,
  });
});

router.post("/", (req, res) => {
  const id = crypto.randomBytes(16).toString("hex");
  const username = req.username;
  const _task = req.body.task;
  if (!_task) throw new Err(400, "Task is missing");
  const task = {
    username,
    id,
    task: _task,
    completed: false,
    createdDate: new Date().toLocaleString(),
  };
  tasks.push(task);
  res.status(201).json({ task });
});

router.patch("/:taskid", (req, res) => {
  const taskid = req.params.taskid;

  const { completed, task } = req.body;

  const currentTask = tasks.find((_task) => _task.id === taskid);

  if (!currentTask) throw new Err(404, "Task not found");

  if (!task && typeof completed !== "boolean")
    throw new Err(400, "Task or completed must be provided");

  if (!(typeof completed === "boolean" || typeof completed === "undefined"))
    throw new Err(400, "Completed must be boolean");

  const newTask = {
    completed: completed ?? false,
    task: task ?? currentTask.task,
  };

  const newTasks = tasks.map((_task) => {
    if (_task.id === taskid) {
      return { ...currentTask, ...newTask };
    }
    return _task;
  });
  tasks.splice(0, tasks.length, ...newTasks);
  res.send({
    task: { ...currentTask, ...newTask },
  });
});

router.delete("/:taskid", (req, res) => {
  const taskid = req.params.taskid;
  const _task = tasks.find((_task) => _task.id === taskid);
  if (!_task) throw new Err(404, "Task not found");
  const newTasks = tasks.filter((_task) => _task.id !== taskid);
  tasks.splice(0, tasks.length, ...newTasks);
  res.status(204).json({
    task: _task,
  });
});
module.exports = router;
