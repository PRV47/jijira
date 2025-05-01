const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  'mongodb+srv://JijiraAdmin:AdminJijira@jijiracluster.dzgs4bb.mongodb.net/?retryWrites=true&w=majority&appName=JijiraCluster',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const tareaSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  fechaLimite: String,
  estado: String,
});
const sprintSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: String,
  endDate: String,
  tareas: [tareaSchema],
});

const Tarea = mongoose.model('Tarea', tareaSchema);
const Sprint = mongoose.model('Sprint', sprintSchema);


function mapSprint(sprint) {
    const obj = sprint.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    if (obj.tareas) {
      obj.tareas = obj.tareas.map(mapTarea);
    }
    return obj;
  }
  function mapTarea(tarea) {
    const obj = tarea.toObject ? tarea.toObject() : tarea;
    obj.id = obj._id ? obj._id.toString() : obj.id;
    delete obj._id;
    delete obj.__v;
    return obj;
  }

// TAREAS CRUD
app.get('/tareas', async (req, res) => {
    const tareas = await Tarea.find();
    res.json(tareas.map(mapTarea));
  });
  app.post('/tareas', async (req, res) => {
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json(mapTarea(tarea));
  });
  app.put('/tareas/:id', async (req, res) => {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(mapTarea(tarea));
  });
  app.delete('/tareas/:id', async (req, res) => {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  });

// SPRINTS CRUD
app.get('/sprints', async (req, res) => {
    const sprints = await Sprint.find();
    res.json(sprints.map(mapSprint));
  });
  app.post('/sprints', async (req, res) => {
    const sprint = new Sprint(req.body);
    await sprint.save();
    res.json(mapSprint(sprint));
  });
  app.put('/sprints/:id', async (req, res) => {
    const { tareas, ...rest } = req.body;
    const sprint = await Sprint.findByIdAndUpdate(
      req.params.id,
      { ...rest, tareas: tareas || [] }, // fuerza el reemplazo del array
      { new: true }
    );
    res.json(mapSprint(sprint));
  });
  app.delete('/sprints/:id', async (req, res) => {
    await Sprint.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  });

app.listen(3001, () => console.log('API corriendo en http://localhost:3001'));