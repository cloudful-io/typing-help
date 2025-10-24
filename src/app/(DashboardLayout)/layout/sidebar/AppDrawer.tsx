"use client";
import * as React from 'react';
import { Drawer, IconButton, Box, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import Image from "next/image";
import Link from 'next/link';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';

import DrawerItems from './DrawerItems';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function AppDrawer() {
  const [open, setOpen] = React.useState(false);
  const { user } = useSupabaseAuth();
  
  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <>
      <Box>
        {/* Button to open drawer */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer itself */}
        <Drawer 
          anchor="left" 
          open={open} 
          onClose={toggleDrawer(false)}  
        >
          <Box
            sx={{ width: 400, overflowY: "auto", overflowX: "hidden"}}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                borderBottom: 1, 
                borderColor: 'divider'
              }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(false)}
                sx={{ mr: 2 }}
                  >
                <MenuOpenIcon />
              </IconButton>
              <Box
                component={Link}
                href="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none", 
                  color: "inherit",       
                }}
              >
                <Image src="/images/logos/logo.png" width={48} height={48} alt="Typing Help"/>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    ml: 1, 
                    fontWeight: 800, 
                    letterSpacing: "0.5px", 
                    display: "block"
                  }}>
                    Typing Help
                </Typography>
              </Box>
            </Box>
            <DrawerItems/>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
