import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Button } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import LoginButton from '@mui/icons-material/Login'

// components
import Profile from './Profile';
import { IconMenu, IconHistory } from '@tabler/icons-react';

interface ItemType {
  toggleMobileSidebar:  (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({toggleMobileSidebar}: ItemType) => {

  const { user, loading, signOut } = useSupabaseAuth();

  const handleSignOut = async () => {
    await signOut();
  };

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
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          
            <IconButton
              size="large"
              aria-label="show history"
              color="inherit"
              aria-controls="msgs-menu"
              aria-haspopup="true"
              component={Link} href="/history"
            >
              <IconHistory size="21" stroke="1.5" />
            </IconButton>
          
          {!user && !loading && (
            <Button
              variant="contained"
              component={Link}
              href="authentication/login"
              disableElevation
              color="primary"
              startIcon={<LoginButton/>}
            >
              Login
            </Button>
          )}

          {user && (
            <>
            <Profile user={user} signOut={handleSignOut} />
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
