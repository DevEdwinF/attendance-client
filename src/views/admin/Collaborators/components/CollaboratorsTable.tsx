import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { format } from 'date-fns';
import { CollaboratorService } from 'services/CollaboratorService';
import Card from 'components/card/Card';
import { formatTime, formatDate } from '../../../../util/DateUtil';

interface Colaborator {
    document: number;
    name: string;
    email: string;
    arrival: string;
    departure: string;
    date: string;
}

const CollaboratorTable = () => {
    const [collaborators, setCollaborators] = useState<Colaborator[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await CollaboratorService.getAllAttendance()
            setCollaborators(response);
        };
        fetchData();
    }, []);

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Registros</span>
        </div>
    );
    const footer = `Hay un total de ${collaborators ? collaborators.length : 0} registros.`;

    return (
        <div className="card">
            <DataTable value={collaborators} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                <Column field="document" header="Documento"></Column>
                <Column field="name" header="Nombre"></Column>
                <Column field="email" header="Correo"></Column>
                <Column field="arrival" header="Llegada"></Column>
                <Column field="departure" header="Salida"></Column>
                <Column field="date" header="Fecha de creación" body={(rowData) => formatDate(rowData.date)}></Column>
            </DataTable>
        </div>
    );
};

export default CollaboratorTable;
