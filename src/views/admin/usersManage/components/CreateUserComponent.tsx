import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { UserService } from 'services/User.service';
import Swal from 'sweetalert2';
import '../style/style.css';
import { RolesService } from 'services/Roles.service';

export interface UserCreate {
    document: string;
    email: string;
    password: string;
    f_name: string;
    l_name: string;
    rol: number;
}

export interface Roles {
    id: number;
    name: string;
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
    const [roles, setRoles] = useState<Roles[]>([]);
    const [role, setRole] = useState<number | null>(null);

    const handleFNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFName(e.target.value.toUpperCase());
    };

    const handleLNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLName(e.target.value.toUpperCase());
    };

    const fetchDataRole = async () => {
        try {
            const response = await RolesService.getAllRoles();
            setRoles(response);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    useEffect(() => {
        fetchDataRole();
    }, []);

    const handleCreate = async () => {
        if (!document || !email || !f_name || !l_name || role === null) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const newUser: UserCreate = {
            document,
            email,
            password,
            f_name: f_name.toUpperCase(), // Convertir a mayúsculas
            l_name: l_name.toUpperCase(), // Convertir a mayúsculas
            rol: role as number,
        };

        try {
            const response = await UserService.create(newUser);
            Swal.fire('Bien hecho!', response, 'success');
            onCreate(newUser);
            onHide();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error',
            });
        }
    };

    const handleRoleChange = (selectedRole: number) => {
        setRole(selectedRole);
    };


    return (
        <Dialog header="Crear Usuario" visible={visible} onHide={onHide}>
            <div className='user-data-content'>
                <label>Documento:</label>
                <InputText style={{borderRadius:"30px", marginBottom: "15px"}} value={document} onChange={(e) => setDocument(e.target.value)} />

                <label>Correo:</label>
                <InputText style={{borderRadius:"30px", marginBottom: "20px"}} value={email} onChange={(e) => setEmail(e.target.value)} />

                <label>Contraseña:</label>
                <InputText style={{borderRadius:"30px", marginBottom: "15px"}} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <label>Nombre:</label>
                <InputText style={{borderRadius:"30px", marginBottom: "15px"}} value={f_name} onChange={handleFNameChange} />

                <label>Apellido:</label>
                <InputText style={{borderRadius:"30px", marginBottom: "15px"}} value={l_name} onChange={handleLNameChange} />

                <label>Rol:</label>
                <Dropdown style={{borderRadius:"30px", marginBottom: "15px"}}
                    value={role}
                    options={roles.map((r) => ({ value: r.id, label: r.name }))}
                    onChange={(e) => handleRoleChange(e.value)}
                    placeholder="Seleccionar rol"
                />

                {/* <Button label="Crear" onClick={handleCreate} />
                <Button label="Cancelar" onClick={onHide} /> */}
                <div className='btn-create-user-content'>
                    <button className="btn-cancel-create-user" onClick={onHide}>cancelar</button>
                    <button className="btn-create-user" onClick={handleCreate}>Crear</button>
                </div>
            </div>
        </Dialog>
    );
};

export default CreateUserComponent;
