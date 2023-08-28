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
    rol: number;
    password?: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface EditUserUserProps {
    user: User;
    onSave: (editedUser: User) => void;
    onClose: () => void;
    brandColor: string;
    boxBg: string;
    roles: Role[]; 
}

const EditUserComponent: React.FC<EditUserUserProps> = ({
    user,
    onSave,
    onClose,
    brandColor,
    boxBg,
    roles,
}) => {
    const [editedUser, setEditedUser] = useState<User>({ ...user, password: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedValue = name === 'rol' ? parseInt(value, 10) : value;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: updatedValue,
        }));
    };

    const handleFNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUser((prevUser) => ({
            ...prevUser,
            f_name: e.target.value.toUpperCase(),
        }));
    };

    const handleLNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUser((prevUser) => ({
            ...prevUser,
            l_name: e.target.value.toUpperCase(),
        }));
    };

    const handleSave = () => {
        onSave(editedUser);
    };

    return (
        <Dialog visible={true} header="Editar usuarios" onHide={onClose}>
            <div style={{ backgroundColor: boxBg }}>
                <div className="user-data-content">
                    <span>Documento:</span>
                    <InputText name="document" value={editedUser.document} onChange={handleInputChange} />

                    <span>Correo:</span>
                    <InputText name="email" value={editedUser.email} onChange={handleInputChange} />

                    <span>Contraseña:</span>
                    <InputText type="password" name="password" value={editedUser.password} onChange={handleInputChange} />

                    <span>Nombre:</span>
                    <InputText name="f_name" value={editedUser.f_name} onChange={handleFNameChange} />

                    <span>Apellido:</span>
                    <InputText name="l_name" value={editedUser.l_name} onChange={handleLNameChange} />
                </div>

                <span>Rol:</span>

                <select name="rol" value={editedUser.rol} onChange={handleInputChange}>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>

                <div className="btn-create-user-content">
                    <button className="btn-cancel-create-user" onClick={onClose}>
                        cancelar
                    </button>
                    <button className="btn-create-user" onClick={handleSave}>
                        Actualizar
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default EditUserComponent;
