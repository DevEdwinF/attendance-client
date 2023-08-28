import { useState, useEffect } from 'react'
import { StatService } from 'services/Stats.service'
import Card from 'components/card/Card';
import { Text, useColorModeValue } from '@chakra-ui/react';


const TotalCollaboratorsActive = () => {
    const [countCollaborators, setCountCollaborators] = useState<number | null>(null);
    const textColor = useColorModeValue('secondaryGray.900', 'white');


    const fetchData = async() => {
        try {
            const response = await StatService.totalCollaboratorsActive()
            setCountCollaborators(response)
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        fetchData();
    })


    return (
        <Card /* style={{width:"400px", display: "flex", justifyContent: "flex-end"}} */>
            <Text color={textColor} fontSize='18px' mb="10px" fontWeight='700' lineHeight='100%'>
                Total colaboradores activos en smart
            </Text>
            <Text color={"#C91212"} fontSize='28px' mb="10px"  fontWeight='700' lineHeight='100%'>
                {countCollaborators !== null
                    ? <div>{countCollaborators}</div>
                    : <div>Cargando...</div>
                }
            </Text>
        </Card>
    )
}

export default TotalCollaboratorsActive