import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Paginator } from 'primereact/paginator';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { AttendanceService } from 'services/AttendanceService';
import Card from 'components/card/Card';
import { useColorModeValue } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';
import '../../../../assets/css/App.css';
import { formatDate } from 'util/DateUtil';

interface Attendance {
  document: string;
  f_name: string;
  l_name: string;
  email: string;
  location: string;
  arrival: string;
  departure: string;
  date: string;
  photo: string;
  late: boolean;
}

interface AttendanceTableProps {
  pageSizeOptions?: number[]; // Opciones para el número de registros por página
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ pageSizeOptions = [5, 10, 25, 50, 100] }) => {
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [first, setFirst] = useState(0); // Definir la variable first
  const [rows, setRows] = useState(pageSizeOptions[0]); // Definir la variable rows
  const [filters, setFilters] = useState<Partial<Attendance>>({
    document: '',
    f_name: '',
    l_name: '',
    email: '',
    location: '',
  });

  const { colorMode } = useColorMode();
  const tableClass = colorMode === 'light' ? 'light-mode' : 'dark-mode';

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryRed.300', 'whiteAlpha.100');

  useEffect(() => {
    fetchData();
  }, [first, rows, filters]);

  const fetchData = async () => {
    const response = await AttendanceService.getAllAttendance();
    setAttendance(response);
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

  const renderPhoto = (rowData: Attendance) => {
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
    const filterValue = filters[field] as string; // Cast the filter value to a string

    return (
      <InputText
        type="text"
        value={filterValue}
        onChange={(e) => onFilterInputChange(e, field)}
        placeholder={`Filtrar por ${field}`}
      />
    );
  };

  const onFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Attendance) => {
    console.log('Filtering by:', field);
    console.log('Old filters:', filters);
  
    setFilters({ ...filters, [field]: e.target.value });
  
    console.log('New filters:', filters);
  };

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <div className="">
        <DataTable
          style={{ fontSize: '.85em' }}
          value={attendance}
          header={header}
          footer={footer}
          className={tableClass}
          first={first}
          rows={rows}
          filterDisplay="row"
          onPage={onPage}
        >
          <Column field="date" header="Fecha" body={(rowData) => formatDate(rowData.date)}></Column>
          <Column
            field="document"
            header="Documento"
            filter={true}
            filterPlaceholder="Filtrar por documento"
            filterElement={filterTemplate('document')}
          />
          <Column
            field="f_name"
            header="Nombre"
            filter={true}
            filterPlaceholder="Filtrar por nombre"
            filterElement={filterTemplate('f_name')}
          />
          <Column
            field="l_name"
            header="Apellido"
            filter={true}
            filterPlaceholder="Filtrar por apellido"
            filterElement={filterTemplate('l_name')}
          />

          <Column field="email" header="Correo" filter={true} filterElement={filterTemplate('email')} />
          <Column field="location" header="Lugar" filter={true} filterElement={filterTemplate('location')} />
          <Column field="arrival" header="Llegada"></Column>
          <Column field="departure" header="Salida"></Column>
          <Column field="late" header="Estado" body={renderLateStatus}></Column>
          <Column field="photo" header="Foto" body={renderPhoto}></Column>
        </DataTable>
        {renderPaginator()}
        <Dialog visible={visible} header="Foto" modal={true} onHide={() => setVisible(false)}>
          {selectedImage && <img src={selectedImage} style={{ width: '100%', borderRadius: '10px' }} />}
        </Dialog>
      </div>
    </Card>
  );
};

export default AttendanceTable;
