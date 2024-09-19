import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#007bff',
        },
        secondary: {
            main: '#f50057',
        },
    },
    typography: {
        fontFamily: 'Calibri, sans-serif',
    },
});

export default theme;