import React from 'react';
import './CardSprintSideEstilo.css';
import { ISprint } from '../../../types/ISprint';
import { useSprintStore } from '../../../store/store';
import visibilityIcon from '../../icons/visibility.svg';
import editNoteIcon from '../../icons/edit_note.svg';
import deleteIcon from '../../icons/delete.svg';
import Swal from "sweetalert2";
import { useSprint } from '../../hooks/useSprint';
import { useNavigate } from 'react-router-dom';

interface CardSprintSideProps {
    sprint: ISprint;
    handleOpenModalEditSprints: (sprint: ISprint) => void;
    handleOpenModalVerSprints: (sprint: ISprint) => void; // Función para cerrar el modal de ver sprint
}

export const CardSprintSide: React.FC<CardSprintSideProps> = ({ sprint, handleOpenModalEditSprints, handleOpenModalVerSprints }) => {
    const setSelectedSprint = useSprintStore((state) => state.setSelectedSprint);
    const selectedSprint = useSprintStore((state) => state.selectedSprint);
    const isActive = selectedSprint && selectedSprint.id === sprint.id;
    const setOpenModal = useSprintStore((state) => state.setOpenModal);
    const { deleteExistingSprint } = useSprint(); // Usar la función de eliminación del hook
    const navigate = useNavigate();

    const handleViewSprint = () => {
        console.log('Abriendo modal VerSprint:', sprint); // Verifica que el sprint sea el correcto
        setSelectedSprint(sprint);
        handleOpenModalVerSprints(sprint); // Abre el modal de ver sprint
        setOpenModal('verSprint'); // Cambia el estado global `openModal` a 'verSprint'
    };

    const handleEditSprint = () => {
        setSelectedSprint(sprint); // Selecciona el Sprint
        handleOpenModalEditSprints(sprint) // Abre el modal de edición
    };

    const handleDeleteSprint = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteExistingSprint(sprint.id); // Usar el hook para eliminar el sprint
            }
        });
    };

    const handleSelectSprint = () => {
        setSelectedSprint(sprint); // Selecciona el Sprint
        navigate(`/nueva-pantalla/${sprint.id}`)
    };

    return (
        <div
            className={`cardSprintSideContenedor${isActive ? ' active' : ''}`}
            onClick={handleSelectSprint} // Agrega el evento onClick al contenedor principal
        >
            <div>
                <h5>{sprint.title}</h5>
                <h6>Inicio: {new Date(sprint.startDate).toLocaleDateString()}</h6>
                <h6>Fin: {new Date(sprint.endDate).toLocaleDateString()}</h6>
            </div>
            <div className="botoneraCardSprint" onClick={(e) => e.stopPropagation() /* HACE QUE SELECCIONE EL SPRINT AL HACER CLICK EN EL CUADRO EN UN AREA CUALQUIERA. NO BORRAR MUY IMPORTANTE*/}>
                <button className="botonCardVerSprint" onClick={handleViewSprint}>
                    <img src={visibilityIcon} alt="Ver Sprint" />
                </button>
                <button className="botonCardEditarSprint" onClick={handleEditSprint}>
                    <img src={editNoteIcon} alt="Editar Sprint" />
                </button>
                <button className="botonCardEliminarSprint" onClick={handleDeleteSprint}>
                    <img src={deleteIcon} alt="Eliminar Sprint" />
                </button>
            </div>
        </div>
    );
};