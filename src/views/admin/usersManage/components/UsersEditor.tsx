// UsersEditor.tsx
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                <div className='form-update-user'>
                    <span>Documento:</span>
                    <InputText name="document" value={editedUser.document} onChange={handleInputChange} />
                </div>
                <div>
                    <span>Correo:</span>
                    <InputText name="email" value={editedUser.email} onChange={handleInputChange} />
                </div>
                <div>
                    <span>Contraseña:</span>
                    <InputText type="password" name="password" value={editedUser.password} onChange={handleInputChange} />
                </div>
                <div>
                    <span>Nombre:</span>
                    <InputText name="f_name" value={editedUser.f_name} onChange={handleInputChange} />
                </div>
                <div>
                    <span>Apellido:</span>
                    <InputText name="l_name" value={editedUser.l_name} onChange={handleInputChange} />
                </div>
                <hr />
                <h3 style={{ textAlign: 'center' }}>Datos de acceso</h3>
                <div>
                    <span>Rol:</span>
                    <InputText name="role" value={editedUser.role} onChange={handleInputChange} />
                </div>

                <div>
                    <Button label="Guardar" onClick={handleSave} />
                    <Button label="Cancelar" onClick={onClose} className="p-button-secondary p-ml-2" />
                </div>
            </div>
        </Dialog>
    );
};

export default EditUserComponent;
