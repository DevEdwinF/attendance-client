import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRef, useState } from 'react';
import { AttendanceService } from 'services/AttendanceService';
import Swal from 'sweetalert2';
import Clock from 'util/ClockUtil';
import Webcam from 'react-webcam';
import { Dialog } from 'primereact/dialog';
import TranslatedRegister from '../components/TranslatedRegister';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import './index.css';
import { AuthService } from 'services/AuthService';
import { MdArrowCircleLeft } from 'react-icons/md';
import { Image } from '@chakra-ui/react';
import AirplanePapper from 'assets/img/imgUtil/airplane-papper.svg'

interface FormValues {
  document: number | null;
  state: string;
  location: string;
  photo: string;
}

const initialValues: FormValues = {
  document: null,
  state: '',
  location: '',
  photo: '',
};

interface loginValues {
  email: string;
  password: string;
}

const initialValuesLogin: loginValues = {
  email: '',
  password: '',
}

const MyForm = () => {
  const webcamRef = useRef(null);
  const [translatedDialog, SetTranslatedDialog] = useState(false);
  const [loginAdminContainer, setLoginAdminContainer] = useState(false);
  const [translatedMobile, setTranslatedMobile] = useState(false)
  const history: History = useHistory();

  const handleLogin = async (values: loginValues) => {
    try {
      const response = await AuthService.login(values);
      localStorage.setItem('token', response);
      window.location.reload();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Usuario o clave incorrectos',
      });
    }
  };

  const handleCloseDialog = () => {
    setLoginAdminContainer(false);
  };

  const handleTranslatedDialog = () =>{
    SetTranslatedDialog(!translatedDialog);
  }

  const handleCloseDialogMobile = () => {
    setTranslatedMobile(false);
  };

  const handleSubmit = async (values: FormValues) => {
    if (values.document === null || values.state === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios!',
      });
    } else {
      const imageSrc = webcamRef.current.getScreenshot();
      const { document, state, location } = values;
      const photo = imageSrc as string;

      await AttendanceService.validate(document);
      await AttendanceService.register({ document, state, location, photo })
        .then(() => {
          handleCloseDialog();
          window.close();
        });
    }
  };


  const handleLoginAdminClick = () => {
    setLoginAdminContainer(true);
  };

  const handleTranslatedMobileClick = () => {
    setTranslatedMobile(!translatedMobile);
  }

  return (
    <>
      <div className="attendance-register-container-desktop">
        <label className="btn-translated" aria-hidden="true" onClick={handleLoginAdminClick}>
          <p>Ingreso administrador</p>
        </label>
        <div className="attendance-register-content">
          <div className="cam-content">
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="cam" />
            <Clock />
          </div>
          <div className="form">
            <div className="main">
              <div className="signup">
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                  <Form>
                    <label className="label title" aria-hidden="true">
                      <h2 className="hi-tittle">Hola,</h2>
                    </label>
                    <h2 className="hi-msg">Bienvenido(a) de nuevo</h2>
                    <label className="label" htmlFor="document">
                      Documento:
                    </label>
                    <Field
                      type="number"
                      id="document"
                      name="document"
                      placeholder="Ingresa aquí tu documento"
                      className="field-style"
                    />
                    <ErrorMessage name="document" component="div" />

                    <label className="label" htmlFor="state">
                      ¿Qué vas a registrar?
                    </label>
                    <Field
                      as="select"
                      id="state"
                      name="state"
                      className="field-style"
                    >
                      <option className='select-text' value="">Seleccionar...</option>
                      <option value="arrival">Llegada</option>
                      <option value="departure">Salida</option>
                    </Field>
                    <label className="label" htmlFor="location">
                      ¿Dónde te encuentras?
                    </label>
                    <Field
                      as="select"
                      id="location"
                      name="location"  
                      className="field-style"  
                    >
                      <option value="">Seleccionar...</option>
                      <option value="casa">Casa</option>
                      <option value="oficina">Oficina</option>
                    </Field>
                    <ErrorMessage name="state" component="div" />
                    <button className="btn-attendance" type="submit">
                      Enviar registro 
                     
                      &nbsp

                      <Image src={AirplanePapper}/>
                    </button>
                  </Form>
                </Formik>

              </div>
            </div>
            <div className={`translated-container${translatedDialog ? ' translated-container-open' : ''}`}>
              <label className="translated-tittle" aria-hidden="true" onClick={handleTranslatedDialog}>
                <h2>Traslados</h2>
              </label>
              <TranslatedRegister />
            </div>
          </div>
          ----
        </div>
        <div className={`login-admin-container${loginAdminContainer ? ' login-admin-container-open' : ''}`}>
          <div className='login-admin-content'>
            <Formik initialValues={initialValuesLogin} onSubmit={handleLogin}>
              <Form className='login-admin-form'>
                <label className='btn-cancel' onClick={handleCloseDialog}>
                  <MdArrowCircleLeft className='icon-cancel' />
                </label>
                <label className='login-admin-tittle'>
                  Ingreso Administrador
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Correo smart"
                  className="field-style field-email"
                />
                <Field
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  className="field-style field-password"
                />
                <button className="btn-login-admin" type="submit">
                  Entrar
                </button>

              </Form>
            </Formik>
          </div>


        </div>

      </div>

      <div className='attendance-register-container-mobile'>
        <div className='attendance-register-content-mobile'>
          <div className="cam-content">
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="cam" />
            <Clock />
          </div>
          <div className="form-mobile">
            <div className="main">
              <div className="signup">
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                  <Form>
                    <label className="label title" htmlFor="chk" aria-hidden="true">
                      <h2 className="hi-tittle">Hola,</h2>
                    </label>
                    <h2 className="hi-msg">Bienvenido(a) de nuevo</h2>

                    <label className="label" htmlFor="document">
                      Documento:
                    </label>
                    <Field
                      type="number"
                      id="document"
                      name="document"
                      placeholder="Ingresa aquí tu documento"
                      style={{
                        width: '100%',
                        border: '1px solid #b3b3b3',
                        borderRadius: '5px',
                        padding: '5px',
                      }}
                    />
                    <ErrorMessage name="document" component="div" />

                    <label className="label" htmlFor="state">
                      ¿Qué vas a registrar?
                    </label>
                    <Field
                      as="select"
                      id="state"
                      name="state"
                      style={{
                        width: '100%',
                        border: '1px solid #b3b3b3',
                        borderRadius: '5px',
                        padding: '5px',
                      }}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="arrival">Llegada</option>
                      <option value="departure">Salida</option>
                    </Field>
                    <label className="label" htmlFor="location">
                      ¿Dónde te encuentras?
                    </label>
                    <Field
                      as="select"
                      id="location"
                      name="location"
                      style={{
                        width: '100%',
                        border: '1px solid #b3b3b3',
                        borderRadius: '5px',
                        padding: '5px',
                      }}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="casa">Casa</option>
                      <option value="oficina">Oficina</option>
                    </Field>
                    <ErrorMessage name="state" component="div" />
                    <button className="button-attendance" type="submit">
                      Enviar registro
                    </button>

                  </Form>
                </Formik>
              </div>
            </div>
          </div>
          <div className='btn-section-mobile'>
            <button className='btn-translated-mobile' onClick={handleTranslatedMobileClick}>
              Translados
            </button>
            <button className='btn-admin-login-mobile'>
              Administrador
            </button>
          </div>
        </div>
        <div className={`translated-content-mobile${translatedMobile ? ' translated-content-mobile-open' : ''}`}>
          <label className='btn-cancel-login' onClick={handleTranslatedMobileClick}>
            <MdArrowCircleLeft className='icon-cancel' />
          </label>
          <label className="translated-tittle" aria-hidden="true" onClick={handleTranslatedMobileClick}>
            Translados
          </label>
          <TranslatedRegister />
        </div>
      </div>

    </>
  );
};

export default MyForm;
