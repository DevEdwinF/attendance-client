import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Collaborator, Schedule } from './CollaboratorsTable';
import { InputText } from 'primereact/inputtext';
import { ScheduleService } from '../../../../services/ScheduleService';
import classNames from 'classnames';
import '../../../../assets/css/App.css';
import { MdDeleteOutline } from 'react-icons/md';
import { ProgressSpinner } from 'primereact/progressspinner';

interface ScheduleEditorProps {
  collaborator: Collaborator;
  onSave: (collaborator: Collaborator) => void;
  onClose: () => void;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ collaborator, onSave, onClose }) => {
  const [schedules, setSchedules] = useState<Collaborator['schedules']>([]);
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  useEffect(() => {
    const initialSchedules = daysOfWeek.map(day => {
      const existingSchedule = collaborator.schedules.find(schedule => schedule.day === day);
      return existingSchedule || {
        id: 0,
        fk_collaborators_document: collaborator.document,
        day,
        arrival_time: '',
        departure_time: '',
      };
    });
    setSchedules(initialSchedules);
  }, [collaborator]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await ScheduleService.assignSchedule(schedules);
      onSave({ ...collaborator, schedules });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (day: string) => {
    try {
      const index = schedules.findIndex(schedule => schedule.day === day);
      const scheduleToDelete = schedules[index];
      const response = await ScheduleService.deleteSchedule(scheduleToDelete.id);
      console.log(response.data);
      const newSchedules = [...schedules];
      newSchedules.splice(index, 1);
      setSchedules(newSchedules);
    } catch (error) {
      console.error(error);
    }
  };

  const dayTemplate = (schedule: Schedule) => {
    return <span>{schedule.day}</span>;
  };

  const arrivalTemplate = (schedule: Schedule) => {
    return (
      <Calendar
        value={schedule.arrival_time ? new Date(schedule.arrival_time) : null}
        timeOnly={true}
        hourFormat="12"
        onChange={e => {
          const newSchedules = [...schedules];
          if (e.value instanceof Date) {
            const index = newSchedules.findIndex(s => s.day === schedule.day);
            newSchedules[index].arrival_time = e.value.toISOString();
          } else {
            const index = newSchedules.findIndex(s => s.day === schedule.day);
            newSchedules[index].arrival_time = '';
          }
          setSchedules(newSchedules);
        }}
      />
    );
  };

  const departureTemplate = (schedule: Schedule) => {
    return (
      <Calendar
        value={schedule.departure_time ? new Date(schedule.departure_time) : null}
        timeOnly={true}
        hourFormat="12"
        onChange={e => {
          const newSchedules = [...schedules];
          if (e.value instanceof Date) {
            const index = newSchedules.findIndex(s => s.day === schedule.day);
            newSchedules[index].departure_time = e.value.toISOString();
          } else {
            const index = newSchedules.findIndex(s => s.day === schedule.day);
            newSchedules[index].departure_time = '';
          }
          setSchedules(newSchedules);
        }}
      />
    );
  };

  const deleteButtonTemplate = (schedule: Schedule) => {
    return (
      <Button
        icon={<MdDeleteOutline />}
        onClick={() => handleDelete(schedule.day)}
        rounded
        text
        severity="danger"
        aria-label="Cancel"
      />
    );
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog visible={true} style={{ width: '50vw' }} header="Editar horarios" onHide={onClose}>
      <DataTable value={schedules}>
        <Column header="Día" body={dayTemplate} />
        <Column header="Llegada" body={arrivalTemplate} />
        <Column header="Salida" body={departureTemplate} />
        <Column header="" body={deleteButtonTemplate} style={{ width: '6em' }} />
      </DataTable>
      <div className="btn-schedule-editor-content">
        <button onClick={handleCancel} className="btn-cancel-schedule-editor">
          Cancelar
        </button>
        <button onClick={handleSave} className="btn-save-schedule-editor">
  {loading ? (
    <ProgressSpinner style={{ width: '20px', height: '20px', color: '#fff' }} />
  ) : (
    <span>Guardar</span>
  )}
</button>


      </div>
    </Dialog>
  );
};
