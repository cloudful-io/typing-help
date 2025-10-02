'use client';

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { createTypingClass } from '@/lib/typingClass';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useUserRoles } from "@/contexts/UserRolesContext";
import { useRouter } from 'next/navigation';

const CreateTypingClass: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccessCode(null);

    try {
      const newClass = await createTypingClass(user.id, title);
      setSuccessCode(newClass.code);
      setTitle(''); // reset form
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();
  const { roles } = useUserRoles();
  const isTeacher = roles.includes('teacher');

  if (!isTeacher) {
    router.push("/");
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 400 }}>
      <Typography variant="h6">Create New Typing Class</Typography>
      <TextField
        label="Class Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />

      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Create Class'}
      </Button>

      {successCode && (
        <Typography color="success.main">
          Class created successfully! Code: <strong>{successCode}</strong>
        </Typography>
      )}

      {error && (
        <Typography color="error">{error}</Typography>
      )}
    </Box>
  );
};

export default CreateTypingClass;
