import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Collaborator, Schedule } from './CollaboratorsTable'
import { InputText } from 'primereact/inputtext';

interface ScheduleEditorProps {
    collaborator: Collaborator;
    onSave: (collaborator: Collaborator) => void;
    onClose: () => void;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ collaborator, onSave, onClose }) => {
    const [schedules, setSchedules] = useState<Collaborator['schedules']>([]);

    useEffect(() => {
        setSchedules(collaborator.schedules);
    }, [collaborator]);

    const handleSave = () => {
        onSave({ ...collaborator, schedules });
    };

    const arrivalTemplate = (schedule: Schedule) => {
        return (
            <Calendar value={new Date(schedule.arrival_time)} timeOnly={true} hourFormat="24"
                onChange={(e) => {
                    const newSchedules = [...schedules];
                    if (e.value instanceof Date) {
                        const index = newSchedules.findIndex(s => s.id === schedule.id);
                        newSchedules[index].arrival_time = e.value.toISOString();
                    }
                    setSchedules(newSchedules);
                }} />
        );
    };

    const departureTemplate = (schedule: Schedule) => {
        return (
            <Calendar value={new Date(schedule.departure_time)} timeOnly={true} hourFormat="24"
                onChange={(e) => {
                    const newSchedules = [...schedules];
                    if (e.value instanceof Date) {
                        const index = newSchedules.findIndex(s => s.id === schedule.id);
                        newSchedules[index].departure_time = e.value.toISOString();
                    }
                    setSchedules(newSchedules);
                }} />
        );
    };

    return (
        <Dialog visible={true} style={{ width: '30vw' }} header="Editar horarios" onHide={onClose}>
            <DataTable value={schedules}>
                <Column field="day" header="Día" />
                <Column header="Llegada" body={arrivalTemplate} />
                <Column header="Salida" body={departureTemplate} />
            </DataTable>
            <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
        </Dialog>
    );
};
