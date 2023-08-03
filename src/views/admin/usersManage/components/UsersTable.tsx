import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { UserService } from 'services/UserService';

interface User {
    id: number;
    document: string;
    email: string;
    f_name: string;
    l_name: string;
    // password: string;
    role: string;
    role_name: string;
}


export default function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        UserService.getUserAll().then(data => setUsers(data));
    }, []);

    return (
        <div className="card">
            <DataTable value={users} tableStyle={{ minWidth: '50rem' }}>
                {/* <Column field="id" header="id"></Column> */}
                <Column field="document" header="Documento"></Column>
                <Column field="email" header="Correo"></Column>
                <Column field="f_name" header="Nombre"></Column>
                <Column field="l_name" header="Apellido"></Column>
                {/* <Column field="password" header="Contraseña"></Column> */}
                <Column field="role" header="Rol"></Column>
                <Column field="role_name" header="Nombre del rol"></Column>
            </DataTable>
        </div>
    );
}