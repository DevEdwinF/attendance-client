// CreateUserComponent.tsx
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { UserService } from 'services/UserService';
import Swal from 'sweetalert2';

export interface UserCreate {
    document: string;
    email: string;
    password: string;
    f_name: string;
    l_name: string;
    rol: number;
}

interface CreateUserProps {
    visible: boolean;
    onHide: () => void;
    onCreate: (user: UserCreate) => void;
}

const CreateUserComponent: React.FC<CreateUserProps> = ({ visible, onHide, onCreate }) => {
    const [document, setDocument] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [f_name, setFName] = useState('');
    const [l_name, setLName] = useState('');
    const [role, setRole] = useState<number | null>(null);

    const handleCreate = async () => {
        if (!document || !email || !f_name || !l_name || role === null) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const newUser: UserCreate = {
            document,
            email,
            password,
            f_name,
            l_name,
            rol: role as number,
        };

        try {
            const response = await UserService.create(newUser); 
            Swal.fire(
                'Bien hecho!',  
                response,
                'success'
            )
            onCreate(newUser); // Añade el usuario localmente solo después de que el servidor responda con éxito
            onHide();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Error",
            });
        }
    };

    return (
        <Dialog header="Crear Usuario" visible={visible} onHide={onHide}>
            <div>
                <label>Documento:</label>
                <InputText value={document} onChange={(e) => setDocument(e.target.value)} />

                <label>Correo:</label>
                <InputText value={email} onChange={(e) => setEmail(e.target.value)} />

                <label>Contraseña:</label>
                <InputText value={password} onChange={(e) => setPassword(e.target.value)} />

                <label>Nombre:</label>
                <InputText value={f_name} onChange={(e) => setFName(e.target.value)} />

                <label>Apellido:</label>
                <InputText value={l_name} onChange={(e) => setLName(e.target.value)} />

                <label>Rol:</label>
                <Dropdown
                    value={role}
                    options={[1, 2, 3]} // Cambia esto a las opciones reales de roles
                    onChange={(e) => setRole(e.value)}
                    placeholder="Seleccionar rol"
                />

                <Button label="Crear" onClick={handleCreate} />
                <Button label="Cancelar" onClick={onHide} />
            </div>
        </Dialog>
    );
};

export default CreateUserComponent;