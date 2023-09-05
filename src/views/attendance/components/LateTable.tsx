import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { Attendance } from "./AttendanceTable";
import { getServiceByUserRoleLateTable, getUserRoleFromToken } from "util/AuthTokenDecode";

export interface LateTableProps {
    visibleTwo: boolean;
    onHideTwo: () => void;
}

const LateTableComponent: React.FC<LateTableProps> = ({ visibleTwo, onHideTwo }) => {
    const [attendanceLate, setAttendanceLate] = useState<Attendance[]>([]);
    const token = localStorage.getItem('token');

    const userRole = getUserRoleFromToken(token);
    const attendanceService = getServiceByUserRoleLateTable(userRole);

    const fetchData = async () => {
        const response = await attendanceService();
        setAttendanceLate(response);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const countByDocument: { [document: string]: number } = {};

    const nameAndLastNameByDocument: { [document: string]: string } = {};

    attendanceLate.forEach((item) => {
        const { document, f_name, l_name } = item;
        if (countByDocument[document]) {
            countByDocument[document]++;
        } else {
            countByDocument[document] = 1;
            nameAndLastNameByDocument[document] = `${f_name} ${l_name}`;
        }
    });

    const dataToShow = Object.keys(countByDocument).map((document) => ({
        document,
        nameAndLastName: nameAndLastNameByDocument[document],
        count: countByDocument[document]
    }));

    return (
        <Dialog header="Retardos acumulados por Colaborador" visible={visibleTwo} onHide={onHideTwo}>
            <DataTable
                value={dataToShow}
            >
                <Column field="document" header="Documento" sortable></Column>
                <Column field="nameAndLastName" header="Nombre completo"></Column>
                <Column field="count" header="Llegadas tarde" sortable></Column>
            </DataTable>
        </Dialog>
    )
}

export default LateTableComponent;
