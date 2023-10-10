import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Paginator } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import Card from 'components/card/Card';
import { useColorModeValue } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';
import { formatDate, formatTime } from 'util/DateUtil';
import TranslatedTableComponent, { Collaborator } from 'views/attendance/components/TranslatedTable';
import LateTableComponent from './LateTable';
import { async } from 'q'; // Esta importación parece innecesaria e incorrecta
import { getServiceByUserRole, getUserRoleFromToken } from 'util/AuthTokenDecode';

export interface Attendance {
  document: string;
  f_name: string;
  l_name: string;
  email: string;
  location: string;
  arrival: string;
  departure: string;
  date: string;
  photo_arrival: string;
  photo_departure: string;
  late: boolean;
}

interface AttendanceTableProps {
  pageSizeOptions?: number[]; 
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ pageSizeOptions = [5, 10, 25, 50, 100] }) => {
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const token = localStorage.getItem('token');
  const userRole = getUserRoleFromToken(token);
  const [attendanceLeader, setAttendanceLeader] = useState<Attendance[]>([]);
  const attendanceService = getServiceByUserRole(userRole);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(pageSizeOptions[0]);
  const [filters, setFilters] = useState<Partial<Attendance>>({
    date: '',
    document: '',
    f_name: '',
    l_name: '',
    email: '',
    location: '',
  });
  const [displayTranslatedDialog, setDisplayTranslatedDialog] = useState(false);
  const [displayLateDialog, setDisplayLateDialog] = useState(false);

  const { colorMode } = useColorMode();
  const tableClass = colorMode === 'light' ? 'light-mode' : 'dark-mode';

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryRed.300', 'whiteAlpha.100');

  useEffect(() => {
    fetchData(
      first,
      rows
    );
  }, [first, rows, filters, attendanceService]);

  const fetchData = async (page: number, pageSize: number) => {
    const response = await attendanceService(page, pageSize);

    const filteredData = response.filter((attendance: Attendance) =>
      Object.entries(filters).every(([key, value]) => {
        const fieldValue = String(attendance[key as keyof Attendance]);
        const filterValue = value as string;
        return fieldValue.toLowerCase().includes((value as string).toLowerCase());
      })
    );

    setAttendance(filteredData.lenght);

    const paginatedData = filteredData.slice(first, first + rows);
    setAttendance(paginatedData);
  };


  const openDialog = (image: string) => {
    setSelectedImage(image);
    setVisible(true);
  };

  const onPage = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Registros</span>
    </div>
  );
  const footer = `Hay un total de ${attendance ? attendance.length : 0} registros.`;

  const renderPhotoArrival = (rowData: Attendance) => {
    if (rowData.photo_arrival) {
      return (
        <img
          src={`data:image/png;base64,${rowData.photo_arrival}`}
          alt="Foto"
          width="60"
          height="60"
          onClick={() => openDialog(`data:image/png;base64,${rowData.photo_arrival}`)}
          style={{ cursor: 'pointer' }}
        />
      );
    }
    return null;
  };

  const renderPhotoDeparture = (rowData: Attendance) => {
    if (rowData.photo_departure) {
      return (
        <img
          src={`data:image/png;base64,${rowData.photo_departure}`}
          alt="Foto"
          width="60"
          height="60"
          onClick={() => openDialog(`data:image/png;base64,${rowData.photo_departure}`)}
          style={{ cursor: 'pointer' }}
        />
      );
    }
    return null;
  };



  const renderLateStatus = (rowData: Attendance) => {
    if (rowData.late) {
      return <span className="text-red">Tarde</span>;
    }
    return <span className="text-green">A tiempo</span>;
  };

  const renderPaginator = () => {
    return (
      <Paginator
        first={first}
        rows={rows}
        totalRecords={attendance ? attendance.length : 0}
        rowsPerPageOptions={pageSizeOptions}
        onPageChange={onPage}
      />
    );
  };

  const filterTemplate = (field: keyof Attendance) => {
    const filterValue = filters[field] as string;

    return (
      <InputText
        type="text"
        value={filterValue}
        onChange={(e) => onFilterInputChange(e, field)}
        placeholder={`Filtrar por ${field}`}
      />
    );
  };

  const formatTime = (time: string | undefined): string => {
    return time ? time : 'No hay registro';
  };

  const renderDepartureTime = (rowData: Attendance) => {
    return <span>{formatTime(rowData.departure)}</span>;
  };

  const onFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Attendance) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  const handleTranslatedTableOpen = () => {
    setDisplayTranslatedDialog(true);
  };

  const handleLateTableOpen = () => {
    setDisplayLateDialog(true);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button className="btn-translated-open" onClick={handleTranslatedTableOpen}>
          Traslados
        </button>
        <button className="btn-retard-represed-open" onClick={handleLateTableOpen}>
          Retardos acumulados
        </button>
      </div>

      {/* <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}> */}
      <div className="">
        <DataTable
          tableStyle={{ width: "auto" }}
          value={attendance}
          header={header}
          footer={footer}
          className={tableClass}
          first={first}
          rows={rows}
          onPage={onPage}
          filterDisplay="row"
        >
          <Column 
          style={{ minWidth: '14rem' }}
          field="date" 
          header="Fecha" 
          body={(rowData) => formatDate(rowData.date)} 
          filterPlaceholder="Filtrar por documento" 
          filter={true}
          filterElement={filterTemplate('date')}/>
          <Column
          style={{ minWidth: '15rem' }}
            field="document"
            header="Documento"
            filter={true}
            filterElement={filterTemplate('document')}
            filterPlaceholder="Filtrar por documento"
          />
          <Column
          style={{ minWidth: '22rem' }}
            field="f_name"
            header="Nombre"
            filter={true}
            filterElement={filterTemplate('f_name')}
            filterPlaceholder="Filtrar por nombre"
          />
          <Column
          style={{ minWidth: '22rem' }}
            field="l_name"
            header="Apellido"
            filter={true}
            filterPlaceholder="Filtrar por apellido"
            filterElement={filterTemplate('l_name')}
          />
          <Column
          style={{ minWidth: '22rem' }}
            field="email"
            header="Correo"
            filter={true}
            filterElement={filterTemplate('email')} />
          <Column
          style={{ minWidth: '14rem' }}
            field="location"
            header="Lugar"
            filter={true}
            filterElement={filterTemplate('location')} />
          <Column
          style={{ minWidth: '14rem' }}
            field="arrival"
            header="Llegada"
            body={(rowData) => formatTime(rowData.arrival)}
            filter={true}
            filterElement={filterTemplate('arrival')}
          />
          <Column
        style={{ minWidth: '14rem' }}
        field="departure"
        header="Salida"
        body={renderDepartureTime}
        filter={true}
        filterElement={filterTemplate('departure')}
      />
          <Column
          style={{ minWidth: '14rem' }}
            field="late"
            header="Estado"
            body={renderLateStatus}
            filter={true}
            filterElement={filterTemplate('late')}
          />
          <Column
            field="photo_arrival"
            header="Foto"
            body={renderPhotoArrival} />

          <Column
            field="photo_departure"
            header="Foto"
            body={renderPhotoDeparture} />
        </DataTable>
        {renderPaginator()}
        <Dialog visible={visible} header="Foto" modal={true} onHide={() => setVisible(false)}>
          {selectedImage && <img src={selectedImage} style={{ width: '100%', borderRadius: '10px' }} />}
        </Dialog>
        <TranslatedTableComponent
          visible={displayTranslatedDialog}
          onHide={() => setDisplayTranslatedDialog(false)}
        />
        <LateTableComponent
          visibleTwo={displayLateDialog}
          onHideTwo={() => setDisplayLateDialog(false)}
        />
      </div>
      {/* </Card> */}
    </>
  );
};

export default AttendanceTable;
