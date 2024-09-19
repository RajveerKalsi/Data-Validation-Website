import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Sidebar from './components/sidebar/Sidebar';
import NavBar from './components/navbar/NavBar';
import Amazon from './pages/DataVal/Amazon/Amazon';
import Walmart from './pages/DataVal/Walmart/Walmart';
import AmazonCampaign from './pages/CampaignWiseVal/AmazonCampaign/AmazonCampaign';
import WalmartCampaign from './pages/CampaignWiseVal/WalmartCampaign/WalmartCampaign';
import AmazonVal from './pages/DataCampaignVal/AmazonVal/AmazonVal';
import WalmartVal from './pages/DataCampaignVal/WalmartVal/WalmartVal';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <div className="app">
                    <Sidebar />
                    <div className="content">
                        <NavBar />
                        <Routes>
                            {/* <Route path="/data-validation/amazon" element={<Amazon />} /> */}
                            {/* <Route path="/campaign-validation/amazon" element={<AmazonCampaign />} /> */}
                            <Route path="/data-campaign-validation/amazon" element={<AmazonVal />} />
                            {/* <Route path="/data-validation/walmart" element={<Walmart />} /> */}
                            {/* <Route path="/campaign-validation/walmart" element={<WalmartCampaign />} /> */}
                            <Route path="/data-campaign-validation/walmart" element={<WalmartVal />} />
                            <Route path="/" element={<Dashboard />} /> {/* Default route */}
                        </Routes>
                    </div>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;