import React from 'react';
import MainCard from '@components/MainCard';
import { Outlet } from 'react-router-dom';

const CustomersIndex = () => {
  return (
    <MainCard >
      <Outlet />
    </MainCard>
  );
};

export default CustomersIndex;