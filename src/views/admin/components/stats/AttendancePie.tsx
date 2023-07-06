import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import Card from 'components/card/Card';
import { StatService } from 'services/StatsService';
import { Text, useColorModeValue } from '@chakra-ui/react';
import { stat } from 'fs';


const AttendancePie = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [stats, setStats] = useState<number | null>()

    const textColor = useColorModeValue('secondaryGray.900', 'white');

    const getStaticRc = async () => {
        try {
            const response = await StatService.getAllStats();
            setStats(response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const data = {
            labels: ['A tiempo', 'tarde',],
            datasets: [
                {
                    data: [1, stats],
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
        getStaticRc();
    }, [stats]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         // Aquí va el código que quieres ejecutar cada 5 segundos

    //         const data = {
    //             labels: ['A tiempo', 'tarde'],
    //             datasets: [
    //                 {
    //                     data: [1, stats],
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
    //         getStaticRc();
    //     }, 5000);

    //     return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    // }, [stats]);


    return (
        <Card style={{ width: "400px" }}>
            <Text color={textColor} fontSize='28px' mb="50px" fontWeight='700' lineHeight='100%'>
                Asistencias hoy
            </Text>
            <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
        </Card>
    )
}

export default AttendancePie;
