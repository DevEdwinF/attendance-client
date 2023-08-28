import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Collaborator, Schedule } from './CollaboratorsTable';
import { InputText } from 'primereact/inputtext';
import { ScheduleService } from '../../../../services/Schedule.service';
import classNames from 'classnames';
import '../../../../assets/css/App.css';
import { MdDeleteOutline } from 'react-icons/md';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';


interface ScheduleEditorProps {
  collaborator: Collaborator;
  onSave: (collaborator: Collaborator) => void;
  onClose: () => void;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface SpanishDays {
  [key: string]: string;
}

const spanishDays: SpanishDays = {
  Monday: 'Lunes',
  Tuesday: 'Martes',
  Wednesday: 'Miércoles',
  Thursday: 'Jueves',
  Friday: 'Viernes',
  Saturday: 'Sábado',
};
export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ collaborator, onSave, onClose }) => {
  const [schedules, setSchedules] = useState<Collaborator['schedules']>([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<any>(null);

  useEffect(() => {
    console.log('Collaborator in ScheduleEditor:', collaborator);
    const initialSchedules = daysOfWeek.map(day => {
      console.log(collaborator.id_collaborator)
      const existingSchedule = collaborator.schedules.find(schedule => schedule.day === day);
      return existingSchedule || {
        id: 0,
        // fk_collaborator_id: collaborator.schedules.find(schedule => schedule.fk_collaborator_id)?.fk_collaborator_id,
        fk_collaborator_id: collaborator.id_collaborator,
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
  
      // Usa la variable de estado local "schedules" aquí en lugar de collaborator.schedules
      await ScheduleService.assignSchedule(schedules);
  
      // Agrega fk_collaborator_id al objeto collaborator antes de llamar a onSave
      const updatedCollaborator = { ...collaborator, schedules, fk_collaborator_id: collaborator.id };
      onSave(updatedCollaborator);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (day: string) => {
    try {
      const index = schedules.findIndex((schedule) => schedule.day === day);
      const scheduleToDelete = schedules[index];
      const response = await ScheduleService.deleteSchedule(scheduleToDelete.id);
      const newSchedules = [...schedules];
      newSchedules.splice(index, 1);
      setSchedules(newSchedules);

      // Show the toast notification when a schedule is deleted
      toast.current.show({
        severity: 'success',
        summary: 'Horario eliminado',
        life: 2000, // 2 seconds
      });
    } catch (error) {
      console.error(error);
    }
  };

  const dayTemplate = (schedule: Schedule) => {
    const translatedDay = spanishDays[schedule.day] || schedule.day;
    return <span>{translatedDay}</span>;
  };
  const arrivalTemplate = (schedule: Schedule) => {
    const arrivalTime = schedule.arrival_time ? new Date(`1970-01-01T${schedule.arrival_time}Z`) : null;
    const arrivalTimeAdjusted = arrivalTime ? new Date(arrivalTime.getTime() + (5 * 60 * 60 * 1000)) : null;
    const arrivalTimeString = arrivalTimeAdjusted ? arrivalTimeAdjusted.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
    
    return (
      <Calendar
        value={arrivalTimeAdjusted}
        timeOnly={true}
        hourFormat="12"
        onChange={(e) => {
          const newSchedules = [...schedules];
          const index = newSchedules.findIndex(s => s.day === schedule.day);
          const selectedTime = e.value as Date;
          const selectedTimeAdjusted = new Date(selectedTime.getTime() - (5 * 60 * 60 * 1000));
          newSchedules[index].arrival_time = selectedTimeAdjusted ? selectedTimeAdjusted.toISOString().substr(11, 8) : '';
          setSchedules(newSchedules);
        }}
      />
    );
  };
  
  const departureTemplate = (schedule: Schedule) => {
    const departureTime = schedule.departure_time ? new Date(`1970-01-01T${schedule.departure_time}Z`) : null;
    const departureTimeAdjusted = departureTime ? new Date(departureTime.getTime() + (5 * 60 * 60 * 1000)) : null;
    const departureTimeString = departureTimeAdjusted ? departureTimeAdjusted.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
    
    return (
      <Calendar
        value={departureTimeAdjusted}
        timeOnly={true}
        hourFormat="12"
        onChange={(e) => {
          const newSchedules = [...schedules];
          const index = newSchedules.findIndex(s => s.day === schedule.day);
          const selectedTime = e.value as Date;
          const selectedTimeAdjusted = new Date(selectedTime.getTime() - (5 * 60 * 60 * 1000));
          newSchedules[index].departure_time = selectedTimeAdjusted ? selectedTimeAdjusted.toISOString().substr(11, 8) : '';
          setSchedules(newSchedules);
        }}
      />
    );
  };
  
  
  const formatDateToHHMM = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  

  const deleteButtonTemplate = (schedule: Schedule) => {
    return (
      <Button
        onClick={() => handleDelete(schedule.day)}
        rounded
        text
        severity="danger"
        aria-label="Cancel"
      >
        <MdDeleteOutline style={{ fontSize: '28px' }} /> 
      </Button>
    );
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog visible={true} style={{ width: '45vw' }} header="Editar horarios" onHide={onClose}>
      <DataTable value={schedules}>
        <Column header="Día" body={dayTemplate} />
        <Column header="Llegada" body={arrivalTemplate} />
        <Column header="Salida" body={departureTemplate} />
        <Column header="" body={deleteButtonTemplate} />
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
      <Toast ref={toast} />
    </Dialog>
  );
};
