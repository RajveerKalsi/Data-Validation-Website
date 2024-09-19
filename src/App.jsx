import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Sidebar from './components/sidebar/Sidebar';
import NavBar from './components/navbar/NavBar';
import AmazonVal from './pages/DataCampaignVal/AmazonVal/AmazonVal';
import WalmartVal from './pages/DataCampaignVal/WalmartVal/WalmartVal';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

function AppContent() {
    const location = useLocation();

    return (
        <div className="app">
            <Sidebar />
            <div className="content">
                {/* Only show NavBar if not on the home page */}
                {location.pathname !== '/' && <NavBar />}
                <Routes>
                    <Route path="/data-campaign-validation/amazon" element={<AmazonVal />} />
                    <Route path="/data-campaign-validation/walmart" element={<WalmartVal />} />
                    <Route path="/" element={<Dashboard />} /> {/* Default route */}
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <AppContent />
            </Router>
        </ThemeProvider>
    );
}

export default App;
