import { ErrorMessage, Field, Form, Formik } from 'formik';
import { AttendanceService } from 'services/AttendanceService';
import Swal from 'sweetalert2';

interface FormValues {
    document: number;
}

interface Props {
    onClose: () => void;
}

const TranslatedRegister: React.FC<Props> = ({ onClose }) => {
    const handleSubmit = async (values: FormValues, formikHelpers: any) => {
        const { resetForm } = formikHelpers;

        if (values.document === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios!',
            });
            return; 
        }

        try {
            await AttendanceService.validate(values.document);
            await AttendanceService.saveTranslated({ document: values.document });

            await Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'El registro de translado se ha guardado correctamente.',
            });

            resetForm();
            onClose();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Verifica si el documento está escrito correctamente',
            });
        }
    };
    return (
        <div>
            <Formik initialValues={{ document: 0 }} onSubmit={handleSubmit}>
                <Form>
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
                    <button className="button-attendance" type="submit">
                        Enviar registro
                    </button>
                </Form>
            </Formik>
        </div>
    );
};

export default TranslatedRegister;
