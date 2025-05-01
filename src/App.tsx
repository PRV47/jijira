import './App.css'
import { Backlog } from './components/screens/Backlog'
import { SideBar } from './components/ui/SideBar/SideBar'
import { NavBar } from './components/ui/NavBar/NavBar'
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NuevaPantalla } from './components/screens/NuevaPantalla'
import { useAppStore } from './store/SprintStore'
import { ISprint } from './types/ISprint'
import { useSprintStore } from './store/store'
import { ErrorPage } from './components/screens/ErrorPage'
import { getSprintController } from './data/proyectoController';

function App() {
  const addSprint = useSprintStore((state) => state.addSprint)

  useEffect(() => {
    getSprintController()
      .then((sprints) => {
        if (Array.isArray(sprints)) {
          sprints.forEach(addSprint);
          console.log("Sprints cargados:", sprints);
        } else {
          console.error("La propiedad 'sprints' no es un array");
        }
      })
      .catch(err => console.error("Error cargando sprints:", err));
}, [addSprint]);

  return (
    <Router>
      <div className='parent'>
        <div className='navBar'>
          <NavBar></NavBar>
        </div>
        <div className='pantallaPrincipal'>
          <Routes>
            <Route path="/" element={<Backlog />} />
            <Route path="/nueva-pantalla/:idSprint" element={<NuevaPantalla />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </div>
        <div className='sideBar'>
          <SideBar></SideBar>
        </div>
      </div>
    </Router>
  )
}

export default App
