import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { AttendanceService } from "services/Attendance.service";

export interface TranslatedTableProps {
    visible: boolean;
    onHide: () => void;
}

export interface Collaborator {
    id?: number;
    f_name: string;
    l_name: string;
    date: string;
}

const TranslatedTableComponent: React.FC<TranslatedTableProps> = ({visible, onHide}) => {
    const [collaboratorData, setCollaboratorData] = useState<Collaborator[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await AttendanceService.getAllTranslated();
            setCollaboratorData(response);
        } catch (error) {
            throw error;
        }
    };

    const formatDateTime = (dateTimeString: string) => {
        const dateTime = new Date(dateTimeString);
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1;
        const year = dateTime.getFullYear();
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours}:${minutes}`;
        return { formattedDate, formattedTime };
    };

    return (
        <Dialog header="Lista de traslados" visible={visible} onHide={onHide}>
            <div className="card">
                <DataTable value={collaboratorData} tableStyle={{ minWidth: "50rem" }}>
                    <Column field="f_name" header="Nombre" />
                    <Column field="l_name" header="Apellido" />
                    <Column
                        field="date"
                        header="Fecha y Hora"
                        body={(rowData: Collaborator) => {
                            const { formattedDate, formattedTime } = formatDateTime(
                                rowData.date
                            );
                            return (
                                <span>
                                    {formattedDate} - {formattedTime}
                                </span>
                            );
                        }}
                    />
                </DataTable>
            </div>
        </Dialog>
    );
};

export default TranslatedTableComponent;
