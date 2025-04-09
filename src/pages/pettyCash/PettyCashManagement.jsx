import React, { useState, useEffect , useRef } from 'react';
import {
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { WalletOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';

import MainCard from '@components/MainCard';
import PettyCashTab from './PettyCashTab';
import EmployeesTab from './EmployeesTab';
import StatisticsTab from './StatisticsTab';
import { usePettyCash } from '@/hooks/usePettyCash';
import { useEmployees } from '@/hooks/useEmployees';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`petty-cash-tabpanel-${index}`}
      aria-labelledby={`petty-cash-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

// Main PettyCash Management Component
const PettyCashManagement = () => {

  const [activeTab, setActiveTab] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { getBalance, getStats, balance, stats, loading: pettyCashLoading } = usePettyCash();
  const { getEmployeeStats, stats: employeeStats, loading: employeeLoading } = useEmployees();



  useEffect(() => {
    if (dataLoaded) return;
    const loadData = async () => {
      if (dataLoaded) return;
      try {
        await Promise.all([
          getBalance(),
          getStats(),
          getEmployeeStats()
        ]);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
      } 
    };
  
    loadData();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };


  return (
    <MainCard >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleChangeTab} 
          aria-label="petty cash management tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab 
            icon={<WalletOutlined />} 
            iconPosition="start" 
            label="Petty Cash" 
            id="petty-cash-tab-0" 
          />
          <Tab 
            icon={<TeamOutlined />} 
            iconPosition="start" 
            label="Employees" 
            id="petty-cash-tab-1" 
          />
          <Tab 
            icon={<BarChartOutlined />} 
            iconPosition="start" 
            label="Statistics" 
            id="petty-cash-tab-2" 
          />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <PettyCashTab 
        />
      </TabPanel>
      
      <TabPanel value={activeTab} index={1}>
        <EmployeesTab />
      </TabPanel>
      
      <TabPanel value={activeTab} index={2}>
        <StatisticsTab 
          pettyCashStats={stats} 
          employeeStats={employeeStats} 
          balance={balance}
        />
      </TabPanel>

    </MainCard>
  );
};

export default PettyCashManagement;