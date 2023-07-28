import { ErrorMessage, Field, Form, Formik } from 'formik';
import { AttendanceService } from 'services/AttendanceService';
import Swal from 'sweetalert2';

interface FormValues {
    document: number;
}

const initialValues: FormValues = {
    document: null,
}

const TranslatedRegister  = () => {
    const handleSubmitTranslated = async (values: FormValues, formikHelpers: any) => {
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
            <Formik initialValues={initialValues} onSubmit={handleSubmitTranslated}>
                <Form>
                    <Field
                        type="number"
                        id="document"
                        name="document"
                        placeholder="Ingresa aquí tu documento"
                        className="field-style"
                    />
                    <ErrorMessage name="document" component="div" />
                    <button className="btn-attendance" type="submit">
                        Enviar registro
                    </button>
                </Form>
            </Formik>
        </div>
    );
};

export default TranslatedRegister;
