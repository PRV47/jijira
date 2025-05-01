import React from 'react';
import './TaskCardEstilo.css';
import visibilityIcon from '../../icons/visibility.svg';
import editNoteIcon from '../../icons/edit_note.svg';
import deleteIcon from '../../icons/delete.svg';
import chevronRightIcon from '../../icons/chevron_right.svg';
import { useTareaStore, useSprintStore, useBacklogStore } from '../../../store/store';
import Swal from "sweetalert2";
import { useTarea } from '../../../components/hooks/useTarea'; // Cambia la importación a `useTarea`
import { useSprint } from '../../hooks/useSprint';
import { SprintPut } from '../../../http/SprintPut'; // Importa la función para actualizar el sprint
import { ISprint } from '../../../types/ISprint'; // Importa el tipo ISprint
import { createTareaController } from '../../../data/proyectoController';
import { getSprintController } from '../../../data/proyectoController';


// Define the Task type
type Task = {
    id: string | number;
    title: string;
    description: string;
    dueDate: string;
    status: string;
};

export const TaskCard = ({ task }: { task: Task }) => {
    const selectedSprint = useSprintStore((state) => state.selectedSprint);
    const setOpenModal = useSprintStore((state) => state.setOpenModal);
    const setActiveTarea = useTareaStore((state) => state.setActiveTarea);
    const updateSprint = useSprintStore((state) => state.setArraySprints);
    const addTarea = useTareaStore((state) => state.addNewTarea);
    const sprints = useSprintStore((state) => state.sprints);
    const setSelectedSprint = useSprintStore((state) => state.setSelectedSprint);

    const { updateExistingTarea } = useTarea(); // Obtén la función desde el hook
    const { updateTareaInSprint } = useSprint();

    // Handler para enviar al backlog
    const handleSendToBacklog = async () => {
        if (!selectedSprint) {
            console.log("No hay sprint seleccionado");
            return;
        }
    
        console.log("Sprint seleccionado antes de eliminar tarea:", selectedSprint);
        console.log("Tarea a eliminar:", task);
    
        // Encuentra la tarea real en el sprint usando el título como identificador temporal
        const tareaEnSprint = selectedSprint.tareas.find(t => 
            t.titulo === task.title && 
            t.descripcion === task.description && 
            t.fechaLimite === task.dueDate
        );
        
        if (!tareaEnSprint) {
            console.error("No se encontró la tarea en el sprint");
            return;
        }
    
        // 1. Elimina la tarea del sprint usando el ID correcto
        const tareasActualizadas = selectedSprint.tareas.filter(t => t.id !== tareaEnSprint.id);
        console.log("Tareas actualizadas:", tareasActualizadas);
        
        const sprintActualizado = { ...selectedSprint, tareas: tareasActualizadas };
        console.log("Sprint actualizado:", sprintActualizado);
    
        // 2. Prepara la tarea para el backlog
        const tareaParaBacklog = {
            titulo: task.title,
            descripcion: task.description,
            fechaLimite: task.dueDate,
            estado: "backlog"
        };
        console.log("Tarea para backlog:", tareaParaBacklog);
    
        try {
            console.log("Intentando actualizar sprint en backend...");
            // Actualiza el sprint en el backend
            await SprintPut(sprintActualizado);
            console.log("Sprint actualizado en backend");
    
            console.log("Intentando crear tarea en backlog...");
            // Crea la tarea en el backend (backlog)
            await createTareaController(tareaParaBacklog);
            console.log("Tarea creada en backlog");
    
            console.log("Estado actual del store:", useSprintStore.getState());
            console.log("Intentando actualizar estado local...");
            // Actualiza el estado local usando la función correcta del store
            useSprintStore.getState().updateSprint(sprintActualizado);
            console.log("Estado local actualizado");
    
            console.log("Estado final del store:", useSprintStore.getState());
        } catch (error) {
            console.error("Error al enviar la tarea al backlog:", error);
        }
    };
    // Handler para ver tarea
    const handleView = () => {
        setActiveTarea({
            id: task.id.toString(),
            titulo: task.title,
            descripcion: task.description,
            fechaLimite: task.dueDate,
            estado: task.status
        });
        setOpenModal('verTarea');
    };

    // Handler para editar tarea
    const handleEdit = async () => {
        setActiveTarea({
            id: task.id.toString(),
            titulo: task.title,
            descripcion: task.description,
            fechaLimite: task.dueDate,
            estado: task.status
        });
        setOpenModal('editarTarea');

        const updatedTarea = {
            id: task.id.toString(),
            titulo: task.title,
            descripcion: task.description,
            fechaLimite: task.dueDate,
            estado: task.status
        };

        try {
            await updateExistingTarea(updatedTarea); // Actualiza en el servidor

            const tareasActualizadas = selectedSprint?.tareas.map(t =>
                t.id === task.id.toString() ? updatedTarea : t
            );
            const sprintActualizado: ISprint = {
                ...selectedSprint!, // Aseguramos que `selectedSprint` no sea null
                tareas: tareasActualizadas || [] // Garantizamos que `tareas` sea un array
            };

            // ✅ Usar hook directamente para evitar errores de getState
            const sprints = useSprintStore.getState().sprints;
            const setArraySprints = useSprintStore.getState().setArraySprints;

            const sprintsActualizados = sprints.map(sprint =>
                sprint.id === sprintActualizado.id ? sprintActualizado : sprint
            );
            setArraySprints(sprintsActualizados);

            console.log("Estado de la tarea actualizado:", updatedTarea);
        } catch (error) {
            console.error("Error al cambiar el estado de la tarea:", error);
        }
    };

    // Handler para eliminar tarea del sprint
    const handleDelete = async () => {
        if (!selectedSprint) return;
    
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará la tarea del Sprint y no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        });
    
        if (!confirm.isConfirmed) return;
    
        const tareasActualizadas = selectedSprint.tareas.filter(t => t.id !== task.id.toString());
        const sprintActualizado = { ...selectedSprint, tareas: tareasActualizadas };
    
        try {
            // Actualiza el servidor
            await SprintPut(sprintActualizado);
    
            // Recarga los sprints desde el backend para asegurar sincronía
            const sprintsActualizados = await getSprintController();
            useSprintStore.getState().setArraySprints(sprintsActualizados);
    
            Swal.fire("Eliminado", "La tarea fue eliminada del Sprint.", "success");
        } catch (error) {
            console.error("Error al eliminar la tarea del sprint:", error);
        }
    };

    const handleNextState = async () => {
        if (!selectedSprint) return;

        let nuevoEstado = "";
        if (task.status === "pendiente") {
            nuevoEstado = "en_progreso";
        } else if (task.status === "en_progreso") {
            nuevoEstado = "completado";
        } else {
            return;
        }

        const updatedTarea = {
            id: task.id.toString(),
            titulo: task.title,
            descripcion: task.description,
            fechaLimite: task.dueDate,
            estado: nuevoEstado,
        };

        try {
            await updateTareaInSprint(selectedSprint.id, updatedTarea);
            const tareasActualizadas = selectedSprint.tareas.map(t =>
                t.id === task.id.toString() ? updatedTarea : t
            );
            const sprintActualizado = { ...selectedSprint, tareas: tareasActualizadas };

            // Usa las variables ya obtenidas por los hooks
            const sprintsActualizados = sprints.map(sprint =>
                sprint.id === sprintActualizado.id ? sprintActualizado : sprint
            );
            updateSprint(sprintsActualizados);

        } catch (error) {
            console.error("Error al cambiar el estado de la tarea:", error);
        }
    };

    return (
        <div className="taskCard">
            <h5>Titulo: {task.title}</h5>
            <p>Descripcion: {task.description}</p>
            <p>Fecha limite: {task.dueDate}</p>
            <div className="taskCardButtons">
                <button className="btnBacklog" onClick={handleSendToBacklog}>
                    Enviar al Backlog
                </button>
                <button
                    className="btnChevron"
                    onClick={handleNextState}
                >
                    <img src={chevronRightIcon} alt="Siguiente estado" />
                </button>
                <button className="btnIcon" onClick={() => {
                    console.log("Botón 'Ver' presionado");
                    console.log("Tarea actual:", task);

                    handleView();
                }}>
                    <img src={visibilityIcon} alt="Ver" />
                </button>
                <button className="btnIcon" onClick={() => {
                    console.log("Botón 'Editar' presionado");
                    console.log("Tarea actual:", task);

                    handleEdit();
                }}>
                    <img src={editNoteIcon} alt="Editar" />
                </button>
                <button className="btnDelete" onClick={handleDelete}>
                    <img src={deleteIcon} alt="Eliminar" />
                </button>
            </div>
        </div>
    );
};