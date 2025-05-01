import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useSprintStore } from '../../../../store/store'; // Cambiar useAppStore por useSprintStore
import { ISprint } from '../../../../types/ISprint';
import styles from "../CrearTareaModal/CrearTareaModal.module.css";
import Button from 'react-bootstrap/Button';
import { useSprint } from '../../../hooks/useSprint';
import { updateSprintController } from '../../../../data/proyectoController'; // Importa el controlador para actualizar el servidor

const initialState: ISprint = {
    id: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    tareas: [],
};

export const CrearSprintModal = ({ modalClass, onClose }: { modalClass: string; onClose: () => void }) => {
    const addSprint = useSprintStore((state) => state.addSprint); // Cambiar useAppStore por useSprintStore
    const updateSprint = useSprintStore((state) => state.updateSprint); // Cambiar useAppStore por useSprintStore
    const setSelectedSprint = useSprintStore((state) => state.setSelectedSprint); // Cambiar useAppStore por useSprintStore
    const selectedSprint = useSprintStore((state) => state.selectedSprint); // Cambiar useAppStore por useSprintStore

    const [formValues, setFormValues] = useState(initialState);

    useEffect(() => {
        if (selectedSprint) {
            setFormValues({
                id: selectedSprint.id,
                title: selectedSprint.title,
                description: selectedSprint.description,
                startDate: selectedSprint.startDate,
                endDate: selectedSprint.endDate,
                tareas: selectedSprint.tareas,
            });
        }
    }, [selectedSprint]);

    const { addNewSprint } = useSprint();
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { title, description, startDate, endDate } = formValues;

        if (selectedSprint) {
            // Edición de un Sprint existente
            const updatedSprint: ISprint = {
                ...selectedSprint,
                title,
                description,
                startDate,
                endDate,
            };
            try {
                await updateSprintController(updatedSprint); // Actualiza en el servidor
                updateSprint(updatedSprint); // Actualiza el estado local correctamente
            } catch (error) {
                console.error("Error al actualizar el Sprint:", error);
            }
            setSelectedSprint(null); // Limpia el Sprint seleccionado
        } else {
            // Creación de un nuevo Sprint
            if (title && description && startDate && endDate) {
                const newSprint: ISprint = {
                    id: Date.now().toString(),
                    title,
                    description,
                    startDate,
                    endDate,
                    tareas: [],
                };
                try {
                    const createdSprint = await addNewSprint(newSprint); // Agrega al servidor y devuelve el sprint creado
                    addSprint(createdSprint); // Agrega al estado local solo una vez
                } catch (error) {
                    console.error("Error al crear el Sprint:", error);
                }
            } else {
                alert('Por favor, completa todos los campos.');
                return;
            }
        }

        setFormValues(initialState); // Limpia el formulario
        onClose(); // Cierra el modal
    };

    const handleClose = () => {
        setFormValues(initialState); // Limpia el formulario al cerrar el modal
        setSelectedSprint(null); // Limpia el Sprint seleccionado
        onClose();
    };

    return (
        <form className={`${styles.formularioModal} ${modalClass}`} onSubmit={(e) => handleSubmit(e)}>
            <div className='tituloModal'>
                <h2>Crear Sprint</h2>
            </div>
            <div className='tituloNombreModal inputFormulario'>
                <label htmlFor="title">Titulo: </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    placeholder='Titulo ejemplo'
                    value={formValues.title}
                    onChange={handleChange}
                />
            </div>
            <div className='descripcionModal inputFormulario'>
                <label htmlFor="description">Descripción: </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    placeholder='Descripcion ejemplo'
                    value={formValues.description}
                    onChange={handleChange}
                />
            </div>
            <div className='fechaInicioModal inputFormulario'>
                <label htmlFor="startDate">Fecha Inicio: </label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    value={formValues.startDate}
                    onChange={handleChange}
                />
            </div>
            <div className='fechaLimiteModal inputFormulario'>
                <label htmlFor="endDate">Fecha Limite: </label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    required
                    value={formValues.endDate}
                    onChange={handleChange}
                />
            </div>
            <div className="botonesModal">
                <Button variant="danger" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="success" type="submit">Guardar</Button>
            </div>
        </form>
    );
};