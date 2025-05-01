import React, { useEffect } from 'react';
import "./SideBarEstilo.css";
import { useNavigate } from 'react-router-dom';
import { useSprintStore } from '../../../store/store';
import addBoxIcon from '../../icons/add_box.svg';
import { CardSprintSide } from '../CardSprintSide/CardSprintSide';
import { CrearSprintModal } from '../modals/CrearSprint/CrearSprintModal';
import { VerSprintModal } from '../modals/VerSprintModal/VerSprintModal';
import { ISprint } from '../../../types/ISprint';

export const SideBar = () => {

    const navigate = useNavigate();
    const sprints = useSprintStore((state) => state.sprints);
    const openModal = useSprintStore((state) => state.openModal);
    const setOpenModal = useSprintStore((state) => state.setOpenModal);
    const setSelectedSprint = useSprintStore((state) => state.setSelectedSprint);

    useEffect(() => {
        if (openModal) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [openModal]);

    const handleOpenCrearSprintModal = () => {
        setOpenModal('crearSprint'); // Cambia el estado global `openModal` a 'crearSprint'
    };

    const handleOpenModalEditSprints = (sprint: ISprint) => {
        setSelectedSprint(sprint);
        setOpenModal("crearSprint");
    };

    const handleOpenModalVerSprints = (sprint: ISprint) => {
        setSelectedSprint(sprint);
        setOpenModal("verSprint");
    };

    const handleCloseModal = () => {
        setOpenModal(null); // Asegúrate de que `setOpenModal` esté definido en el estado
        setSelectedSprint(null); // Asegúrate de que `setSelectedSprint` esté definido en el estado
    };

    return (
        <div className='sideBarContenedor'>
            <div className='botoneraBacklog'>
                <button className='botonBacklog' onClick={() => navigate('/')}>
                    <h6>Backlog</h6>
                </button>
            </div>
            <div className='divListaSprints'>
                <div className="headerListaSprints">
                    <h4>Lista de Sprints</h4>
                    <button className="botonCrearSprint" onClick={handleOpenCrearSprintModal}>
                        <img src={addBoxIcon} alt="Crear Sprint" className="iconoCrearSprint" />
                    </button>
                </div>
                {sprints.length === 0 ? (
                    <p>No hay sprints creados.</p>
                ) : (
                    sprints.map((sprint) => (
                        <CardSprintSide
                            key={sprint.id}
                            sprint={sprint}
                            handleOpenModalEditSprints={handleOpenModalEditSprints}
                            handleOpenModalVerSprints={handleOpenModalVerSprints} // Pasa la función para cerrar el modal
                        />
                    ))
                )}
            </div>
            {openModal === 'crearSprint' && (
                <div className="modalOverlay">
                    <CrearSprintModal
                        modalClass="formularioModal nuevaClase"
                        onClose={handleCloseModal} // Cierra el modal al cambiar el estado `openModal` a `null`
                    />
                </div>
            )}
            {openModal === "verSprint" && (
                <div className="modalOverlay">
                    <VerSprintModal
                        modalClass="formularioModal nuevaClase"
                        handleCloseVerSprintModal={handleCloseModal} // Cierra el modal al cambiar el estado `openModal` a `null`
                    />
                </div>
            )}
        </div>
    );
};