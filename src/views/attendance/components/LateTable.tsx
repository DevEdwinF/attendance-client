import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { Attendance } from "./AttendanceTable";
import { getServiceByUserRoleLateTable, getUserRoleFromToken } from "util/AuthTokenDecode";
import { Paginator } from "primereact/paginator";

export interface LateTableProps {
    visibleTwo: boolean;
    onHideTwo: () => void;
}

const LateTableComponent: React.FC<LateTableProps> = ({ visibleTwo, onHideTwo }) => {
    const [attendanceLate, setAttendanceLate] = useState<Attendance[]>([]);
    const token = localStorage.getItem('token');
    const [first, setFirst] = useState(0);
    const [row, setRow] = useState(5);
    useEffect(()=>{
        setFirst(0);
        setRow(5);
    }
    ,[visibleTwo])

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
            <Paginator
                first={first}
                rows={row}
                totalRecords={dataToShow.length}
                rowsPerPageOptions={[5, 10, 20]}
                onPageChange={(e) => {
                    setFirst(e.first);
                    setRow(e.rows);
                }}/>
        </Dialog>
    )
}

export default LateTableComponent;
