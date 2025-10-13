'use client';

import { Box, Typography, Chip } from '@mui/material';

interface ClassHeaderProps {
  title: string;
  code: string;
  teacher?: string;
}

export default function ClassHeader({ title, code, teacher }: ClassHeaderProps) {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }} 
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      mb={2}
      gap={1}
     >
      {/* Left side: title + teacher */}
      <Box display="flex" flexDirection="column">
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {teacher && (
          <Typography variant="subtitle1" color="text.secondary">
            Teacher: {teacher}
          </Typography>
        )}
      </Box>

      {/* Right side: class code */}
      <Chip
        label={`Class Code: ${code}`}
        color="primary"
        variant="outlined"
        sx={{ fontSize: '1rem', fontWeight: 600, px: 1.5 }}
      />
    </Box>
  );
}
