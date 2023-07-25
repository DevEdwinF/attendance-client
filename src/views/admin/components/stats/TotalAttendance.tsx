import { useState, useEffect } from 'react';
import Card from 'components/card/Card';
import { StatService } from 'services/StatsService';
import { Text, useColorModeValue } from '@chakra-ui/react';


const TotalAttendance = () => {
    const [stats, setStats] = useState<number | null>(null);

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
        getStaticRc();
    })

    // useEffect(() => {
    //     getStaticRc();
    //     const intervalId = setInterval(() => {
    //         getStaticRc();
    //     }, 5000); 

    //     return () => clearInterval(intervalId);
    // }, []);

    return (
        <Card /* style={{width:"400px", display: "flex", justifyContent: "flex-end"}} */>
            <Text color={textColor} fontSize='18px' mb="10px" fontWeight='700' lineHeight='100%'>
                Total registros este mes
            </Text>
            <Text color={"#C91212"} fontSize='28px' mb="10px"  fontWeight='700' lineHeight='100%'>
                {stats !== null
                    ? <div> {stats}</div>
                    : <div>Cargando...</div>
                }
            </Text>
        </Card>
    )
}

export default TotalAttendance;
