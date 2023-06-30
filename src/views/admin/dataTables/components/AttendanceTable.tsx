import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { AttendanceService } from 'services/AttendanceService';
import { formatTime, formatDate } from '../../../../util/DateUtil';
import Card from 'components/card/Card';

import { useColorModeValue} from '@chakra-ui/react';

import { useColorMode } from '@chakra-ui/react';

import '../../../../assets/css/App.css'

interface Colaborator {
    document: number;
    name: string;
    email: string;
    arrival: string;
    departure: string;
    date: string;
}

const AttendanceTable = () => {
    const [attendance, setAttendances] = useState<Colaborator[]>([]);
    const { colorMode } = useColorMode();
    const tableClass = colorMode === 'light' ? 'light-mode' : 'dark-mode';

    const brandColor = useColorModeValue('brand.500', 'white');
    const boxBg = useColorModeValue('secondaryRed.300', 'whiteAlpha.100');

    useEffect(() => {
        const fetchData = async () => {
            const response = await AttendanceService.getAllAttendance();
            setAttendances(response);
        };
        fetchData();
    }, []);

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Registros</span>
        </div>
    );
    const footer = `Hay un total de ${attendance ? attendance.length : 0} registros.`;

    return (
        <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
            <div className="">
                <DataTable value={attendance} header={header} footer={footer} className={tableClass} >
                    <Column field="date" header="Fecha" body={(rowData) => formatDate(rowData.date)}></Column>
                    <Column field="document" header="Documento"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="email" header="Correo"></Column>
                    <Column field="arrival" header="Llegada" body={(rowData) => formatTime(rowData.arrival)}></Column>
                    <Column field="departure" header="Salida" body={(rowData) => formatTime(rowData.departure)}></Column>
                </DataTable>
            </div>
        </Card>
    );
};

export default AttendanceTable;
