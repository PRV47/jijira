import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import styles from "./CrearTareaModal.module.css"; // Importa el archivo CSS como módulo
import { useTareaStore } from '../../../../store/store';
import { ITarea } from '../../../../types/ITarea';
import Button from 'react-bootstrap/Button';
import { useTarea } from '../../../hooks/useTarea';
import { useSprintStore } from '../../../../store/store';
import { useSprint } from '../../../hooks/useSprint';

type CrearTareaModalProps = {
    modalClass: string;
    handleCloseCrearTareaModal: () => void;
    sprintId?: string;
};

const initialState: ITarea = {
    titulo: "",
    descripcion: "",
    fechaLimite: "",
    estado: ""
};

export const CrearTareaModal: FC<CrearTareaModalProps> = ({ modalClass, handleCloseCrearTareaModal, sprintId }) => {
    const activeTarea = useTareaStore((state) => state.activeTarea);
    const setActiveTarea = useTareaStore((state) => state.setActiveTarea);

    const { updateExistingTarea } = useTarea();
    const { addTarea } = useTarea();

    const sprints = useSprintStore((state) => state.sprints);
    const setSelectedSprint = useSprintStore((state) => state.setSelectedSprint);
    const { updateExistingSprint } = useSprint();

    const [formValues, setFormValues] = useState(initialState);

    useEffect(() => {
        if (activeTarea) {
            setFormValues({
                id: activeTarea.id || "",
                titulo: activeTarea.titulo || "",
                descripcion: activeTarea.descripcion || "",
                fechaLimite: activeTarea.fechaLimite || "",
                estado: activeTarea.estado || "backlog",
            });
        } else {
            setFormValues(initialState); // Reinicia el formulario si no hay tarea activa
        }
    }, [activeTarea]);

    useEffect(() => {
        if (!activeTarea) {
            setFormValues(initialState); // Limpia el formulario al abrir el modal para una nueva tarea
        }
    }, []); // Ejecuta solo al montar el componente

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value })); // Actualiza el estado correctamente
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formValues.titulo.trim() || !formValues.descripcion.trim() || !formValues.fechaLimite.trim()) {
            alert("Por favor, completa todos los campos correctamente."); // Validación más estricta
            return;
        }

        const tareaId = activeTarea?.id || Date.now().toString(); // Genera un ID único si no existe

        const nuevaTarea: ITarea = {
            ...formValues,
            id: tareaId,
            estado: sprintId ? "pendiente" : "backlog", // Define el estado según el contexto
        };

        try {
            if (sprintId) {
                const sprint = sprints.find((s: { id: string; tareas: ITarea[] }) => s.id === sprintId);
                if (sprint) {
                    const tareasActualizadas = activeTarea
                        ? sprint.tareas.map((t: ITarea) => (t.id === tareaId ? nuevaTarea : t)) // Editar tarea existente
                        : [...sprint.tareas, nuevaTarea]; // Agregar nueva tarea

                    const sprintActualizado = { ...sprint, tareas: tareasActualizadas };
                    await updateExistingSprint(sprintActualizado); // Actualiza el sprint
                    setSelectedSprint(sprintActualizado);
                }
            } else {
                if (activeTarea) {
                    await updateExistingTarea(nuevaTarea); // Actualiza tarea en backlog
                } else {
                    await addTarea(nuevaTarea); // Agrega nueva tarea al backlog
                }
            }
        } catch (error) {
            console.error("Error al guardar la tarea:", error);
            alert("Ocurrió un error al guardar la tarea. Intenta nuevamente.");
        } finally {
            setActiveTarea(null); // Limpia la tarea activa
            handleCloseCrearTareaModal(); // Cierra el modal
        }
    };

    return (
        <>
            <form className={`${styles.formularioModal} ${modalClass}`} onSubmit={handleSubmit}>
                <div className={styles.tituloModal}>
                    <h2>{activeTarea ? "Editar tarea" : "Crear tarea"}</h2>
                </div>
                <div className={styles.inputFormulario}>
                    <label htmlFor="nombreTarea">Titulo: </label>
                    <input
                        type="text"
                        id="nombreTarea"
                        placeholder="Titulo ejemplo"
                        required
                        value={formValues.titulo}
                        onChange={handleChange}
                        autoComplete="off"
                        name="titulo"
                    />
                </div>
                <div className={styles.inputFormulario}>
                    <label htmlFor="descripcionTarea">Descripción: </label>
                    <textarea
                        id="descripcionTarea"
                        name="descripcion"
                        required
                        placeholder="Descripcion ejemplo"
                        value={formValues.descripcion}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                </div>
                <div className={styles.inputFormulario}>
                    <label htmlFor="fechaLimiteTarea">Fecha Limite: </label>
                    <input
                        type="date"
                        id="fechaLimiteTarea"
                        name="fechaLimite"
                        required
                        value={formValues.fechaLimite}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.botonesModal}>
                    <Button variant="danger" onClick={handleCloseCrearTareaModal}>
                        Cancelar
                    </Button>
                    <Button variant="success" type="submit">
                        Guardar
                    </Button>
                </div>
            </form>
        </>
    );
};