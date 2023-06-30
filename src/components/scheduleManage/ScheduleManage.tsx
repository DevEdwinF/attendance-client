import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ScheduleService } from 'services/ScheduleService';


import Swal from 'sweetalert2';

const ScheduleManage = () => {
    const [schedules, setSchedules] = useState<any>([]);
    const [schedule, setSchedule] = useState<any>({});
    const [saveSucces, setSaveSucces] = useState(false);
    const [scheduleDialog, setScheduleDialog] = useState(false);


    useEffect(() => {
        ScheduleService.getAllSchedule().then(response => setSchedules(response))
    }, [!saveSucces])

    const openNew = () => {
        setSchedule({})
        setSaveSucces(false);
        setScheduleDialog(true);
    };

    const leftToolbarTemplate = ()=> {
        return (
            <React.Fragment>
                <Button icon="pi pi-plus" className="p-button mr-2" onClick={openNew} />
            </React.Fragment>
        )
    };

    const onDelete =async (id:number) => {
        try {
            const isDeleted = await ScheduleService.deleteSchedule(id);
            if (isDeleted) {
                const schedules = await ScheduleService.getAllSchedule();
                setSchedules(schedules);
                Swal.fire('Eliminado!', 'El registro ha sido eliminado', 'success');
            }
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'No se puede eliminar un horario asignado', 'error');
        }
    };

    const editSchedule = (schedule: any) => {
        setSchedule({...schedule});
        setScheduleDialog(true);
    }

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button mr-2" onClick={() => editSchedule(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => onDelete(rowData.id_sch)} />
            </React.Fragment>
        );
    };

    const hideDialog = () => {
        setScheduleDialog(false);
    };

    const onInputChange = (e: any, name: any) => {
        const val = (e.target && e.target.value) || '';
        let _schedule = { ...schedule };
        _schedule[`${name}`] = val;

        setSchedule(_schedule);
    };

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => setScheduleDialog(false)} className="p-button-text" />
                <Button label="Confirmar" icon="pi pi-check" onClick={save} autoFocus />
            </div>
        );
    }

    const save = () => {
        ;
        console.log(schedule)
        ScheduleService.saveSchedule(schedule).then(res => {
            setSchedule({})
            setScheduleDialog(false);
            setSaveSucces(!saveSucces);
        });
    }



    return (
        <div>
        <div className="card">
            {/* <Toolbar className="mb-4" right={leftToolbarTemplate} ></Toolbar> */}
            <DataTable value={schedules} style={{ width: "600px", margin: "0 auto" }} footer={leftToolbarTemplate} /* footer="Footer"  */ showGridlines responsiveLayout="scroll" >
                {/* <Column className='text-center' field="id_sch" header="llegada"></Column> */}
                <Column className='text-center' field="arrival" header="llegada"></Column>
                <Column className='text-center' field="departure" header="salida"></Column>
                <Column header="opciones" body={actionBodyTemplate} /* exportable={false} */ style={{ maxWidth: '3.5rem' }} ></Column>
            </DataTable>
            <Dialog visible={scheduleDialog} onHide={hideDialog} footer={renderFooter()}>
                <form id="schedule-form">
                    <div className="field">
                        <label htmlFor="arrival">Horas</label>
                        <input type="time" style={{ fontSize: "1.2em", marginRight: "30px" }} id='arrival' value={schedule?.arrival} onChange={(e) => onInputChange(e, 'arrival')} />
                        <input type="time" style={{ fontSize: "1.2em" }} id='departure' value={schedule?.departure} onChange={(e) => onInputChange(e, 'departure')} />
                    </div>
                </form>
            </Dialog>
        </div>
    </div>
    )
}

export default ScheduleManage