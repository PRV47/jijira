import axios from "axios";
import { ISprint } from "../types/ISprint";
import { API_URL } from "../utils/constants";

export const SprintPut = async (updatedSprint: ISprint) => {
    try {
        console.log("Enviando actualización de sprint al backend:", updatedSprint);
        const response = await axios.put(`${API_URL}/sprints/${updatedSprint.id}`, updatedSprint);
        console.log("Respuesta del backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error en SprintPut:", error);
        if (axios.isAxiosError(error)) {
            console.error("Detalles del error:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        }
        throw error;
    }
};