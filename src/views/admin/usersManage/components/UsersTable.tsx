// UsersTable.tsx
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { UserService } from 'services/UserService';
import EditUserComponent, { EditUserUserProps } from './UsersEditor';
import { RiContactsBookUploadLine } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import CreateUserComponent from './CreateUserComponent';

interface User {
    id: number;
    document: string;
    email: string;
    f_name: string;
    l_name: string;
    role: string;
}

export default function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [displayCreateDialog, setDisplayCreateDialog] = useState(false);

    useEffect(() => {
        UserService.getUserAll().then(data => setUsers(data));
    }, []);

     useEffect(() => {
        if (!displayCreateDialog) {
            // If the create dialog is closed, fetch the updated list of users
            UserService.getUserAll().then(data => setUsers(data));
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
             <Button label="Crear Usuario" onClick={handleCreateUserClick} />
            <DataTable value={users} tableStyle={{ minWidth: '50rem' }}>
                <Column field="document" header="Documento"></Column>
                <Column field="email" header="Correo"></Column>
                <Column field="f_name" header="Nombre"></Column>
                <Column field="l_name" header="Apellido"></Column>
                <Column field="role" header="Rol"></Column>
                <Column field="role_name" header="Nombre del rol"></Column>
                <Column body={actionBodyTemplate} style={{ width: '8rem', }} />
            </DataTable>

            <CreateUserComponent
                visible={displayCreateDialog}
                onHide={() => setDisplayCreateDialog(false)}
                onCreate={handleCreateUserClick} // Función para crear un nuevo usuario
            />

            {displayDialog && editingUser && (
                <EditUserComponent
                    user={editingUser}
                    onSave={updateUser}
                    onClose={() => setEditingUser(null)}
                />
            )}
        </div>
    );
}
