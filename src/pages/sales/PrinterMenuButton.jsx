import React from 'react';
import {  SendOutlined ,LoadingOutlined   } from '@ant-design/icons';
import {  Menu, MenuItem , Button } from '@mui/material';

const PrinterMenuButton = ({
  bridgeReady,
  loadingPrint,
  anchorEl,
  options,
  selectedPrinter,
  onOpen,
  onClose,
  onSelectPrinter
}) => (
  <>
    <Button
      variant="outlined"
      color={bridgeReady ? 'success' : 'warning'}
      onClick={onOpen}
      size="medium"
      aria-label="print-menu"
      aria-controls="print-menu"
      aria-haspopup="true"
      sx={{ mr: 1, py: 1 }}
    >
      {loadingPrint ? <LoadingOutlined /> : <SendOutlined />}
    </Button>
    <Menu
      id="print-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={onClose}

    >
      {options.map((name) => (
        <MenuItem
          key={name}
          selected={name === selectedPrinter}
          onClick={() => onSelectPrinter(name)}
        >
          {name}
        </MenuItem>
      ))}
    </Menu>
  </>
);

export default PrinterMenuButton;
