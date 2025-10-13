'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useUserRoles } from "@/contexts/UserRolesContext";
import { useRouter } from 'next/navigation';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import PracticeTextService from "@/services/practice-text-service";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface AddAssignmentProps {
  classId: string;
}

const AddAssignment: React.FC<AddAssignmentProps> = ({ classId }) => {
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [content, setContent] = React.useState('');
  const [assignedAt, setAssignedAt] = React.useState<Dayjs | null>(dayjs());
  const [language, setLanguage] = React.useState('en-US');
  const [duration, setDuration] = React.useState<number>(60);

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

    if (!assignedAt) {
      setError("Assigned At must be specified.");
      return;
    }
    setError("");
    try {
      const newAssignment = await PracticeTextService.addPracticeText({
        owner_teacher_id: null,
        class_id: Number(classId),
        content,
        language,
        duration_seconds: duration,
        assigned_at: assignedAt!.toISOString(),
      });
      // Close dialog first for smoother experience
      setOpen(false);
      router.push(`/class/${classId}`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to add assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button that opens dialog */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AssignmentAddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Assignment
        </Button>

        {/* Dialog itself */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>New Practice Assignment</DialogTitle>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent sx={{ display: 'flex', overflow: 'visible', flexDirection: 'column', gap: 2, mt: 1 }}>
              {/* Content Field */}
              <TextField
                label="Content"
                required
                multiline
                minRows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
              />

              {/* Assigned At Date */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Assigned At"
                  value={assignedAt}
                  onChange={(newValue) => setAssignedAt(newValue)}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </LocalizationProvider>
              {/* Language Select */}
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value="en-US">English</MenuItem>
                  <MenuItem value="zh-Hant">中文</MenuItem>
                </Select>
              </FormControl>

              {/* Duration Toggle Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Duration (seconds)
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={duration}
                  exclusive
                  onChange={(e, value) => value && setDuration(value)}
                  aria-label="duration selection"
                  //sx={{ display: 'flex', justifyContent: 'space-around' }}
                >
                  <ToggleButton value={30}>30s</ToggleButton>
                  <ToggleButton value={60}>60s</ToggleButton>
                  <ToggleButton value={120}>120s</ToggleButton>
                  <ToggleButton value={240}>240s</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </DialogContent>
          </Box>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading} onClick={handleSubmit}>
                {loading ? <CircularProgress size={24} /> : 'Add Assignment'}
              </Button>
            </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default AddAssignment;
