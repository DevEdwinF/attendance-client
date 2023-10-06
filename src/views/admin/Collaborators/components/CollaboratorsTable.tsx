import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Paginator } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { CollaboratorService } from 'services/Collaborator.service';
import { ScheduleEditor } from './ScheduleEditor';
import { MdEdit } from 'react-icons/md';
import { FilterMatchMode } from 'primereact/api';
import { formatDate } from 'util/DateUtil';
import { getCollaboratorByUserRole, getUserRoleFromToken } from 'util/AuthTokenDecode';
import { StatService } from 'services/Stats.service';

export interface Schedule {
  id: number;
  day: string;
  arrival_time: string;
  departure_time: string;
  fk_collaborator_id: any;
}

export interface Collaborator {
  document: string;
  f_name: string;
  l_name: string;
  email: string;
  bmail: string;
  position: string;
  leader: string;
  headquarters: string;
  subprocess: string;
  id_collaborator?: number,
  date: string;
  state: string;
  id: string; 
  fk_collaborator_id: string; 
  schedules: Schedule[];
}

const useCollaboratorCount = () => {

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      const response = await StatService.totalCollaboratorsActive();
      setTotal(response); 
    }
    fetchTotal();
  }, []);

  return total;

}

const CollaboratorTable = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const userRole = getUserRoleFromToken(token);
  const collaboratorService = getCollaboratorByUserRole(userRole)
  const total = useCollaboratorCount();

  const [filters, setFilters] = useState<Partial<Collaborator>>({
    document: '',
    f_name: '',
    l_name: '',
    email: '',
    bmail: '',
    position: '',
    state: '',
    leader: '',
    headquarters: '',
    subprocess: '',
  });


  useEffect(() => {
    fetchData(
      Math.ceil(first / rows) + 1,
      rows
    );
  }, [first, rows, filters, collaboratorService]);

  const fetchData = async (page: number, pageSize: number) => {
    const response = await collaboratorService(
      2,
      50
    );
  
    const filteredData = response.filter((collaborator: Collaborator) =>
      Object.entries(filters).every(([key, value]) => {
        const fieldValue = String(collaborator[key as keyof Collaborator]);
        const filterValue = value as string;
        return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
      })
    );
  
    setTotalRecords(filteredData.length);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
  
    setCollaborators(paginatedData);
  
    // setLoading(false);
  };
  

  const onPage = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
      fetchData(
        Math.ceil(first / rows) + 1,
        rows
      );
  
  };

  const updateCollaborator = async (updatedCollaborator: Collaborator) => {
  };

  const actionBodyTemplate = (rowData: Collaborator) => {
    return (
      <Button
        rounded
        text
        severity="success"
        aria-label="Editar"
        className="custom-edit-button"
        onClick={async () => {
          try {
            const schedules = await CollaboratorService.getCollaboratorSchedule(rowData.document);
            if (schedules) {
              setEditingCollaborator({ ...rowData, schedules });
            } else {
              throw new Error('No se pudieron obtener los horarios');
            }
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <MdEdit color="gray" />
      </Button>
    );
  };

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Registros</span>
    </div>
  );
  const footer = `Hay un total de ${totalRecords} registros.`;

  const pageSizeOptions = [5, 25, 50, 100];

  const filterableFields: { [key in keyof Collaborator]: string } = {
    document: 'Documento',
    f_name: 'Nombre',
    l_name: 'Apellido',
    email: 'Correo personal',
    bmail: 'Correo smart',
    position: 'Cargo',
    leader: 'Líder',
    headquarters: 'Sede',
    subprocess: 'Subproceso',
    state: 'Estado',
    date: 'Fecha',                
    id: 'ID',                       
    fk_collaborator_id: 'ID Colab.', 
    schedules: 'Horarios',          
  };
  
  const convertToString = (value: string | Schedule[] | number): string => {
    if (Array.isArray(value)) {
      return value.map((schedule) => `${schedule.day} ${schedule.arrival_time}-${schedule.departure_time}`).join(', ');
    }
    if (typeof value === 'number'){
      return value.toString();
    }
    return value;
  };
  
  const filterTemplate = (field: keyof Collaborator) => {
    return (
      <InputText
        type="text"
        value={convertToString(filters[field])}
        onChange={(e) => onFilterInputChange(e, field)}
        placeholder={`Filtrar ${filterableFields[field]}`}
      />
    );
  };
  
  

  const onFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Collaborator) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      document: '',
      f_name: '',
      l_name: '',
      email: '',
      state: '',
      position: '',
      leader: '',
      headquarters: '',
      subprocess: '',
    });
  };



  return (
    <div className="card">
      {loading ? (
      <div className="text-center">Cargando...</div>
    ) : (
      <DataTable
  tableStyle={{ width: "auto" }}
  value={collaborators}
  header={header}
  footer={footer}
  first={first}
  rows={rows}
  filterDisplay="row"
  onPage={onPage}
  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
>
        <Column
        style={{ minWidth: '14rem' }}
  field="document"
  header="Documento"
  filter={true} 
  filterElement={filterTemplate('document')}
  filterPlaceholder="Filtrar por documento"
/>
<Column
  style={{ minWidth: '16rem' }}
  field="f_name"
  header="Nombre"
  filter={true} 
  filterElement={filterTemplate('f_name')}
  filterPlaceholder="Filtrar por nombre"
/>
<Column
style={{ minWidth: '16rem' }}
  field="l_name"
  header="Apellido"
  filter={true} 
  filterElement={filterTemplate('l_name')} 
  filterPlaceholder="Filtrar por apellido"
/>
<Column
style={{ minWidth: '22rem' }}
    field="email"
    header="Correo personal"
    filter={true} 
    filterElement={filterTemplate('email')} 
    filterPlaceholder="Filtrar por correo personal"
/>
<Column
style={{ minWidth: '22rem' }}
    field="bmail"
    header="Correo smart"
    filter={true} 
    filterElement={filterTemplate('bmail')} 
    filterPlaceholder="Filtrar por correo personal"
/>
<Column
style={{ minWidth: '16rem'}}
    field="position"
    header="Cargo"
    filter={true} 
    filterElement={filterTemplate('position')}
    filterPlaceholder="Filtrar por cargo"
/>
<Column
 style={{ minWidth: '16rem'}}
    field="leader"
    header="Líder"
    filter={true} 
    filterElement={filterTemplate('leader')} 
    filterPlaceholder="Filtrar por líder"
/>
<Column
style={{ minWidth: '16rem'}}
    field="headquarters"
    header="Sede"
    filter={true} 
    filterElement={filterTemplate('headquarters')} 
    filterPlaceholder="Filtrar por sede"
/>
<Column
style={{ minWidth: '16rem'}}
    field="subprocess"
    header="Subproceso"
    filter={true} 
    filterElement={filterTemplate('subprocess')} 
    filterPlaceholder="Filtrar por líder"
/>
<Column
style={{ minWidth: '16rem'}}
    field="date"
    header="Fecha"
    filter={true} 
    filterElement={filterTemplate('date')} 
    filterPlaceholder="Filtrar por fecha"
    body={(rowData) => formatDate(rowData.date)}
/>
<Column body={actionBodyTemplate} style={{ width: '3rem' }} />
{/*  */}
    </DataTable>)}
      <Paginator
        first={first}
        rows={rows}
        totalRecords={total}
        rowsPerPageOptions={pageSizeOptions}
        onPageChange={onPage}
      />
      
      {editingCollaborator && (
        <ScheduleEditor
          collaborator={editingCollaborator}
          onSave={updateCollaborator}
          onClose={() => setEditingCollaborator(null)}
        />
      )}
    </div>
  );
};

export default CollaboratorTable;
