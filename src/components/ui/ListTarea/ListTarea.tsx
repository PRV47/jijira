import React from 'react'
import { CrearTareaModal } from '../modals/CrearTareaModal/CrearTareaModal'
import { ITarea } from '../../../types/ITarea'
import { useSprintStore, useTareaStore } from '../../../store/store'
import { useEffect, useState } from 'react'
import { useTarea } from '../../hooks/useTarea'
import { CardTarea } from '../cardTarea/CardTarea'
import styles from './ListTarea.module.css';
import { VerTareaModal } from '../modals/VerTareaModal/VerTareaModal'
import { useNavigate } from 'react-router-dom'
//import { useAppStore } from '../../../store/SprintStore'

export const ListTarea = () => {
    const setActiveTarea = useTareaStore((state) => state.setActiveTarea)
    const { getTareas } = useTarea();
    const { backlog: tareas } = useTarea();
    const navigate = useNavigate();
    const addSprint = useSprintStore((state) => state.addSprint)
    useEffect(() => {
        getTareas()
    }, [])

    useEffect(() => {
        // Ahora usa el controlador que consulta tu backend Express
        import('../../../data/proyectoController').then(({ getSprintController }) => {
            getSprintController().then((sprints) => {
                if (Array.isArray(sprints)) {
                    sprints.forEach(addSprint);
                    console.log("Sprints cargados:", sprints);
                } else {
                    console.error("La propiedad 'sprints' no es un array");
                }
            }).catch(err => console.error("Error cargando sprints:", err));
        });
    }, [addSprint]);

    const [openModalTarea, setOpenModalTarea] = useState(false)
    const [openViewModalTask, setOpenViewModalTarea] = useState(false);

    const handleOpenViewTarea = (tarea: ITarea) => {
        setActiveTarea(tarea);
        setOpenViewModalTarea(true);
    };

    const handleCloseCrearTareaModal = () => {
        setOpenModalTarea(false)
        setActiveTarea(null)
    }

    const handleOpenModalEditTarea = (tarea: ITarea) => {
        setActiveTarea(tarea);
        setOpenModalTarea(true);
    };

    const handleCloseVerTareaModal = () => {
        setOpenViewModalTarea(false);
    }

    return (
        <div className={openModalTarea ? styles.blurredBackground : ''}>
            <div className={styles.ListTareaEstiloGeneral}>
                <div className={styles.headerBacklog}>
                    <h1>Pantalla Backlog</h1>
                    <div className={styles.headerActions}>
                        <button className={styles.btnVolver} onClick={() => navigate(`/nueva-pantalla`)}>
                            Volver a la pantalla principal
                        </button>
                        <button
                            className={styles.btnCrear}
                            onClick={() => setOpenModalTarea(true)}
                        >
                            Crear tarea y añadirla al backlog
                        </button>
                    </div>
                    <h2>Tareas en el backlog</h2>
                </div>

                {Array.isArray(tareas) && tareas.length > 0 ? (
                    tareas.map((el) => (
                        <CardTarea
                            tarea={el}
                            key={el.id}
                            handleOpenModalEdit={handleOpenModalEditTarea}
                            handleOpenModalView={handleOpenViewTarea}
                        />
                    ))
                ) : (
                    <div>
                        <h3>No hay tareas</h3>
                    </div>
                )}
                {openModalTarea && (
                    <CrearTareaModal
                        modalClass="formularioModal nuevaClase"
                        handleCloseCrearTareaModal={handleCloseCrearTareaModal}
                    />
                )}
                {openViewModalTask && (
                    <VerTareaModal
                        modalClass='verModal nuevaClase'
                        handleCloseVerTareaModal={handleCloseVerTareaModal} />
                )}
            </div>
        </div>
    )
}
