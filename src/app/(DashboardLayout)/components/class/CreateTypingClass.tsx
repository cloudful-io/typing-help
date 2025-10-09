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
import AddIcon from '@mui/icons-material/Add';
import TypingClassService from "@/services/typing-class-service";

const CreateTypingClass: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTeacher = roles.includes('teacher');
  if (!isTeacher) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const newClass = await TypingClassService.createTypingClass(user.id, title);

      // Close dialog first for smoother experience
      setOpen(false); 
      router.push(`/class/${newClass.id}`); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button that opens dialog */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Create Class
      </Button>

      {/* Dialog itself */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Typing Class</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              label="Class Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              margin="dense"
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Create'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default CreateTypingClass;
