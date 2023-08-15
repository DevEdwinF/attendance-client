import { Dialog } from 'primereact/dialog';
import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { UserService } from 'services/UserService';
import { Formik, Field, Form } from 'formik';
import { useHistory } from 'react-router-dom';
import { AuthService } from 'services/AuthService';

export interface ProfileConfigInterface {
  document: string;
  email: string;
  password: string;
  f_name: string;
  l_name: string;
}

interface ProfileConfigProps {
  visible: boolean;
  onHide: () => void;
  onCreate: (user: ProfileConfigInterface) => void;
}

const ProfileConfig: React.FC<ProfileConfigProps> = ({ visible, onHide, onCreate }) => {
  const [userProfile, setUserProfile] = useState<ProfileConfigInterface | undefined>(undefined);
  const history = useHistory();

  const jwt = localStorage.getItem('token');
  let userDocument = '';

  if (jwt) {
    const decodedToken = jwt_decode<{ document: string }>(jwt);
    userDocument = decodedToken.document;
  }

  const fetchData = async (id: string) => {
    try {
      const response = await UserService.getUserById(id);
      setUserProfile(response);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    if (userDocument) {
      fetchData(userDocument);
    }
  }, [userDocument]);

  const handleUpdateUser = async (updatedProfileData: ProfileConfigInterface) => {
    try {
      const response = await UserService.updateUser(updatedProfileData);
      setUserProfile(prevProfile => ({
        ...prevProfile,
        ...response,
      }));
      // await AuthService.logout()
      // history.push('/');
    } catch (error) {
      throw error;
    }
  }

  return (
    <Dialog header="Configuración de mi perfil" visible={visible} onHide={onHide}>
      {userProfile !== undefined ? (
        <Formik initialValues={userProfile} onSubmit={handleUpdateUser}>
          <Form>
            <label className="label" htmlFor="document">
              Documento:
            </label>
            <Field
              type="text"
              id="document"
              name="document"
              placeholder="Ingresa aquí tu documento"
              className="field-style"
              disabled 
            />
            <label className="label" htmlFor="email">
              Email:
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa aquí tu email"
              className="field-style"
              disabled
            />
            <label className="label" htmlFor="password">
              Contraseña:
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa aquí tu contraseña"
              className="field-style"
            />
            <label className="label" htmlFor="f_name">
              Nombre:
            </label>
            <Field
              type="text"
              id="f_name"
              name="f_name"
              placeholder="Ingresa aquí tu nombre"
              className="field-style"
            />
            <label className="label" htmlFor="l_name">
              Apellido:
            </label>
            <Field
              type="text"
              id="l_name"
              name="l_name"
              placeholder="Ingresa aquí tu apellido"
              className="field-style"
            />
            
            <button type="submit" className="button-style">
              Actualizar
            </button>
          </Form>
        </Formik>
      ) : (
        <p>Cargando datos...</p>
      )}
    </Dialog>
  );
};

export default ProfileConfig;
