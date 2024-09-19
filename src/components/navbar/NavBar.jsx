import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Function to handle tab changes
    const handleTabChange = (event, newValue) => {
        // Append the new value (like "/amazon" or "/walmart") to the current path
        const basePath = location.pathname.split('/')[1]; // Get base path like 'data-validation' or 'campaign-validation'
        navigate(`/${basePath}${newValue}`); // Navigate to new path
    };

    // Function to get the title based on the current path
    const getTitle = () => {
        if (location.pathname.startsWith('/data-validation')) {
            return 'Data Validation';
        }
        if (location.pathname.startsWith('/campaign-validation')) {
            return 'Campaign Validation';
        }
        return 'Dashboard'; // Fallback title
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 0.1 }}>
                    {getTitle()}
                </Typography>
                <Tabs
                    value={location.pathname.includes('/amazon') ? '/amazon' : '/walmart'}
                    onChange={handleTabChange}
                    textColor="inherit"
                    indicatorColor="secondary"
                >
                    {/* The tab value is just '/amazon' or '/walmart' */}
                    <Tab label="Amazon" value="/amazon" />
                    <Tab label="Walmart" value="/walmart" />
                </Tabs>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
