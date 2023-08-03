// UsersTable.tsx
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { UserService } from 'services/UserService';
import EditUserComponent, { EditUserUserProps } from './UsersEditor';

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

    useEffect(() => {
        UserService.getUserAll().then(data => setUsers(data));
    }, []);

    const editUser = (user: User) => {
        setEditingUser(user);
        setDisplayDialog(true);
    };

    const updateUser = async (editedUser: User) => {
        try {
            const message = await UserService.updateUser(editedUser);
            console.log(message); // Puedes mostrar un mensaje de éxito si lo deseas
            // Actualiza el estado de los usuarios con los datos actualizados
            setUsers(prevUsers =>
                prevUsers.map(prevUser => (prevUser.id === editedUser.id ? editedUser : prevUser))
            );
            setEditingUser(null); // Cierra el diálogo de edición
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            // Puedes mostrar un mensaje de error si lo deseas
        }
    };

    const deleteUser = (user: User) => {
        // Implementar lógica para eliminar el usuario
    };

    const onHideDialog = () => {
        setDisplayDialog(false);
    };

    const actionBodyTemplate = (rowData: User) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteUser(rowData)} />
            </>
        );
    };

    return (
        <div className="card">
            <DataTable value={users} tableStyle={{ minWidth: '50rem' }}>
                <Column field="document" header="Documento"></Column>
                <Column field="email" header="Correo"></Column>
                <Column field="f_name" header="Nombre"></Column>
                <Column field="l_name" header="Apellido"></Column>
                <Column field="role" header="Rol"></Column>
                <Column field="role_name" header="Nombre del rol"></Column>
                <Column body={actionBodyTemplate} style={{ width: '8rem' }} />
            </DataTable>

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
