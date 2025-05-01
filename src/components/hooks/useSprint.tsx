import { useSprintStore } from "../../store/store";
import { getSprintController, createSprintController, updateSprintController, deleteSprintController, updateTareaInSprintController } from "../../data/proyectoController";
import { ISprint } from "../../types/ISprint";
import { ITarea } from "../../types/ITarea";
import Swal from "sweetalert2";

export const useSprint = () => {
    const sprints = useSprintStore((state) => state.sprints);
    const setArraySprints = useSprintStore((state) => state.setArraySprints);
    const addSprint = useSprintStore((state) => state.addSprint);
    const updateSprint = useSprintStore((state) => state.updateSprint);
    const removeSprint = useSprintStore((state) => state.removeSprint);

    const getSprints = async () => {
        const data = await getSprintController();
        if (data) setArraySprints(data);
    };

    const addNewSprint = async (newSprint: ISprint): Promise<ISprint> => {
        try {
            const createdSprint = await createSprintController(newSprint) as unknown as ISprint;
            return createdSprint;
        } catch (error) {
            console.error("Error en addNewSprint:", error);
            throw error;
        }
    };

    const updateExistingSprint = async (updatedSprint: ISprint) => {
        const previousSprint = sprints.find((el) => el.id === updatedSprint.id);
        if (previousSprint) {
            updateSprint(updatedSprint);
            try {
                await updateSprintController(updatedSprint);
            } catch (error) {
                updateSprint(previousSprint);
                console.error("Error en updateExistingSprint:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudo actualizar el sprint. Por favor, inténtalo de nuevo.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            }
        } else {
            console.warn("Sprint no encontrado para actualizar.");
        }
    };

    const deleteExistingSprint = async (idSprintToDelete: string) => {
        const previousSprint = sprints.find((sprint) => sprint.id === idSprintToDelete);

        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed && previousSprint) {
                removeSprint(idSprintToDelete);
                try {
                    await deleteSprintController(idSprintToDelete);
                } catch (error) {
                    addSprint(previousSprint);
                    console.error("Error en deleteExistingSprint:", error);
                }
                Swal.fire("Eliminado", "El sprint ha sido eliminado.", "success");
            }
        });
    };

    const updateTareaInSprint = async (sprintId: string, updatedTarea: ITarea) => {
        const sprint = sprints.find((s) => s.id === sprintId);
        if (sprint) {
            const updatedSprint = {
                ...sprint,
                tareas: sprint.tareas.map((t) =>
                    t.id === updatedTarea.id ? updatedTarea : t
                ),
            };
            updateSprint(updatedSprint);
            try {
                await updateTareaInSprintController(sprintId, updatedTarea);
            } catch (error) {
                console.error("Error en updateTareaInSprint:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudo actualizar la tarea en el servidor.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            }
        }
    };

    return {
        sprints,
        getSprints,
        addNewSprint,
        updateExistingSprint,
        deleteExistingSprint,
        updateTareaInSprint,
    };
};