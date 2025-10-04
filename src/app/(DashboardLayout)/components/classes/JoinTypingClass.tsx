'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { getTypingClassByCode, joinTypingClass } from '@/lib/typingClass';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useUserRoles } from "@/contexts/UserRolesContext";
import { useRouter } from 'next/navigation';
import InputIcon from '@mui/icons-material/Input';

const JoinTypingClass: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isStudent = roles.includes('student');
  if (!isStudent) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const joinClass = await getTypingClassByCode(classCode);

      if (!joinClass) {
        console.error("Unable to find class");
        setError('Unable to find class');
      }
      else {
        const data = await joinTypingClass(user.id, joinClass.id);
        setClassCode(joinClass.title);
      }
      
      setClassCode(''); // reset form

      setSuccess(true);
      setClassCode('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to join class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button that opens dialog */}
      <Button
        variant="contained"
        startIcon={<InputIcon />}
        onClick={() => setOpen(true)}
      >
        Join Class
      </Button>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Join a Typing Class</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              label="Class Code"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              required
              fullWidth
              margin="dense"
            />

            {success && (
              <Typography color="success.main" sx={{ mt: 2 }}>
                Successfully joined the class!
              </Typography>
            )}

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Join'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default JoinTypingClass;
