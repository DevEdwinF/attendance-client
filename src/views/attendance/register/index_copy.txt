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
import { ThreeDots } from  'react-loader-spinner'
import AdminIcon from 'assets/img/attendance/admin-icon.svg'

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

const sedePorSegmento: { [key: string]: string } = {
  '10.40.': 'CALASANZ',
  '10.41.': 'BELLO A (bello b)',
  '10.43.': 'CENTRO MEDELLÍN',
  '10.44.': 'ITAGÜÍ',
  '10.45.': 'ARKADIA',
  '10.46.': 'OLAYA',
  '10.47.': 'ENVIGADO',
  '10.48.': 'BELLO B (bello a)',
  '10.49.': 'SANTA FE MEDELLÍN (back up)',
  '10.0.': 'CUNDINAMARCA Administrativa',
  '10.1.': 'Chapinero A',
  '10.3.': 'Suba',
  '10.4.': 'Modelia',
  '10.5.': 'Modelia Juan Valdez',
  '10.6.': 'Plaza de las Americas',
  '10.7.': 'Centro Mayor',
  '10.8.': 'Cedritos',
  '10.9.': 'Chia',
  '10.10.': 'UNICENTRO DE OCCIDENTE',
  '10.11.': 'Madelena',
  '10.12.': 'Soacha',
  '10.13.': 'Restrepo',
  '10.14.': 'Multiplaza',
  '10.15.': 'Plaza Central',
  '10.16.': 'Mall Plaza',
  '10.17.': 'Fontanar',
  '10.18.': 'Chapinero B',
  '10.19.': 'Palatino',
  '10.20.': 'Nuestro Bogotá',
  '10.21.': 'San Martin',
  '10.22.': 'Santa Fe Bogotá',
  '10.23.': 'Hayuelos',
  '10.24.': 'Kenedy',
  '10.25.': 'SUBA AL PASO A',
  '10.70.': 'SANTANDER Piedecuesta',
  '10.71.': 'Floridablanca',
};


const AttendanceForm = () => {
  const webcamRef = useRef(null); 
  const [translatedDialog, SetTranslatedDialog] = useState(false);
  const [loginAdminContainer, setLoginAdminContainer] = useState(false);
  const [loginAdminContainerMobile, setLoginAdminContainerMobile] = useState(false);
  const [translatedMobile, setTranslatedMobile] = useState(false)
  const [location, setLocation] = useState('');
  const history: History = useHistory();
  const [cameraActive, setCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    determineLocationBasedOnIP();
  }, []);

  

  const determineLocationBasedOnIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      const userIp = data.ip;

      setLocation(getSedeFromIP(userIp));
    } catch (error) {
      console.error('Error fetching IP:', error);
    }
  };

  const getSedeFromIP = (ip: string): string => {
    const segment = ip.split('.').slice(0, 2).join('.');

    return sedePorSegmento[segment] || 'CASA';
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
  
    if (values.document === '' || values.state === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios incluida la foto!',
      });
    } else {
      const video = webcamRef.current;
      const imageSrc = video.getScreenshot();
      console.log('Imagen capturada:', imageSrc);
  
      const formData = new FormData();
      formData.append('document', values.document);
      formData.append('state', values.state);
  
      // Obtener el segmento de la dirección IP
      const ipAddress = '10.41.0.20'; // Aquí debes colocar la dirección IP real
      const ipSegment = ipAddress.split('.').slice(0, 2).join('.');
  
      // Asignar la sede basada en el segmento
      if (sedePorSegmento[ipSegment]) {
        formData.append('location', sedePorSegmento[ipSegment]);
      } else {
        // Si no coincide ningún segmento, marcar como casa
        formData.append('location', 'casa');
      }
  
      formData.append('photo', imageSrc);
  
      try {
        setIsLoading(true);
        await AttendanceService.register(formData);
        handleCloseDialog();
        window.close();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
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
          <p>Ingreso administrador <img src={AdminIcon} alt="" /></p>
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
                    <button className="btn-attendance" type="submit" disabled={isLoading}>
        {isLoading ? ( // Mostrar loader si está en estado de carga
          <ThreeDots 
          height="50" 
          width="50" 
          radius="9"
          color="#fff" 
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          visible={true}
           />
        ) : (
          'Enviar registro'
        )}
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
                    <button className="btn-attendance" type="submit" disabled={isLoading}>
        {isLoading ? ( // Mostrar loader si está en estado de carga
          <ThreeDots 
          height="50" 
          width="50" 
          radius="9"
          color="#fff" 
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          visible={true}
           />
        ) : (
          'Enviar registro'
        )}
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
              <img src={AdminIcon} />
            </button>
          </div>
        </div>
        
        {/* ___ */}
        
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
      <div className={`login-admin-container-mobile${loginAdminContainerMobile ? ' login-admin-container-mobile-open' : ''}`}>
          <div className='login-admin-content'>
            <Formik initialValues={initialValuesLogin} onSubmit={handleLogin}>
              <Form className='login-admin-form'>
                <label className='btn-cancel-mobile' onClick={handleCloseDialog}>
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
    </>
  );
};

export default AttendanceForm;



