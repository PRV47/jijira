import { useTareaStore, useBacklogStore } from "../../store/store";
import { createTareaController, getTareaController, updateTareaController, deleteTareaController } from "../../data/proyectoController";
import { ITarea } from "../../types/ITarea";
import Swal from "sweetalert2";
import { useEffect } from "react";

export const useTarea = () => {
    const tareas = useTareaStore((state) => state.tareas);
    const setArrayTareas = useTareaStore((state) => state.setArrayTareas);
    const addNewTarea = useTareaStore((state) => state.addNewTarea);
    const deleteTarea = useTareaStore((state) => state.deleteTarea);
    const editTarea = useTareaStore((state) => state.editTarea);

    const backlog = useBacklogStore((state) => state.backlog);
    const setBacklog = useBacklogStore((state) => state.setBacklog);

    const getTareas = async () => {
        try {
            const data = await getTareaController();
            setBacklog(data);
        } catch (error) {
            console.error("Error en getTareas:", error);
        }
    };

    useEffect(() => {
        getTareas();
    }, []);

    const addTarea = async (newTarea: ITarea) => {
        try {
            const createdTarea = await createTareaController(newTarea);
            setBacklog([...backlog, createdTarea]);
        } catch (error) {
            console.error("Error en addTarea:", error);
        }
    };

    const updateExistingTarea = async (updatedTarea: ITarea) => {
        const previousTarea = backlog.find((el) => el.id === updatedTarea.id);
        if (previousTarea) {
            const updatedBacklog = backlog.map((tarea) =>
                tarea.id === updatedTarea.id ? updatedTarea : tarea
            );
            setBacklog(updatedBacklog);
            try {
                await updateTareaController(updatedTarea);
            } catch (error) {
                setBacklog(backlog);
                console.error("Error en updateExistingTarea:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudo actualizar la tarea. Por favor, inténtalo de nuevo.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            }
        } else {
            console.warn("Tarea no encontrada para actualizar.");
        }
    };

    const deleteExistingTarea = async (idTareaToDelete: string) => {
        const previousTarea = backlog.find((tarea) => tarea.id === idTareaToDelete);
        Swal.fire({
            title: "¿Estas seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (previousTarea) {
                    const updatedBacklog = backlog.filter((tarea) => tarea.id !== idTareaToDelete);
                    setBacklog(updatedBacklog);
                    try {
                        await deleteTareaController(idTareaToDelete);
                    } catch (error) {
                        setBacklog(backlog);
                        console.error("Error en deleteExistingTarea:", error);
                        Swal.fire({
                            title: "Error",
                            text: "No se pudo eliminar la tarea. Por favor, inténtalo de nuevo.",
                            icon: "error",
                            confirmButtonText: "Aceptar",
                        });
                    }
                }
                Swal.fire({
                    title: "Eliminado!",
                    text: "Tu tarea fue eliminada.",
                    icon: "success",
                });
            }
        });
    };

    return {
        backlog,
        getTareas,
        addTarea,
        updateExistingTarea,
        deleteExistingTarea,
    };
};