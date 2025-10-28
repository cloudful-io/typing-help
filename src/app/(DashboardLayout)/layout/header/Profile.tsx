import React, { useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Menu,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { IconMail, IconDeviceDesktopAnalytics } from "@tabler/icons-react";
import { User } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';
import {AuthLogout} from "supabase-auth-lib";

type ProfileProps = {
  user: User;
};

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const flag = false;
  return (
    <Box>
      <IconButton
        size="large"
        aria-label="User menu"
        color="inherit"
        onClick={handleClick}
      >
        <Avatar
          src={user.user_metadata?.avatar_url || undefined} // provider image if available
          alt={user.email || "User"}
          sx={{ width: 35, height: 35 }}
        >
          {/* fallback initials if no image */}
          {!user.user_metadata?.avatar_url && user.email
            ? user.email.charAt(0).toUpperCase()
            : null}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": { width: "200px" },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        <MenuItem component={Link} href="/stats" onClick={handleClose}>
          <ListItemIcon>
            <IconDeviceDesktopAnalytics width={20} />
          </ListItemIcon>
          <ListItemText>My Stats</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <AuthLogout
            onSignOutSuccess={() => {
              router.push("/authentication/logout");
            }}
            onSignOutError={(err) => alert(`Logout failed: ${err.message}`)}
          />
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
