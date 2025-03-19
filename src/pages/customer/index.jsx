import React from 'react';
import MainCard from '@components/MainCard';
import { Outlet } from 'react-router-dom';

const CustomersIndex = () => {
  return (
    <MainCard title="Customers">
      <Outlet />
    </MainCard>
  );
};

export default CustomersIndex;