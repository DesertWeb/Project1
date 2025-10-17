import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));

let entities = [];
let nextId = 1;

app.get("/entities", (req, res) => res.json(entities));

app.get("/entities/:id", (req, res) => {
  const entity = entities.find(e => e.id === parseInt(req.params.id));
  if (!entity) return res.status(404).send("Not found");
  res.json(entity);
});

app.post("/entities", (req, res) => {
  const newEntity = { id: nextId++, ...req.body };
  entities.push(newEntity);
  res.status(201).json(newEntity);
});

app.put("/entities/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const idx = entities.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).send("Not found");
  entities[idx] = { ...entities[idx], ...req.body };
  res.json(entities[idx]);
});

app.delete("/entities/:id", (req, res) => {
  const id = parseInt(req.params.id);
  entities = entities.filter(e => e.id !== id);
  res.status(204).send();
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
