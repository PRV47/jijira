import { create } from 'zustand';
import { ISprint } from '../types/ISprint';

export type Task = {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    status: 'pendiente' | 'backlog' | 'en progreso' | 'completado';
};

export type AppState = {
    openModal: string | null;
    setOpenModal: (modalName: string | null) => void;
    sprints: ISprint[];
    addSprint: (sprint: ISprint) => void;
    updateSprint: (updatedSprint: ISprint) => void;
    selectedSprint: ISprint | null;
    setSelectedSprint: (sprint: ISprint | null) => void;
    removeSprint: (sprintId: number) => void;
    tasks: Task[];
    addTask: (task: Task) => void;
};

export const useAppStore = create<AppState>((set) => ({
    openModal: null,
    setOpenModal: (modalName) => set({ openModal: modalName }),
    sprints: [],
    addSprint: (sprint) =>
        set((state) => ({
            sprints: [...state.sprints, sprint],
        })),
    updateSprint: (updatedSprint) =>
        set((state) => ({
            sprints: state.sprints.map((sprint) =>
                sprint.id === updatedSprint.id ? updatedSprint : sprint
            ),
        })),
    selectedSprint: null,
    setSelectedSprint: (sprint) => set({ selectedSprint: sprint }),
    removeSprint: (sprintId) =>
        set((state) => ({
            sprints: state.sprints.filter((sprint) => sprint.id !== sprintId.toString()),
        })),
    tasks: [],
    addTask: (task) =>
        set((state) => ({
            tasks: [...state.tasks, task],
        })),
}));
