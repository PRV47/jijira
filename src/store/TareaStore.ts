import {create} from 'zustand';
import { ITarea } from '../types/ITarea'

interface ITareaStore {

  tareas: ITarea[]
  activeTarea: ITarea | null
  tareaPendiente: ITarea | null
  tareaEnProgreso: ITarea | null
  tareaCompletada: ITarea | null
  setActiveTarea: (tarea: ITarea | null) => void
  setTareaPendiente: (tareaPendiente: ITarea | null) => void
  setTareaEnProgeso: (tareaEnProgeso: ITarea | null) => void
  setTareaCompletada: (tareaCompletada: ITarea | null) => void
  setArrayTareas: (arrayDeTareas: ITarea[]) => void
  addNewTarea: (tarea: ITarea) => void
  editTarea: (updatedTarea: ITarea) => void
  deleteTarea: (idTarea: string) => void

}
export const TareaStore = create<ITareaStore>((set) => ({
  tareas: [],
  activeTarea: null,
  tareaPendiente: null,
  tareaEnProgreso: null,
  tareaCompletada: null,

  setArrayTareas: (arrayDeTareas) => set(() => ({tareas: arrayDeTareas})),

  addNewTarea: (newTarea) => set((state) => ({tareas: [... state.tareas, newTarea]})),
  setActiveTarea: (activeTareaIn) => set(() => ({ activeTarea: activeTareaIn })),
  
  editTarea: (editedTarea) => 
    set((state) => {

      const arregloTareas = state.tareas.map((tarea) =>
          tarea.id === editedTarea.id ? {... tarea, ... editedTarea} : tarea
      )
      return {tareas : arregloTareas}

    }),

  deleteTarea: (idTarea) => set((state) => {
      const arregloTareas = state.tareas.filter((tarea) => 
          tarea.id != idTarea


      )
      return {tareas: arregloTareas}
  }),

  setTareaPendiente: (tareaPendienteIn) => set(() => ({tareaPendiente: tareaPendienteIn})),
  setTareaEnProgeso: (tareaEnProgresoIn) => set(() => ({tareaEnProgreso: tareaEnProgresoIn})),
  setTareaCompletada: (tareaCompletadaIn) => set(() => ({tareaCompletada: tareaCompletadaIn}))
}))
