import React from 'react';
import MainCard from '@components/MainCard';
import { Outlet } from 'react-router-dom';

const SalesIndex = () => {
    return (
        <MainCard title="Sales">
           <Outlet/>
       </MainCard>
    )
}

export default SalesIndex;