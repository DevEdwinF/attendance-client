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

const TranslatedTableComponent: React.FC<TranslatedTableProps> = ({ visible, onHide }) => {
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
        const userTimezoneOffset = dateTime.getTimezoneOffset();
        const dateTimeInUserTimezone = new Date(dateTime.getTime() + userTimezoneOffset * 60000);

        const day = dateTimeInUserTimezone.getDate();
        const month = dateTimeInUserTimezone.getMonth() + 1;
        const year = dateTimeInUserTimezone.getFullYear();
        let hours = dateTimeInUserTimezone.getHours();
        const minutes = dateTimeInUserTimezone.getMinutes();
        const amOrPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime =
            `${hours}:${minutes < 10 ? `0${minutes}` : minutes} ${amOrPm}`;
        return { formattedDate, formattedTime };
    };

    return (
        <Dialog header="Lista de traslados" visible={visible} onHide={onHide}>
            <div className="card">
                <DataTable value={collaboratorData} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="f_name" header="Nombre" />
                    <Column field="l_name" header="Apellido" />
                    <Column
                        field="date"
                        header="Fecha y Hora"
                        body={(rowData: Collaborator) => {
                            const { formattedDate, formattedTime } = formatDateTime(rowData.date);
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
