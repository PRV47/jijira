import React from 'react';
import './CardSprintAsaidEstilo.css';
import { ISprint } from '../../../types/ISprint';
import { useAppStore } from '../../../store/SprintStore'; // Importa el store de Zustand
import visibilityIcon from '../../icons/visibility.svg'; // Ícono para "V"
import editNoteIcon from '../../icons/edit_note.svg'; // Ícono para "Ed"
import deleteIcon from '../../icons/delete.svg'; // Ícono para "E"
import Swal from "sweetalert2";
import { useSprint } from '../../hooks/useSprint'; // Importar el hook de Sprint

interface CardSprintAsaidProps {
    sprint: ISprint;
    handleOpenModalEditSprints: (sprint: ISprint) => void;
    handleOpenModalVerSprints: (sprint: ISprint) => void;
}

export const CardSprintAsaid: React.FC<CardSprintAsaidProps> = ({ sprint, handleOpenModalEditSprints, handleOpenModalVerSprints }) => {
    const setSelectedSprint = useAppStore((state) => state.setSelectedSprint);
    const setOpenModal = useAppStore((state) => state.setOpenModal);
    const removeSprint = useAppStore((state) => state.removeSprint);
    const { deleteExistingSprint } = useSprint();

    const handleViewSprint = () => {
        console.log('Abriendo modal VerSprint:', sprint);
        setSelectedSprint(sprint);
        handleOpenModalVerSprints(sprint);
        setOpenModal('verSprint');
    };

    const handleEditSprint = () => {
        setSelectedSprint(sprint);
        handleOpenModalEditSprints(sprint)
    };

    const handleDeleteSprint = () => {
        deleteExistingSprint(sprint.id);
    };

    const handleSelectSprint = () => {
        setSelectedSprint(sprint);
    };

    return (
        <div
            className="cardSprintAsaidContenedor"
            onClick={handleSelectSprint}
        >
            <div>
                <h5>{sprint.title}</h5>
                <h6>Inicio: {new Date(sprint.startDate).toLocaleDateString()}</h6>
                <h6>Fin: {new Date(sprint.endDate).toLocaleDateString()}</h6>
            </div>
            <div className="botoneraCardSprint" onClick={(e) => e.stopPropagation()}>
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