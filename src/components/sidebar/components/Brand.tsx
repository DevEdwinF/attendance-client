import { Flex, useColorModeValue } from '@chakra-ui/react';
import LogoRed from '../../../assets/img/corporative/logo-red.svg';
import LogoWhite from '../../../assets/img/corporative/logo-white.svg';
import { Image } from '@chakra-ui/react';

export function SidebarBrand() {
  const logoColor = useColorModeValue('navy.700', 'white');
  const logoSrc = logoColor === 'navy.700' ? LogoRed : LogoWhite;

  return (
    <Flex alignItems='center' flexDirection='column'>
      <Image src={logoSrc} alt='logo' width='150px' height='150px' my='16px' />
    </Flex>
  );
}

export default SidebarBrand;
