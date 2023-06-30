import { mode } from '@chakra-ui/theme-tools';
export const globalStyles = {
	colors: {
		brand: {
			100: '#FFCDD2',
			200: '#EF9A9A',
			300: '#E57373',
			400: '#EF5350',
			500: '#F44336',
			600: '#E53935',
			700: '#D32F2F',
			800: '#C62828',
			900: '#B71C1C'
		},
		brandScheme: {
			100: '#F6C7C7',
			200: '#F29E9E',
			300: '#ED7474',
			400: '#E94B4B',
			500: '#C91313',
			600: '#A50F0F',
			700: '#820A0A',
			800: '#5F0606',
			900: '#3C0202'
		},
		brandTabs: {
			100: '#F6C7C7',
			200: '#F29E9E',
			300: '#ED7474',
			400: '#E94B4B',
			500: '#C91313',
			600: '#A50F0F',
			700: '#820A0A',
			800: '#5F0606',
			900: '#3C0202'
		},
		secondaryGray: {
			100: '#E0E5F2',
			200: '#E1E9F8',
			300: '#F4F7FE',
			400: '#E9EDF7',
			500: '#8F9BBA',
			600: '#A3AED0',
			700: '#707EAE',
			800: '#707EAE',
			900: '#1B2559'
		},
		red: {
			100: '#FEEFEE',
			500: '#EE5D50',
			600: '#E31A1A'
		},
		blue: {
			50: '#EFF4FB',
			500: '#3965FF'
		},
		orange: {
			100: '#FFF6DA',
			500: '#FFB547'
		},
		green: {
			100: '#E6FAF5',
			500: '#01B574'
		},
		navy: {
			50: '#F2F2F2',
			100: '#E6E6E6',
			200: '#CCCCCC',
			300: '#B3B3B3',
			400: '#999999',
			500: '#808080',
			600: '#666666',
			700: '#4D4D4D',
			800: '#333333',
			900: '#1A1A1A'
		},
		gray: {
			100: '#FAFCFE'
		}
	},
	styles: {
		global: (props: any) => ({
			body: {
				overflowX: 'hidden',
				bg: mode('secondaryGray.300', 'navy.900')(props),
				fontFamily: 'DM Sans',
				letterSpacing: '-0.5px'
			},
			input: {
				color: 'gray.700'
			},
			html: {
				fontFamily: 'DM Sans'
			}
		})
	}
};
