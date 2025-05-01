import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./SprintsEstilo.css";
import { useSprintStore } from '../../store/store';
import { TaskCard } from '../ui/TaskCard/TaskCard';
import { CrearTareaModal } from '../ui/modals/CrearTareaModal/CrearTareaModal';
import { VerTareaModal } from '../ui/modals/VerTareaModal/VerTareaModal';
import { useParams, useNavigate } from 'react-router-dom';

export function NuevaPantalla() {
    const openModal = useSprintStore((state) => state.openModal);
    const setOpenModal = useSprintStore((state) => state.setOpenModal);
    const selectedSprint = useSprintStore((state) => state.selectedSprint);
    const setSelectedSprint = useSprintStore((state) => state.setSelectedSprint);
    const sprints = useSprintStore((state) => state.sprints);
    const [openCrearTareaModal, setOpenCrearTareaModal] = useState(false);
    const { idSprint } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (idSprint && sprints.length > 0) {
            const sprint = sprints.find((s) => String(s.id) === idSprint);
            if (sprint) {
                setSelectedSprint(sprint);
            } else {
                console.warn("No se encontró un sprint con el ID:", idSprint);
                navigate("/error");
            }
        }
    }, [idSprint, sprints, setSelectedSprint, navigate]);

    return (
        <>
            <div className="pantallaPrincipal">
                {selectedSprint ? (
                    <div className="sprintDetails">
                        <div className="headerSprintDetails">
                            <h2>Nombre de la Sprint: {selectedSprint.title}</h2>
                            <div className="crearTareaContainer">
                                <h3>Tareas en la Sprint</h3>
                                <button
                                    className="botonCrearTarea"
                                    onClick={() => setOpenCrearTareaModal(true)}
                                >
                                    Agregar tarea al Sprint
                                </button>
                            </div>
                        </div>
                        <div className="columnsContainer">
                            <div className="column pendiente">
                                <h4>Pendiente</h4>
                                {selectedSprint.tareas
                                    .filter((tarea) => tarea.estado === "pendiente")
                                    .map((tarea) => (
                                        <TaskCard
                                            key={tarea.id}
                                            task={{
                                                title: tarea.titulo,
                                                description: tarea.descripcion,
                                                dueDate: tarea.fechaLimite,
                                                status: tarea.estado as "pendiente" | "backlog" | "en_progreso" | "completado",
                                                id: Number(tarea.id) ?? 0
                                            }}
                                        />
                                    ))}
                            </div>
                            <div className="column enProgreso">
                                <h4>En progreso</h4>
                                {selectedSprint.tareas
                                    .filter((tarea) => tarea.estado === "en_progreso")
                                    .map((tarea) => (
                                        <TaskCard
                                            key={tarea.id}
                                            task={{
                                                title: tarea.titulo,
                                                description: tarea.descripcion,
                                                dueDate: tarea.fechaLimite,
                                                status: tarea.estado as "pendiente" | "backlog" | "en_progreso" | "completado",
                                                id: Number(tarea.id) ?? 0
                                            }}
                                        />
                                    ))}
                            </div>
                            <div className="column completado">
                                <h4>Completado</h4>
                                {selectedSprint.tareas
                                    .filter((tarea) => tarea.estado === "completado")
                                    .map((tarea) => (
                                        <TaskCard
                                            key={tarea.id}
                                            task={{
                                                title: tarea.titulo,
                                                description: tarea.descripcion,
                                                dueDate: tarea.fechaLimite,
                                                status: tarea.estado as "pendiente" | "backlog" | "en_progreso" | "completado",
                                                id: Number(tarea.id) ?? 0
                                            }}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Selecciona una Sprint para ver los detalles.</p>
                )}
            </div>
            {openCrearTareaModal && selectedSprint && (
                <CrearTareaModal
                    modalClass="formularioModal nuevaClase"
                    handleCloseCrearTareaModal={() => setOpenCrearTareaModal(false)}
                    sprintId={selectedSprint.id}
                />
            )}
            {openModal === 'verTarea' && (
                <VerTareaModal
                    modalClass="verModal nuevaClase"
                    handleCloseVerTareaModal={() => setOpenModal(null)}
                />
            )}
            {openModal === 'editarTarea' && (
                <CrearTareaModal
                    modalClass="formularioModal nuevaClase"
                    handleCloseCrearTareaModal={() => setOpenModal(null)}
                    sprintId={selectedSprint?.id}
                />
            )}
        </>
    );
}