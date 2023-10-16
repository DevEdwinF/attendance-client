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
  import { getServiceByUserRole, getUserRoleFromToken } from 'util/AuthTokenDecode';
  import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { MdOutlineDeleteForever } from 'react-icons/md';

  export interface Attendance {
    document: string;
    f_name: string;
    l_name: string;
    email: string;
    b_email: string;
    position: string;
    location: string;
    arrival: string;
    subprocess: string,
    headquarters: string,
    leader: string,
    departure: string;
    date: Date;
    photo_arrival: string;
    photo_departure: string;
    late: boolean;
    early_departure: boolean;
  }

  export interface FiltersAttendance {
    date?: Date,
    document?: string,
    f_name?: string,
    l_name?: string,
    email?: string,
    location?: string,
    arrival?: string,
    departure?: string,
    position?: string,
    leader?: string,
    headquarters?: string,
    subprocess?: string,
    late?: boolean
    early_departure?: boolean,

  }


  const AttendanceTable = () => {
    const [visible, setVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const token = localStorage.getItem('token');
    const userRole = getUserRoleFromToken(token);
    const [attendanceLeader, setAttendanceLeader] = useState<Attendance[]>([]);
    const attendanceService = getServiceByUserRole(userRole);
    const [first, setFirst] = useState(0);
    const [row, setRow] = useState(5);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [filters, setFilters] = useState<Partial<Attendance>>({
      date: null,
      document: '',
      f_name: '',
      l_name: '',
      email: '',
      b_email: '',
      location:'',
      position:'',
      leader:'',
      late: null,
      early_departure: null,
      arrival: '',
      departure: '',
      subprocess: '',
      headquarters: '',
    });
    
    const [displayTranslatedDialog, setDisplayTranslatedDialog] = useState(false);
    const [displayLateDialog, setDisplayLateDialog] = useState(false);

    const { colorMode } = useColorMode();
    const tableClass = colorMode === 'light' ? 'light-mode' : 'dark-mode';

    const brandColor = useColorModeValue('brand.500', 'white');
    const boxBg = useColorModeValue('secondaryRed.300', 'whiteAlpha.100');

    useEffect(() => {
      fetchData(
        currentPage,
        row,
        filters
      );
    }, [currentPage, row, filters]);

    const fetchData = async (page: number, limit: number, filter: FiltersAttendance) => {
      try {
        const {rows, total_rows} = await attendanceService(
          page,
          limit,
          filter
        );
          console.log(rows);
          

      setTotalRecords(total_rows)

      setAttendance(rows)
        
      } catch (error) {
        console.log(error);
        
      }


    };


    const openDialog = (image: string) => {
      setSelectedImage(image);
      setVisible(true);
    };

    const onPage = (event: { first: number; rows: number; page: number }) => {
      setFirst(event.first);
      setRow(event.rows);
      
      setCurrentPage(event.page + 1)
    };

    const OnFilterDate = (e: CalendarChangeEvent) => {
      const selectedDate = e.value as Date;
      setFilters({
        ...filters,
        date: selectedDate || null
      });
    };

    const clearDateFilter = () => {
      setFilters({
        ...filters,
        date: null
      });
    };
    const DateFilter = () => {
      return (
        <div className="card flex justify-content-center">
          <Calendar value={filters.date} maxDate={new Date()} onChange={(e) => OnFilterDate(e)} />
          {filters.date && (
            <div className="clear-filter-icon" onClick={clearDateFilter}>
              <MdOutlineDeleteForever/>
            </div>
          )}
        </div>
      );
    };

    const header = (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">Registros</span>
      </div>
    );
    const footer = `Hay un total de ${totalRecords} registros.`;

  const filterableFields: { [key in keyof Attendance]: string} ={
    date: 'Fecha',
    document: 'Documento',
    f_name: 'Nombre',
    l_name: 'Apellido',
    email: 'Correo',
    b_email: 'Correo B',
    position: 'Cargo',
    location: 'Ubicación',
    arrival: 'Llegada',
    subprocess: 'Subproceso',
    headquarters: 'Sede',
    leader: 'Lider',
    departure: 'Salida',
    photo_arrival: 'Foto llegada',
    photo_departure: 'Foto salida',
    late: 'Tarde',
    early_departure: 'Salida temprano',
  }


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

    const renderEarlyStatus = (rowData: Attendance) => {
      if (rowData.early_departure) {
        return <span className="text-red">No cumple</span>;
      }
      return <span className="text-green">Cumple</span>;
    };


  

    const filterTemplate = (field: keyof Attendance) => {
      const filterValue = filters[field] as string;

      return (
        <InputText
          type="text"
          value={filterValue}
          onChange={(e) => onFilterInputChange(e, field)}
          placeholder={`Filtrar  ${filterableFields[field]}`}
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
            rows={row}
            filterDisplay="row"
            
          >
            <Column 
            style={{ minWidth: '14rem' }}
            field="date" 
            header="Fecha" 
            body={(rowData) => formatDate(rowData.date)} 
            filterPlaceholder="Filtrar por documento" 
            filter={true}
            showFilterMenu={false} 
            filterElement={DateFilter()}/>
            <Column
            style={{ minWidth: '15rem' }}
              field="document"
              header="Documento"
              filter={true}
              showFilterMenu={false} 
              filterElement={filterTemplate('document')}
              filterPlaceholder="Filtrar por documento"
            />
            <Column
            style={{ minWidth: '22rem' }}
              field="f_name"
              header="Nombre"
              filter={true}
              showFilterMenu={false} 
              filterElement={filterTemplate('f_name')}
              filterPlaceholder="Filtrar por nombre"
            />
            <Column
            style={{ minWidth: '22rem' }}
              field="l_name"
              header="Apellido"
              filter={true}
              showFilterMenu={false} 
              filterPlaceholder="Filtrar por apellido"
              filterElement={filterTemplate('l_name')}
            />
            <Column
            style={{ minWidth: '22rem' }}
              field="email"
              header="Correo"
              filter={true}
              showFilterMenu={false} 
              filterElement={filterTemplate('email')} />
            <Column
            style={{ minWidth: '14rem' }}
              field="location"
              header="Ubicación"
              filter={true}
              showFilterMenu={false} 
              filterElement={filterTemplate('location')} />
            <Column
            style={{ minWidth: '14rem' }}
              field="arrival"
              header="Llegada"
              body={(rowData) => formatTime(rowData.arrival)}
              filterElement={filterTemplate('arrival')}
            />
            <Column
          style={{ minWidth: '14rem' }}
          field="departure"
          header="Salida"
          body={renderDepartureTime}
          filterElement={filterTemplate('departure')}
        />
            <Column
            style={{ minWidth: '14rem' }}
              field="late"
              header="Estado"
              body={renderLateStatus}
              filter={true}
              showFilterMenu={false} 
              filterElement={filterTemplate('late')}
            />
            <Column
            style={{ minWidth: '14rem' }}
              field="early_departure"
              header="Salida"
              body={renderEarlyStatus}
              filter={true}
              showFilterMenu={false} 
              filterElement={filterTemplate('early_departure')}
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

          <Paginator
          first={first}
          rows={row}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={onPage}
        />
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
