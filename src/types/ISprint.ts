import { ITarea } from "./ITarea"

export interface ISprint {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    tareas: ITarea[];
}