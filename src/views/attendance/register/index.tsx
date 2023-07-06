import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRef, useState } from 'react';
import { AttendanceService } from 'services/AttendanceService';
import Card from 'components/card/Card';
import background from 'assets/img/attendance/bg-desktop.png'
import './index.css';
import { useHistory } from 'react-router-dom';

import Swal from 'sweetalert2';
import Clock from 'util/ClockUtil';
import Webcam from 'react-webcam';

interface FormValues {
  document: number;
  state: string;
  photo: string;
}

const initialValues: FormValues = {
  document: null,
  state: '',
  photo: ''
};

const MyForm = () => {
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState('');

  const history = useHistory();

  const handleSubmit = async (values: FormValues) => {
    if (values.document === null || values.state === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios!'
      });
    } else {
      const imageSrc = webcamRef.current.getScreenshot();
      const { document, state } = values;
      const photo = imageSrc as string;

      await AttendanceService.validate(document);
      await AttendanceService.register({ document, state, photo });
    }
  };




  const handleLogin = () => {
    history.push('/admin/default');
  };

  return (
    <section className='attendance-register-container'>
      <div className='attendance-register-content'>
        <div className='cam-content'>
         
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className='cam'
              
            />
          

          <Clock />
        </div>
        <div className='form'>
          <div className="main">
            <input type="checkbox" id="chk" aria-hidden="true" />
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              <Form>

                <div className="signup">
                  <label className='label title' htmlFor="chk" aria-hidden="true">
                    <h2 className='hi-tittle'>Hola,</h2>
                  </label>
                  <h2 className='hi-msg'>Bienvenido(a) de nuevo</h2>


                  <label className="label" htmlFor="document">Documento:</label>
                  <Field type="number" id="document" name="document" placeholder="Ingresa aquí tu documento" style={{ width: "80%", border: "1px solid #b3b3b3", borderRadius: "5px", padding: "5px" }} />
                  <ErrorMessage name="document" component="div" />

                  <label className="label" htmlFor="state">¿Qué vas a registrar?</label>
                  <Field as="select" id="state" name="state" style={{ width: "80%", border: "1px solid #b3b3b3", borderRadius: "5px", padding: "5px" }}>
                    <option value="">Seleccionar...</option>
                    <option value="arrival">Llegada</option>
                    <option value="departure">Salida</option>
                  </Field>
                  <ErrorMessage name="state" component="div" />



                  <button className="button-attendance" type="submit">Enviar registro</button>
                </div>
              </Form>
            </Formik>

            <div className="login">
              <label className="label login-tittle" htmlFor="chk" aria-hidden="true">Ingreso <br />Administrador</label>
              <input className="input input-login" type="document" name="document" placeholder="Documento" />
              <input className="input input-login" type="password" name="pswd" placeholder="Contraseña" />
              <button className="button btn-login" onClick={handleLogin}>Entrar</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyForm;
