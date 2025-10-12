"user client"
import * as React from 'react';
import { Drawer, Fab, IconButton, Box, List, ListItem, ListItemText } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

export default function ClassroomDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <Box>
      {/* Button to open drawer */}
      <Fab 
        color="primary" 
        onClick={toggleDrawer(true)}
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}
      >
        <SchoolIcon />
      </Fab>

      {/* Drawer itself */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {['Home', 'Profile', 'Settings'].map((text) => (
              <ListItem  key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
