"use client";
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Button, Typography } from '@mui/material';
import Image from "next/image";
import PropTypes from 'prop-types';

import Link from 'next/link';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import LoginButton from '@mui/icons-material/Login'
import AppDrawer from '../sidebar/AppDrawer';
import Profile from './Profile';
import { IconDeviceDesktopAnalytics } from '@tabler/icons-react';

const Header = () => {
  const { user, loading } = useSupabaseAuth();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {user &&
          <AppDrawer/>
        }
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
              display: { xs: "none", sm: "none", md: "block" }
            }}>
              Typing Help
          </Typography>
        </Box>

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          {/* Only show if authenticated */}
          {!user && (
            <IconButton
              size="large"
              aria-label="show stats"
              color="inherit"
              aria-controls="msgs-menu"
              aria-haspopup="true"
              component={Link} href="/stats"
            >
              <IconDeviceDesktopAnalytics size="21" stroke="1.5" />
            </IconButton>
          )}
          {!user && !loading && (
            <Button
              variant="contained"
              component={Link}
              href="/authentication/login"
              disableElevation
              color="primary"
              startIcon={<LoginButton/>}
            >
              Login
            </Button>
          )}

          {user && (
            <>
            <Profile user={user} />
            </>
          )}
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
