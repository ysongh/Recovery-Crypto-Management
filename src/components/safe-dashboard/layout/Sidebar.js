import React from 'react';
import { Drawer, Toolbar, List, Divider, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';

const drawerLinks = [
  {
    "text": "Your Wallet",
    "icon": <AccountBalanceWalletIcon />
  },
  {
    "text": "Your Safe",
    "icon": <InventoryIcon />
  },
  {
    "text": "Setting",
    "icon": <SettingsIcon />
  },
  {
    "text": "Recover",
    "icon": <DataSaverOnIcon />
  }
];
const drawerWidth = 200;

function Sidebar({ ethAddress, safeAddress, currentSection, setCurrentSection }) {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <ListItem>
        <div>
          <ListItemText primary="ETH Address" />
          <a href={`https://zksync2-testnet.zkscan.io/address/${ethAddress}`} target="_blank" rel="noopener noreferrer">
            {ethAddress && ethAddress.substring(0,8) + "..." + ethAddress.substring(34,42)}
          </a>
        </div>
      </ListItem>
      <ListItem>
        <div>
          <ListItemText primary="Safe Address" />
          <a href={`https://zksync2-testnet.zkscan.io/address/${safeAddress}`} target="_blank" rel="noopener noreferrer">
            {safeAddress && safeAddress.substring(0,8) + "..." + safeAddress.substring(34,42)}
          </a>
        </div>
      </ListItem>
      <Divider />
      <List>
        {drawerLinks.map((d, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton className={d.text === currentSection && "gray"} onClick={() => setCurrentSection(d.text)}>
              <ListItemIcon>
                {d.icon}
              </ListItemIcon>
              <ListItemText primary={d.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar;