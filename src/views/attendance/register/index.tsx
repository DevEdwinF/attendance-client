import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { AttendanceService } from 'services/Attendance.service';
import Swal from 'sweetalert2';
import Clock from 'util/ClockUtil';
import Webcam from 'react-webcam';
import { Dialog } from 'primereact/dialog';
import TranslatedRegister from '../components/TranslatedRegister';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import './index.css';
import { AuthService } from 'services/Auth.service';
import { MdArrowCircleLeft } from 'react-icons/md';
import { Image } from '@chakra-ui/react';
import AirplanePapper from 'assets/img/imgUtil/airplane-papper.svg'

interface FormValues {
  document: string | null;
  state: string;
  location: string;
  photo: string;
}



interface loginValues {
  email: string;
  password: string;
}

const initialValuesLogin: loginValues = {
  email: '',
  password: '',
}

const AttendanceForm = () => {
  const webcamRef = useRef(null); 
  const [translatedDialog, SetTranslatedDialog] = useState(false);
  const [loginAdminContainer, setLoginAdminContainer] = useState(false);
  const [loginAdminContainerMobile, setLoginAdminContainerMobile] = useState(false);
  const [translatedMobile, setTranslatedMobile] = useState(false)
  const [location, setLocation] = useState('');
  const history: History = useHistory();
  const [cameraActive, setCameraActive] = useState(false);

  const initialValues = {
    document: '',
    state: '',
    location: location,
    photo: '',
  };

  useEffect(() => {
    async function initializeCamera() {
      const videoConstraints = {
        facingMode: 'user',
      };
  
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          setCameraActive(true); 
        }
      } catch (error) {
        console.error('Error al habilitar la cámara:', error);
      }
    }
  
    initializeCamera();
    getIp();
  }, []);
  

  const getIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      const userIp = data.ip;

      const allowedOfficeIp = '190.217.98.138';
      if (userIp === allowedOfficeIp) {
        setLocation('oficina');
      } else {
        setLocation('casa');
      }
    } catch (error) {
      console.error('Error fetching IP:', error);
    }
  };

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
    setLoginAdminContainerMobile(false);

  };

  const handleTranslatedDialog = () => {
    SetTranslatedDialog(!translatedDialog);
  }

  const handleCloseDialogMobile = () => {
    setTranslatedMobile(false);
  };

  //

  const handleSubmit = async (values: FormValues) => {
    if (!cameraActive) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La cámara no está activada. Activa la cámara antes de registrar.',
      });
      return; 
    }
    if (values.document === '' || values.state === '' 
  ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios incluida la foto!',
      });
    } else {
      const video = webcamRef.current;
      const imageSrc = video.getScreenshot();
      console.log("Imagen capturada:", imageSrc);

      const formData = new FormData();
      formData.append('document', values.document);
      formData.append('state', values.state);
      formData.append('location', location);
      formData.append('photo', imageSrc);

      try {
        await AttendanceService.validate(values.document);
        await AttendanceService.register(formData);
        handleCloseDialog();
        window.close();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLoginAdminClick = () => {
    setLoginAdminContainer(true);
  };
  const handleLoginAdminMobileClick = () => {
    setLoginAdminContainerMobile(true);
  };

  const handleTranslatedMobileClick = () => {
    setTranslatedMobile(!translatedMobile);
  }

  const attendanceWarning = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Recuerda que si te encuentras en nuestras instalaciones, es importante realizar el registro mientras estás conectado a nuestra red de internet. Esto ayudará a validar tu presencia de manera adecuada.',
      confirmButtonColor: 'rgb(163, 190, 50)',
      confirmButtonText: 'Aceptar',
    });
  };

  useEffect(() => {
    attendanceWarning()
  }, []);


  return (
    <>
      <div className="attendance-register-container-desktop">
        <label className="btn-translated" aria-hidden="true" onClick={handleLoginAdminClick}>
          <p>Ingreso administrador</p>
        </label>
        <div className="attendance-register-content">
          <div className="cam-content">
            <Webcam audio={false} key={Date.now()}
              ref={webcamRef} screenshotFormat="image/png" className="cam" />
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
                      type="text"
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
                    <ErrorMessage name="state" component="div" />
                    <button className="btn-attendance" type="submit">
                      Enviar registro
                      <Image src={AirplanePapper} />
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

      {/* MOBILE FORM */}
      <div className='attendance-register-container-mobile'>
        <div className='attendance-register-content-mobile'>
          <div className="cam-content">
            <Webcam audio={false} key={Date.now()}
              ref={webcamRef} screenshotFormat="image/png" className="cam" />
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
                      type="text"
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
                    <ErrorMessage name="state" component="div" />
                    <button className="btn-attendance" type="submit">
                      Enviar registro
                    <Image src={AirplanePapper} />
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
            <button className='btn-admin-login-mobile' onClick={handleLoginAdminMobileClick}>
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
        {/* ___ */}
        <div className={`login-admin-container-mobile${loginAdminContainerMobile ? ' login-admin-container-mobile-open' : ''}`}>
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
        {/* _____ */}
      </div>
    </>
  );
};

export default AttendanceForm;



