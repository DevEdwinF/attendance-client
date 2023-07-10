import axios from "axios"

const baseUrl = 'http://localhost:8080/api/schedule'

export const ScheduleService = {
    getAllSchedule: async () => {
        try {
            const response = await axios.get(`${baseUrl}/all`)
            return response
        } catch (error) {
            console.log(error)
        }
    },
    saveSchedule: async (schedule: any) =>{
        try {
            const response = await axios.post(`${baseUrl}/save`, schedule)
            return response
        } catch (error) {
            console.log(error)
        }
    },
    UpdateSchedule: async (id: any) =>{
        try {
            const response = await axios.post(`${baseUrl}/update${id}`)
            return response
        } catch (error) {
            console.log(error)
        }
    },
    deleteSchedule:async (id: number) => {
        try {
            const response = await axios.delete
            return response
        } catch (error) {
            console.log("este es el error de delete", error)
        }
    }
}