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
  Snackbar,
  Alert,
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
  onAdded?: (success: boolean, message: string) => void;
}

const AddAssignment: React.FC<AddAssignmentProps> = ({ classId, onAdded }) => {
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [content, setContent] = React.useState('');
  const [assignedAt, setAssignedAt] = React.useState<Dayjs | null>(dayjs());
  const [language, setLanguage] = React.useState('en-US');
  const [duration, setDuration] = React.useState<number>(60);

  const [loading, setLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [assignedAtError, setAssignedAtError] = useState<string | null>(null);

  const isTeacher = roles.includes('teacher');
  if (!isTeacher) {
    router.push("/");
    return null;
  }

  const handleCancel = () => {
    // Reset all input fields
    setContent('');
    setAssignedAt(dayjs());
    setLanguage('en-US');
    setDuration(60);

    // Reset error and loading states
    setContentError(null);
    setAssignedAtError(null);
    setLoading(false);

    // Close dialog
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setContentError(null);
    setAssignedAtError(null);

   let valid = true;

    if (!content.trim()) {
      setContentError("Content cannot be empty.");
      valid = false;
    }

    if (!assignedAt) {
      setAssignedAtError("Assigned date is required.");
      valid = false;
    }

    if (!valid) return;
    setLoading(true);   
    
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

      onAdded?.(true, 'Assignment added successfully!');

    } catch (err: any) {
      console.error(err);
      onAdded?.(false, err.message || 'Failed to add assignment.');
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
                onChange={(e) => {
                  setContent(e.target.value);
                  setContentError(null);
                  setLoading(false)
                }}
                fullWidth
                error={!!contentError}
                helperText={contentError}
                
              />

              {/* Assigned At Date */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Assigned At"
                  value={assignedAt}
                  onChange={(newValue) => {
                    setAssignedAt(newValue)
                    setAssignedAtError(null)
                    setLoading(false);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!assignedAtError,
                      helperText: assignedAtError,
                    },
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
              <Button onClick={handleCancel}>Cancel</Button>
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
