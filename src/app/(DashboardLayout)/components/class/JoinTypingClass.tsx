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
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useUserRoles } from "@/contexts/UserRolesContext";
import { useRouter } from 'next/navigation';
import InputIcon from '@mui/icons-material/Input';
import TypingClassService from "@/services/typing-class-service";

const JoinTypingClass: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      // Find class by code
      const typingClass = await TypingClassService.getTypingClassByCode(classCode);

      if (!typingClass) {
        setError('No class found with that code.');
        setLoading(false);
        return;
      }

      // Join the class
      await TypingClassService.joinTypingClass(user.id, typingClass.id);

      // Close dialog and redirect
      setOpen(false);
      router.push(`/class/${typingClass.id}`); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to join class.');
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
              disabled={loading}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
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
