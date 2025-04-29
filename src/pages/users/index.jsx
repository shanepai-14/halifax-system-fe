import React from 'react';
import { Outlet } from 'react-router-dom';
import MainCard from '@components/MainCard';

const UserIndex = () => {
    return (
        <MainCard>
           <Outlet/>
       </MainCard>
    )
}

export default UserIndex;