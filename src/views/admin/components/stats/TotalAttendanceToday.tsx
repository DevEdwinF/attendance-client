import { useState, useEffect } from 'react';
import Card from 'components/card/Card';
import { StatService } from 'services/StatsService';
import { Text, useColorModeValue } from '@chakra-ui/react';

const TotalAttendanceDay = () => {
    const [stats, setStats] = useState<number | null>(null);

    const textColor = useColorModeValue('secondaryGray.900', 'white');

    const getStaticRc = async () => {
        try {
            const response = await StatService.getAllStatsToday();
            setStats(response);
        } catch (error) {
            console.error(error);
        }
    }

    /* usseEffect pero sin intervalo */

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
            <Text color={textColor} fontSize='28px' mb="10px" fontWeight='700' lineHeight='100%'>
                Total registros este día
            </Text>
            <Text color={"#C91212"} fontSize='28px' mb="10px"  fontWeight='700' lineHeight='100%'>
                {stats !== null
                    ? <div> {stats}</div>
                    : <div>Loading...</div>
                }
            </Text>
        </Card>
    )
}

export default TotalAttendanceDay;
