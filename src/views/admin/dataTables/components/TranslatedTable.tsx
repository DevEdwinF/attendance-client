import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { AttendanceService } from "services/AttendanceService";

export interface TranslatedTableProps {
    visible: boolean;
    onHide: () => void;
}

export interface Collaborator {
    id?: number,
    f_name: string,
    l_name: string,
    date: string
}

const TranslatedTableComponent: React.FC<TranslatedTableProps> = ({ visible, onHide }) => {
    const [collaboratorData, setCollaboratorData] = useState<Collaborator[]>([]);

    useEffect(() => {
        AttendanceService.getAllTranslated().then(data => setCollaboratorData(data));
    }, []);


    const fetchData = async () => {
        try {
            const response = await AttendanceService.getAllTranslated()
            console.log(response)
            return response
        } catch (error) {
            throw error
        }
    }

    fetchData()

    return (
        <Dialog header="Lista de translados" visible={visible} onHide={onHide}>
            <div className="card">
                <DataTable value={collaboratorData} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="f_name" header="Nombre"></Column>
                    <Column field="l_name" header="Apellido"></Column>
                    <Column field="date" header="fecha"></Column>
                </DataTable>
            </div>

        </Dialog>
    )

}

export default TranslatedTableComponent