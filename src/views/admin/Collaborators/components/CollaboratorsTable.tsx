import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { CollaboratorService } from 'services/CollaboratorService';
import { InputText } from 'primereact/inputtext';
import { ScheduleEditor } from './ScheduleEditor'; 
import { MdEdit } from 'react-icons/md';



export interface Schedule {
    id: number;
    day: string;
    arrival_time: string;
    departure_time: string;
    fk_collaborators_document: number;
}

export interface Collaborator {
    document: number;
    name: string;
    email: string;
    position: string;
    leader: string;
    date: string;
    id: number; // Make it required
    fk_collaborators_document: number; // Make it required
    schedules?: Schedule[]; // Agregamos un array de Schedule en la interfaz de Collaborator
}



const CollaboratorTable = () => {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await CollaboratorService.getAllCollaborators()
            setCollaborators(response);
        };
        fetchData();
    }, []);

    const updateCollaborator = async (updatedCollaborator: Collaborator) => {

    }

    const actionBodyTemplate = (rowData: Collaborator) => {
        return (
            <Button
                rounded
                text
                severity="success"
                aria-label="Editar"
                className="custom-edit-button"
                onClick={async () => {
                    try {
                        const schedules = await CollaboratorService.getCollaboratorSchedule(rowData.document);
                        if (schedules) {
                            setEditingCollaborator({ ...rowData, schedules, id: rowData.id, fk_collaborators_document: rowData.fk_collaborators_document });
                        } else {
                            throw new Error('No se pudieron obtener los horarios');
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }}
            >
                <MdEdit color='gray' />
            </Button>
        );
    };
    

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Registros</span>
        </div>
    );
    const footer = `Hay un total de ${collaborators ? collaborators.length : 0} registros.`;


    return (
        <div className="card">
            <DataTable style={{fontSize:".85em"}} value={collaborators} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                <Column field="document" header="Documento"></Column>
                <Column field="name" header="Nombre"></Column>
                <Column field="email" header="Correo"></Column>
                <Column field="position" header="Cargo"></Column>
                <Column body={actionBodyTemplate}></Column>
            </DataTable>

            {editingCollaborator && <ScheduleEditor collaborator={editingCollaborator} onSave={updateCollaborator} onClose={() => setEditingCollaborator(null)} />}
        </div>
    );
};

export default CollaboratorTable;
