import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

interface UserInfo {
  fName: string;
  lName: string;
  role: string;
  roleName: string;
}

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: UserInfo;
  onSave: (updatedUserInfo: UserInfo) => void;
}

export function EditProfileDialog(props: EditProfileDialogProps) {
  const { isOpen, onClose, userInfo, onSave } = props;
  const [editedUserInfo, setEditedUserInfo] = useState(userInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedUserInfo);
    onClose();
  };

  return (
    <Dialog visible={isOpen} onHide={onClose} header="Editar Perfil" footer={null}>
      <div>
        <label htmlFor="fName">Nombre</label>
        <InputText
          id="fName"
          name="fName"
          value={editedUserInfo.fName}
          onChange={handleChange}
        />

        <label htmlFor="lName">Apellido</label>
        <InputText
          id="lName"
          name="lName"
          value={editedUserInfo.lName}
          onChange={handleChange}
        />

        {/* Agrega más campos de perfil según sea necesario */}

        <div>
          <Button label="Guardar" onClick={handleSave} className="p-button-success" />
          <Button
            label="Cancelar"
            onClick={onClose}
            className="p-button-secondary"
          />
        </div>
      </div>
    </Dialog>
  );
}
