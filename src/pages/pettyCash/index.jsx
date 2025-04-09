import React from 'react';
import MainCard from '@components/MainCard';
import { Outlet } from 'react-router-dom';

const PettyCashIndex = () => {
    return (
        <MainCard>
           <Outlet/>
       </MainCard>
    )
}

export default PettyCashIndex;