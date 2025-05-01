import { create } from 'zustand';
import { ITarea } from '../types/ITarea';
import { ISprint } from '../types/ISprint';

// --- TAREA STORE ---

interface TareaState {
    tareas: ITarea[];
    activeTarea: ITarea | null;
    setArrayTareas: (tareas: ITarea[]) => void;
    setActiveTarea: (tarea: ITarea | null) => void;
    addNewTarea: (tarea: ITarea) => void;
    editTarea: (tarea: ITarea) => void;
    deleteTarea: (id: string) => void;
}

const useTareaStore = create<TareaState>((set) => ({
    tareas: [],
    activeTarea: null,
    setArrayTareas: (tareas) => set({ tareas }),
    setActiveTarea: (tarea) => set({ activeTarea: tarea }),
    addNewTarea: (tarea) =>
        set((state) => ({ tareas: [...state.tareas, tarea] })),
    editTarea: (tarea) =>
        set((state) => ({
            tareas: state.tareas.map((t) => (t.id === tarea.id ? tarea : t)),
        })),
    deleteTarea: (id) =>
        set((state) => ({
            tareas: state.tareas.filter((t) => t.id !== id),
        })),
}));

// --- SPRINT STORE ---

interface SprintState {
    sprints: ISprint[];
    selectedSprint: ISprint | null;
    openModal: string | null; // Nueva propiedad para manejar el estado del modal
    setArraySprints: (sprints: ISprint[]) => void;
    setSelectedSprint: (sprint: ISprint | null) => void; // Asegúrate de que acepte `null`
    setOpenModal: (modal: string | null) => void; // Nueva función para actualizar el estado del modal
    addSprint: (sprint: ISprint) => void; // Agregar un nuevo sprint
    updateSprint: (updatedSprint: ISprint) => void; // Actualizar un sprint existente
    removeSprint: (id: string) => void; // Eliminar un sprint por ID
}

const useSprintStore = create<SprintState>((set) => ({
    sprints: [],
    selectedSprint: null,
    openModal: null, // Estado inicial del modal
    setArraySprints: (sprints) => {
        console.log("Actualizando lista de sprints:", sprints);
        set({ sprints });
    },
    setSelectedSprint: (sprint) => set({ selectedSprint: sprint }),
    setOpenModal: (modal) => set({ openModal: modal }), // Implementación de la función
    addSprint: (sprint) =>
        set((state) => ({
            sprints: state.sprints.some((s) => s.id === sprint.id)
                ? state.sprints // Evita duplicados
                : [...state.sprints, sprint],
        })), // Agregar un nuevo sprint
    updateSprint: (updatedSprint) => {
        console.log("Actualizando sprint:", updatedSprint);
        set((state) => {
            const sprintsActualizados = state.sprints.map((sprint) =>
                sprint.id === updatedSprint.id ? updatedSprint : sprint
            );
            return { sprints: sprintsActualizados, selectedSprint: updatedSprint };
        });
    }, // Actualizar un sprint existente
    removeSprint: (id) =>
        set((state) => ({
            sprints: state.sprints.filter((sprint) => sprint.id !== id),
        })), // Eliminar un sprint por ID
}));

// --- BACKLOG STORE ---

interface BacklogState {
    backlog: ITarea[];
    setBacklog: (tareas: ITarea[]) => void;
}

const useBacklogStore = create<BacklogState>((set) => ({
    backlog: [],
    setBacklog: (tareas) => set({ backlog: tareas }),
}));

// --- EXPORTACIÓN UNIFICADA ---

export {
    useTareaStore,
    useSprintStore,
    useBacklogStore // Exportamos el nuevo store
};