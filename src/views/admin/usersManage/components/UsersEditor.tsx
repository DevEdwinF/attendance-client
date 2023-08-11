// UsersEditor.tsx
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import '../style/style.css';

interface User {
    id: number;
    document: string;
    email: string;
    f_name: string;
    l_name: string;
    role: string;
    password?: string;
}

export interface EditUserUserProps {
    user: User;
    onSave: (editedUser: User) => void;
    onClose: () => void;
}

const EditUserComponent: React.FC<EditUserUserProps> = ({ user, onSave, onClose }) => {
    const [editedUser, setEditedUser] = useState<User>({ ...user, password: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSave = () => {
        onSave(editedUser);
    };

    return (
        <Dialog visible={true} style={{ width: '45vw' }} header="Editar usuarios" onHide={onClose}>
            <div>
                <div className='user-data-content'>
                    <span>Documento:</span>
                    <InputText name="document" value={editedUser.document} onChange={handleInputChange} />
               
                    <span>Correo:</span>
                    <InputText name="email" value={editedUser.email} onChange={handleInputChange} />
                
                    <span>Contraseña:</span>
                    <InputText type="password" name="password" value={editedUser.password} onChange={handleInputChange} />
               
                    <span>Nombre:</span>
                    <InputText name="f_name" value={editedUser.f_name} onChange={handleInputChange} />
               
                    <span>Apellido:</span>
                    <InputText name="l_name" value={editedUser.l_name} onChange={handleInputChange} />
                </div>
                
                    <span>Rol:</span>

                    {/* Seleccionar rol con dropdown */}
                    <select name="role" value={editedUser.role} onChange={handleInputChange}>
                        <option value="1">Administrador</option>
                        <option value="2">Usuario</option>
                        <option value="3">Invitado</option>
                    </select>
                

                <div className='btn-create-user-content'>
                <button className="btn-cancel-create-user" onClick={onClose}>cancelar</button>
                <button className="btn-create-user" onClick={handleSave}>Actualizar</button>
                </div>
            </div>
        </Dialog>
    );
};

export default EditUserComponent;
