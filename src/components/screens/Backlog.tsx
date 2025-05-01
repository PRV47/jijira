import styles from "./Backlog.module.css"
import { CardTarea } from '../ui/cardTarea/CardTarea'
import { useTarea } from "../hooks/useTarea"
import { CrearTareaModal } from "../ui/modals/CrearTareaModal/CrearTareaModal"
import { ListTarea } from "../ui/ListTarea/ListTarea"
import { useNavigate } from 'react-router-dom'
import { useSprint } from "../hooks/useSprint"
import { useEffect } from "react"


export const Backlog = () => {
  const navigate = useNavigate()
  const { sprints, getSprints, addNewSprint, updateExistingSprint, deleteExistingSprint } = useSprint();
  useEffect(() => {
    getSprints().then(() => {
      console.log("Estado de sprints después de getSprints:", sprints);
    });
  }, []);
  return (
    <div>
      <ListTarea />
    </div>
  )
}
