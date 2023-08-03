import React from 'react'
import UsersTable from './components/UsersTable'
import { Box, SimpleGrid } from '@chakra-ui/react'

const UserManage = () => {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<SimpleGrid mb='20px' columns={{ sm: 1, md: 1 }} spacing={{ base: '20px', xl: '20px' }}>
				<UsersTable/>
			</SimpleGrid>
		</Box>
  )
}

export default UserManage