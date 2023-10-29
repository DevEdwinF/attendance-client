// UsersTable.tsx
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { FilterUser, UserService } from 'services/User.service';
import EditUserComponent, { EditUserUserProps } from './UsersEditorCompnent';
import { RiContactsBookUploadLine } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import CreateUserComponent, { Roles } from './CreateUserComponent';
import { useColorModeValue } from '@chakra-ui/system';
import { RolesService } from 'services/Roles.service';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';

interface User {
    id: number;
    document: string;
    email: string;
    f_name: string;
    l_name: string;
    rol: number;
}

export default function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [displayCreateDialog, setDisplayCreateDialog] = useState(false);
    const [roles, setRoles] = useState<Roles[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [row, setRow] = useState(5);
    const brandColor = useColorModeValue('brand.500', 'white');
    const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

    const [filters, setFilters] = useState<Partial<User>>({
        id: 0,
        document: '',
        email: '',
        f_name: '',
        l_name: '',
        rol: 0,
    });

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await RolesService.getAllRoles();
                setRoles(rolesData);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        fetchData(
            currentPage,
            row,
            filters
        )
    }, [currentPage, row, filters]);

    const fetchData = async (page: number, limit: number, filter: FilterUser) =>{
        try {
            const {rows, total_rows} = await UserService.getUserAll(
                page,
                limit,
                filter
            );

            setTotalRecords(total_rows)

            setUsers(rows);
        } catch (error) {
            
        }
    }
    

     useEffect(() => {
        if (!displayCreateDialog) {
            fetchData(
                currentPage,
                row,
                filters
            );
        }
    }, [displayCreateDialog]);

    const handleCreateUserClick = () => {
        setDisplayCreateDialog(true);
    };

    const editUser = (user: User) => {
        setEditingUser(user);
        setDisplayDialog(true);
    };

    const updateUser = async (editedUser: User) => {
        try {
            const response = await UserService.updateUser(editedUser);
            Swal.fire({
                // position: 'top-end',
                icon: 'success',
                title: response,
                showConfirmButton: false,
                timer: 1500
            });
            setUsers(prevUsers =>
                prevUsers.map(prevUser => (prevUser.id === editedUser.id ? editedUser : prevUser))
            );
            setEditingUser(null);
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    };

    const footer = `Hay un total de ${totalRecords} registros.`;

    const deleteUser = async (user: User) => {
        try {
            /* How create question what eliminated user? */
            const response =
                await Swal.fire({
                    title: '¿Está seguro?',
                    text: "¡No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: 'rgb(144, 191, 178)',
                    cancelButtonColor: 'rgb(196, 48, 48)',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Si, eliminar'
                })
            if (response.isConfirmed) {
                const response = await UserService.deleteUser(user.document);
                Swal.fire(
                    '¡Eliminado!',
                    response,
                    'success'
                )
                setUsers(prevUsers => prevUsers.filter(prevUser => prevUser.id !== user.id));
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };


    const onHideDialog = () => {
        setDisplayDialog(false);
    };

    const filterTemplate = (field: keyof User) =>{
        const filterValue = filters[field] as string;
        const filterableFields = {
            id: 'ID',
            document: 'Documento',
            email: 'Correo',
            f_name: 'Nombre',
            l_name: 'Apellido',
            rol: 'Rol',
        };
        return (
            <InputText
          type="text"
          value={filterValue}
          onChange={(e) => onFilterInputChange(e, field)}
          placeholder={`Filtrar  ${filterableFields[field]}`}
        />
        )
    }

    const onFilterInputChange =(e: React.ChangeEvent<HTMLInputElement>,
        field: keyof User) => {
        setFilters({ ...filters, [field]: e.target.value });
        }

        const onPage = (event: { first: number; rows: number; page: number }) => {
            setFirst(event.first);
            setRow(event.rows);
            
            setCurrentPage(event.page + 1)
          };

    const actionBodyTemplate = (rowData: User) => {
        return (
            <div style={{display:"flex", flexDirection:"row"}}>
                <Button  rounded  text severity="success" aria-label="Editar" className="custom-edit-button" onClick={() => editUser(rowData)}><MdEdit color="gray" /></Button>
                <Button rounded text severity="danger" aria-label="Cancel" onClick={() => deleteUser(rowData)} ><MdDeleteOutline color="gray"/> </Button>
            </div>
        );
    };

    return (
        <div className="card">
             <button className='btn-create-user-open' onClick={handleCreateUserClick}>Crear un nuevo usuario</button>
            <DataTable value={users} tableStyle={{ minWidth: '50rem' }}
            rows={row}
            footer={footer}
            >
                <Column field="document" header="Documento"
                ></Column>
                <Column field="email" header="Correo"></Column>
                <Column field="f_name" header="Nombre"></Column>
                <Column field="l_name" header="Apellido"></Column>
                {/* <Column field="rol" header="Rol"></Column> */}
                <Column field="role_name" header="Nombre del rol"></Column>
                <Column body={actionBodyTemplate} style={{ width: '8rem', }} />
            </DataTable>

            <Paginator
          first={first}
          rows={row}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={onPage}
        />

            <CreateUserComponent
                visible={displayCreateDialog}
                onHide={() => setDisplayCreateDialog(false)}
                onCreate={handleCreateUserClick}
            />

            {displayDialog && editingUser && (
                <EditUserComponent
                user={editingUser}
                onSave={updateUser}
                onClose={() => setEditingUser(null)}
                roles={roles}
                brandColor="yourBrandColor"
                boxBg="yourBoxBackgroundColor"
            />
    
            )}
        </div>
    );
}
