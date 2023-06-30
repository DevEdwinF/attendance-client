// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';
import Logo from '../../../assets/img/corporative/logo.png'
import { Image } from '@chakra-ui/react';

// Custom components


export function SidebarBrand() {
	//   Chakra color mode
	let logoColor = useColorModeValue('navy.700', 'white');

	return (
		<Flex alignItems='center' flexDirection='column'>
			{/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} />
			<HSeparator mb='20px' /> */}
			{/* Importar Image de chakra ui */}
			<Image src={Logo} alt='logo' my='32px' />
		</Flex>
	);
}

export default SidebarBrand;
