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
  FormControlLabel,
  InputLabel,
  Select,
  Switch,
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
import EditIcon from '@mui/icons-material/Edit';
import PracticeTextService from "@/services/practice-text-service";
import { Database } from '@/types/database.types';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type PracticeTextRow = Database["public"]["Tables"]["PracticeTexts"]["Row"];

const parseAssignedAt = (dateStr: string | null | undefined): Dayjs | null => {
  if (!dateStr) return dayjs();
  const datePart = dateStr.split(/[T ]/)[0];
  return dayjs(datePart);
};

interface AssignmentDialogProps {
  classId: string;
  assignment?: PracticeTextRow;
  onAdded?: (success: boolean, message: string) => void;
}

const AssignmentDialog: React.FC<AssignmentDialogProps> = ({ classId, assignment, onAdded }) => {
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [content, setContent] = React.useState(assignment?.content || '');
  const [assignedAt, setAssignedAt] = React.useState<Dayjs | null>(
    parseAssignedAt(assignment?.assigned_at)
  );
  const [label, setLabel] = React.useState(assignment?.label || '');
  const [randomizeText, setRandomizeText] = useState(assignment?.randomize_text || false);
  const [language, setLanguage] = React.useState(assignment?.language || 'en-US');
  const [duration, setDuration] = React.useState<number>(assignment?.duration_seconds ?? 60);
  const canSave = content && assignedAt;

  const [loading, setLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [assignedAtError, setAssignedAtError] = useState<string | null>(null);

  const isTeacher = roles.includes('teacher');
  if (!isTeacher) {
    router.push("/");
    return null;
  }

  const handleOpen = () => {
    setContent(assignment?.content || '');
    setAssignedAt(parseAssignedAt(assignment?.assigned_at));
    setLanguage(assignment?.language || 'en-US');
    setDuration(assignment?.duration_seconds ?? 60);
    setLabel(assignment?.label || '');
    setRandomizeText(assignment?.randomize_text || false);
    setContentError(null);
    setAssignedAtError(null);
    setLoading(false);
    setOpen(true);
  };

  const handleCancel = () => {
    // Reset all input fields
    setContent(assignment?.content || '');
    setAssignedAt(parseAssignedAt(assignment?.assigned_at));
    setLanguage(assignment?.language || 'en-US');
    setDuration(assignment?.duration_seconds ?? 60);
    setLabel(assignment?.label || '');
    setRandomizeText(assignment?.randomize_text || false);

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
      if (assignment) {
        // Edit mode
        await PracticeTextService.updatePracticeText(assignment.id, {
          content,
          language,
          duration_seconds: duration,
          label: label?.trim() ? label.trim() : null,
          randomize_text: randomizeText,
          assigned_at: assignedAt!.toISOString(),
        });
      } else {
        // Create mode
        await PracticeTextService.addPracticeText({
          owner_teacher_id: null,
          class_id: Number(classId),
          content,
          language,
          duration_seconds: duration,
          label: label?.trim() ? label.trim() : null,
          randomize_text: randomizeText,
          assigned_at: assignedAt!.toISOString(),
        });
      }
      // Close dialog first for smoother experience
      setOpen(false);

      onAdded?.(true, assignment ? 'Assignment updated successfully!' : 'Assignment added successfully!');

    } catch (err: any) {
      console.error(err);
      onAdded?.(false, err.message || (assignment ? 'Failed to update assignment.' : 'Failed to add assignment.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button that opens dialog */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: assignment ? 0 : 2 }}>
        <Button
          variant={assignment ? "outlined" : "contained"}
          color={assignment ? "secondary" : "primary"}
          size={assignment ? "small" : "medium"}
          startIcon={assignment ? <EditIcon /> : <AssignmentAddIcon />}
          onClick={handleOpen}
        >
          {assignment ? "Edit" : "Add Assignment"}
        </Button>

        {/* Dialog itself */}
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
          <DialogTitle>{assignment ? "Edit Practice Assignment" : "New Practice Assignment"}</DialogTitle>
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
                helperText={contentError ?? (randomizeText ? "Use a new line to separate each phrase." : undefined)}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={randomizeText}
                    onChange={(e) => setRandomizeText(e.target.checked)}
                  />
                }
                label="Randomize and Expand Content"
              />
              { /* Label */ }
              <TextField
                label="Assignment Label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                fullWidth
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
                  onChange={(e, value) => value >= 0 && setDuration(value)}
                  aria-label="duration selection"
                >
                  <ToggleButton value={0}>Untimed</ToggleButton>
                  <ToggleButton value={30}>30s</ToggleButton>
                  <ToggleButton value={60}>60s</ToggleButton>
                  <ToggleButton value={120}>120s</ToggleButton>
                  <ToggleButton value={180}>180s</ToggleButton>
                  <ToggleButton value={240}>240s</ToggleButton>
                  <ToggleButton value={300}>300s</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
            </DialogContent>
          </Box>
            <DialogActions>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={!canSave || loading} onClick={handleSubmit}>
                {loading ? <CircularProgress size={24} /> : (assignment ? 'Save Changes' : 'Add Assignment')}
              </Button>
            </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default AssignmentDialog;
