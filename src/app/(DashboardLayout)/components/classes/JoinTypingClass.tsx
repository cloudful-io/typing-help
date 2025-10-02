'use client';

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { getTypingClassByCode, joinTypingClass } from '@/lib/typingClass';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useUserRoles } from "@/contexts/UserRolesContext";
import { useRouter } from 'next/navigation';

const JoinTypingClass: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const joinClass = await getTypingClassByCode(code);

      if (!joinClass) {
        console.error("Unable to find class");
        setError('Unable to find class');
      }
      else {
        const data = await joinTypingClass(user.id, joinClass.id);
        setSuccessMessage(joinClass.title);
      }
      
      setCode(''); // reset form
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();
  const { roles } = useUserRoles();
  const isStudent = roles.includes('student');

  if (!isStudent) {
    router.push("/");
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 400 }}>
      <Typography variant="h6">Join Typing Class</Typography>

      <TextField
        label="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        fullWidth
      />

      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Join Class'}
      </Button>

      {successMessage && (
        <Typography color="success.main">
          Successfully joined {successMessage}.
        </Typography>
      )}

      {error && (
        <Typography color="error">{error}</Typography>
      )}
    </Box>
  );
};

export default JoinTypingClass;
