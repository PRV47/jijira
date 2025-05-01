# Proyecto JIJIRA - Piers Rideout, Rmairo Ferrari, Nazareno Fiorreti

Aplicacion para gestion de tareas y sprints, desarrollada con React, TypseScript y MongoDB

## Requisitos Previos

- Node.js
- MongoDB Atlas
- Postman

Para ver la pagina usando vite, ejecutar:
```bash
npm run dev
```

Si no tiene Vite, ejecutar primero:
```bash
npm install
```
La aplicación se iniciará en http://localhost:5173

Para iniicar el servidor, correr:
```bash
cd server
node index.js
```
El servidor se iniciará en http://localhost:3001


### Endpoints
#### Tareas
- GET `http://localhost:3001/tareas` - Obtener todas las tareas
- POST `http://localhost:3001/tareas` - Crear una nueva tarea
  ```json
  {
    "titulo": "Tarea de prueba",
    "descripcion": "Descripción de prueba",
    "fechaLimite": "2025-05-10",
    "estado": "backlog"
  }
  ```
- PUT `http://localhost:3001/tareas/:id` - Actualiza una tarea
- DELETE `http://localhost:3001/tareas/:id` - Elimina una tarea

#### Sprints
- GET `http://localhost:3001/sprints` - Obtener todas las sprints
- POST `http://localhost:3001/sprints` - Crear una nueva sprint
  ```json
  {
    "title": "Sprint de prueba",
    "description": "Descripción del sprint",
    "startDate": "2025-05-10",
    "endDate": "2025-05-15",
    "tareas": []
  }
  ```
- PUT `http://localhost:3001/sprints/:id` - Actualiza una sprint
- DELETE `http://localhost:3001/sprints/:id` - Elimina una sprint
