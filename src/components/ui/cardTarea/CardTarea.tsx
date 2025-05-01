import styles from './CardTarea.module.css'
import { ITarea } from '../../../types/ITarea'
import { FC, useState } from 'react'
import { useTarea } from '../../hooks/useTarea'
import { useSprint } from '../../hooks/useSprint'
import { useTareaStore, useSprintStore } from '../../../store/store'

type CardTareaProps = {
  tarea: ITarea;
  handleOpenModalEdit: (tarea: ITarea) => void
  handleOpenModalView: (tarea: ITarea) => void
}

export const CardTarea: FC<CardTareaProps> = ({ tarea, handleOpenModalEdit, handleOpenModalView }) => {
  const sprints = useSprintStore((state) => state.sprints)
  const { deleteExistingTarea } = useTarea()
  const { updateExistingTarea } = useTarea()
  const { updateExistingSprint } = useSprint()
  const [selectedSprintId, setSelectedSprintId] = useState<string>("")

  const handleDeleteTarea = () => {
    deleteExistingTarea(tarea.id!)
  }

  const handleEditTarea = () => {
    handleOpenModalEdit(tarea)
  }

  const handleVerTarea = () => {
    handleOpenModalView(tarea)
  }

  // NUEVO: Handler para agregar la tarea al Sprint seleccionado
  const handleAgregarASprint = async () => {
    if (!selectedSprintId) return;
    const sprint = sprints.find((el) => el.id === selectedSprintId);
    if (!sprint) return;
    // Agregar la tarea al Sprint
    const sprintActualizado = {
      ...sprint,
      tareas: [...(sprint.tareas || []), { ...tarea, estado: "pendiente" }]
    };
    await updateExistingSprint(sprintActualizado);
    // Eliminar la tarea del backlog
    handleDeleteTarea();
  }

  return (
    <div className={styles.cardElemContainer}>
      <div>
        <p>{tarea.titulo}</p>
        <p>{tarea.descripcion}</p>
        <p>{tarea.fechaLimite}</p>
      </div>
      <div>
        <button
          onClick={handleAgregarASprint}
          disabled={!selectedSprintId}
        >
          Agregar a
        </button>
        <select
          value={selectedSprintId}
          onChange={e => setSelectedSprintId(e.target.value)}
        >
          <option value="">Selecciona un Sprint</option>
          {sprints.length > 0 ? (
            sprints.map((el) => (
              <option key={el.id} value={el.id}>{el.title}</option>
            ))
          ) : (
            <option disabled>No hay sprints asignables</option>
          )}
        </select>
        <button onClick={handleVerTarea}>Ver tarea</button>
        <button onClick={handleEditTarea}>Editar tarea</button>
        <button onClick={handleDeleteTarea}>Eliminar tarea</button>
      </div>
    </div>
  )
}