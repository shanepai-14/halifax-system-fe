import React from 'react';
import MainCard from '@components/MainCard';
import { Outlet } from 'react-router-dom';

const InventoryIndex = () => {
    return (
        <MainCard title="Inventory Management">
           <Outlet/>
       </MainCard>
    )
}

export default InventoryIndex;