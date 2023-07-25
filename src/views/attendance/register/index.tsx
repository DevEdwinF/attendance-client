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
  const [translated, setTranslated] = useState(false);
  const [translatedM, setTranslatedM] = useState(false)
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
    setTranslated(false);
    console.log('handleCloseDialog is being called');
    console.log(`translated state after handleCloseDialog: ${translated}`);
  };

  const handleCloseDialogMobile = () => {
    setTranslatedM(false);
    console.log('handleCloseDialog is being called');
    console.log(`translated state after handleCloseDialog: ${translatedM}`);
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


  const handleTranslatedClick = () => {
    setTranslated(true);
  };

  const handleTranslatedMClick = () =>{
    setTranslatedM(!translatedM);
  }

  return (
    <>
      <section className="attendance-register-container-desktop">
        <label className="btn-translated" aria-hidden="true" onClick={handleTranslatedClick}>
          <p>Ingreso administrador</p>
        </label>
        <div className="attendance-register-content">
          <div className="cam-content">
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="cam" />
            <Clock />
          </div>
          <div className="form">
            <div className="main">
              <input type="checkbox" id="chk" aria-hidden="true" />
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                  <div className="signup">
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
                        width: '80%',
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
                        width: '80%',
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
                        width: '80%',
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

                  </div>
                </Form>
              </Formik>
              <div className="login">
                <label className="label login-tittle" htmlFor="chk" aria-hidden="true">
                  Translados
                </label>
                <TranslatedRegister />
              </div>
            </div>
          </div>
        </div>
        <Formik initialValues={initialValuesLogin} onSubmit={handleLogin}>
          <Form>
            <div className={`translated${translated ? ' translated-open' : ''}`}>
              <label className='btn-cancel' onClick={handleCloseDialog}>
                <MdArrowCircleLeft className='icon-cancel' />
              </label>
              <label className='login-admin-tittle'>
                Ingreso <br />Administrador
              </label>
              <Field
                className="input input-login"
                type="email"
                name="email"
                placeholder="Correo smart"
              />
              <Field
                className="input input-login"
                type="password"
                name="password"
                placeholder="Contraseña"
              />
              <button className="btn-login-admin" type="submit">
                Entrar
              </button>
            </div>
          </Form>
        </Formik>
      </section>

      {/* ------------------------- */}
      <section className='attendance-register-container-mobile'>

        <label className="btn-translated" aria-hidden="true" onClick={handleTranslatedClick}>
          <p>Ingreso administrador</p>
        </label>
        <div className='attendance-register-content-mobile'>
          <div className="form">
            <div className="main">
              <input type="checkbox" id="chk" aria-hidden="true" />
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                  <div className="signup">
                    <label className="label title" htmlFor="chk" aria-hidden="true">
                      <h2 className="hi-tittle">Hola,</h2>
                    </label>
                    <h2 className="hi-msg">Bienvenido(a) de nuevo</h2>
                    <div className="cam-content">
                      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="cam" />
                      <Clock />
                    </div>
                    <label className="label" htmlFor="document">
                      Documento:
                    </label>
                    <Field
                      type="number"
                      id="document"
                      name="document"
                      placeholder="Ingresa aquí tu documento"
                      style={{
                        width: '80%',
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
                        width: '80%',
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
                        width: '80%',
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

                  </div>
                </Form>
              </Formik>

            </div>
          </div>
        </div>
        <div className='translated-content'>
        <div className={`translated-mobile${translatedM ? ' translated-mobile-open' : ''}`}>
          <label className="translated-tittle"  aria-hidden="true" onClick={handleTranslatedMClick}>
            Translados
          </label>
          <TranslatedRegister />
        </div>
        </div>
      </section>
    </>
  );
};

export default MyForm;
