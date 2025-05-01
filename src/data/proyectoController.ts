import axios from "axios";
import { ITarea } from "../types/ITarea";
import { API_URL } from '../utils/constants';
import { ISprint } from "../types/ISprint";

export const getTareaController = async (): Promise<ITarea[]> => {
    const response = await axios.get(`${API_URL}/tareas`);
    return response.data;
};

export const createTareaController = async (newTarea: ITarea): Promise<ITarea> => {
    const response = await axios.post(`${API_URL}/tareas`, newTarea);
    return response.data;
};

export const updateTareaController = async (updatedTarea: ITarea): Promise<void> => {
    await axios.put(`${API_URL}/tareas/${updatedTarea.id}`, updatedTarea);
};

export const deleteTareaController = async (idDeletedTarea: string): Promise<void> => {
    await axios.delete(`${API_URL}/tareas/${idDeletedTarea}`);
};

export const getSprintController = async (): Promise<ISprint[]> => {
    const response = await axios.get(`${API_URL}/sprints`);
    return response.data;
};

export const createSprintController = async (newSprint: ISprint): Promise<ISprint> => {
    const response = await axios.post(`${API_URL}/sprints`, newSprint);
    return response.data;
};

export const updateSprintController = async (updatedSprint: ISprint): Promise<void> => {
    await axios.put(`${API_URL}/sprints/${updatedSprint.id}`, updatedSprint);
};

export const deleteSprintController = async (idSprintToDelete: string): Promise<void> => {
    await axios.delete(`${API_URL}/sprints/${idSprintToDelete}`);
};

export const updateTareaInSprintController = async (sprintId: string, updatedTarea: ITarea): Promise<void> => {
    try {
        // Obtén el sprint actual
        const sprintResponse = await axios.get(`${API_URL}/sprints`);
        const sprint = sprintResponse.data.find((s: any) => s.id === sprintId);
        if (!sprint) throw new Error("Sprint no encontrado");

        // Actualiza la tarea dentro del sprint
        const tareasActualizadas = sprint.tareas.map((t: ITarea) =>
            t.id === updatedTarea.id ? updatedTarea : t
        );
        const sprintActualizado = { ...sprint, tareas: tareasActualizadas };

        // Actualiza el sprint en el backend
        await axios.put(`${API_URL}/sprints/${sprintId}`, sprintActualizado);
    } catch (error) {
        console.error("Error en updateTareaInSprintController:", error);
        throw new Error("No se pudo actualizar la tarea en el sprint.");
    }
};