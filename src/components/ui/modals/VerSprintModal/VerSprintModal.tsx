import React, { FC } from 'react';
import styles from "./VerSprintModal.module.css";
import { ISprint } from '../../../../types/ISprint';
import { useSprintStore } from '../../../../store/store';
import { Button } from 'react-bootstrap';

type VerSprintModalProps = {
    modalClass: string;
    handleCloseVerSprintModal: () => void;
};

export const VerSprintModal: FC<VerSprintModalProps> = ({ modalClass, handleCloseVerSprintModal }) => {
    const activeSprint: ISprint | null = useSprintStore((state) => state.selectedSprint);
    const setActiveSprint = useSprintStore((state) => state.setSelectedSprint);

    const handleClose = () => {
        setActiveSprint(null);
        handleCloseVerSprintModal();
    };

    return (
        <>
            <div className={`${styles.containerModal} ${modalClass}`} >
                <div className={styles.tituloModal}>
                    <h2>{activeSprint?.title}</h2>
                </div>
                <div className={styles.inputFormulario}>
                    <label>Descripción:</label>
                    <p>{activeSprint?.description}</p>
                </div>
                <div className={styles.inputFormulario}>
                    <label>Fecha de Inicio:</label>
                    <p>{activeSprint?.startDate}</p>
                </div>
                <div className={styles.inputFormulario}>
                    <label>Fecha de Fin:</label>
                    <p>{activeSprint?.endDate}</p>
                </div>
                <div className={styles.botonesModal}>
                    <Button variant="danger" onClick={handleClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </>
    );
};
