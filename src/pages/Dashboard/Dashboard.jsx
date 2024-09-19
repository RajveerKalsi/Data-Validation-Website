import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import './Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard-page">      
      <main className="main-content">
        <Card className="welcome-card">
          <CardContent>
            <Typography variant="h4" className="welcome-message">Welcome to Data Validation</Typography>
            <Typography variant="body1" className="instructions">
              Please select an option from the sidebar to start validating your campaign data.
            </Typography>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
