import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import Card from 'components/card/Card';
import { StatService } from 'services/StatsService';
import { Text, useColorModeValue } from '@chakra-ui/react';
import { stat } from 'fs';


const AttendancePie = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [lateTrue, setLateTrue] = useState<number | null>()
    const [onTime, setOnTime] = useState<number | null>()

    const textColor = useColorModeValue('secondaryGray.900', 'white');

    const getLateAttendance = async () => {
        try {
            const response = await StatService.CountLateAttendancesForDay();
            setLateTrue(response);
        } catch (error) {
            console.error(error);
        }
    }

    const getOnTimeAttendance = async ()=>{
        try {
            const response = await StatService.countOnTimeAttendancesForDay();
            setOnTime(response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const data = {
            labels: ['A tiempo', 'tarde',],
            datasets: [
                {
                    data: [onTime, lateTrue],
                    backgroundColor: [
                        '#A3BE32', 
                        '#C91212', 
                    ],
                    hoverBackgroundColor: [
                        '#A3BE32', 
                        '#C91212', 
                    ]
                }
            ]
        };
        const options = {
            cutout: '60%'
        };

        setChartData(data);
        setChartOptions(options);
        getLateAttendance();
        getOnTimeAttendance();
    }, [lateTrue, onTime]);

    // useEffect(() => {
    //     const interval = setInterval(() => {

    //         const data = {
    //             labels: ['A tiempo', 'tarde'],
    //             datasets: [
    //                 {
    //                     data: [onTime, lateTrue],
    //                     backgroundColor: ['#A3BE32', '#C91212'],
    //                     hoverBackgroundColor: ['#A3BE32', '#C91212']
    //                 }
    //             ]
    //         };

    //         const options = {
    //             cutout: '60%'
    //         };

    //         setChartData(data);
    //         setChartOptions(options);
    //         getLateAttendance();
    //         getOnTimeAttendance();
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, [onTime, lateTrue]);


    return (
        <Card style={{ width: "400px" }}>
            <Text color={textColor} fontSize='28px' mb="50px" fontWeight='700' lineHeight='100%'>
                Asistencias hoy
            </Text>
            <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-20rem" />
        </Card>
    )
}

export default AttendancePie;
