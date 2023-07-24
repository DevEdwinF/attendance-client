import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';

import { AttendanceService } from 'services/AttendanceService';
import Card from 'components/card/Card';

import { useColorModeValue } from '@chakra-ui/react';

import { useColorMode } from '@chakra-ui/react';

import '../../../../assets/css/App.css';
import { formatDate } from 'util/DateUtil';

interface Colaborator {
  document: number;
  name: string;
  email: string;
  location: string;
  arrival: string;
  departure: string;
  date: string;
  photo: string;
  late: boolean;
}

const AttendanceTable = () => {
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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

  const openDialog = (image: string) => {
    setSelectedImage(image);
    setVisible(true);
  };

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Registros</span>
    </div>
  );
  const footer = `Hay un total de ${attendance ? attendance.length : 0} registros.`;

  const renderPhoto = (rowData: Colaborator) => {
    if (rowData.photo) {
      return (
        <img
          src={rowData.photo}
          alt="Foto"
          width="50"
          height="50"
          onClick={() => openDialog(rowData.photo)}
          style={{ cursor: 'pointer' }}
        />
      );
    }
    return null;
  };

  const renderLateStatus = (rowData: Colaborator) => {
    if (rowData.late) {
      return <span className="text-red">Tarde</span>;
    }
    return <span className="text-green">A tiempo</span>;
  };

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <div className="">
        <DataTable value={attendance} header={header} footer={footer} className={tableClass}>
          <Column field="date" header="Fecha" body={(rowData) => formatDate(rowData.date)}></Column>
          <Column field="document" header="Documento"></Column>
          <Column field="name" header="Nombre"></Column>
          <Column field="email" header="Correo"></Column>
          <Column field="Location" header="Lugar"></Column>
          <Column field="arrival" header="Llegada"></Column>
          <Column field="departure" header="Salida"></Column>
          <Column field="late" header="Estado" body={renderLateStatus}></Column>
          <Column field="photo" header="Foto" body={renderPhoto}></Column>
        </DataTable>
        <Dialog visible={visible} header="Foto" modal={true} onHide={() => setVisible(false)}>
          {selectedImage && <img src={selectedImage} style={{ width: '100%', borderRadius: '10px' }} />}
        </Dialog>
      </div>
    </Card>
  );
};

export default AttendanceTable;
