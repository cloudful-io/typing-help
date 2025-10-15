'use client';

import { useEffect, useState } from 'react';
import { useUserRoles } from "@/contexts/UserRolesContext";
import PracticeTextService from "@/services/practice-text-service";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, CircularProgress, Snackbar, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import AddAssignment from './AddAssignment';

interface AssignmentListProps {
  classId: string;
}

interface Assignment {
  id: number;
  owner_teacher_id: number | null;
  class_id: number | null;
  student_id: number | null;
  language: string;
  grade_level: number | null;
  duration_seconds: number;
  is_public: boolean | null;
  content: string;
  assigned_at: string | null;
  created_at: string;
}

export default function AssignmentList({ classId }: AssignmentListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { roles } = useUserRoles();
  const isTeacher = roles.includes('teacher');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const fetchAssignments = async () => {
    setLoading(true);
    const data = await PracticeTextService.getPracticeTextByClass(Number(classId));
    setAssignments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, [classId]);

  const handleAssignmentAdded = (success: boolean, message: string) => {
    setSnackbar({ open: true, message, severity: success ? 'success' : 'error' });
    if (success) fetchAssignments();
  };
  
  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress />
      </Box>
    );
    
  return (
    <>
      {isTeacher && <AddAssignment classId={classId} onAdded={handleAssignmentAdded}/>}
      {assignments.length === 0 &&
        <Typography>No assignments in this class.</Typography>
      }
      {assignments.length > 0 && 
        <Box>
          {assignments.map((assignment, index) => (
            <Accordion key={assignment.id} disableGutters>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover', // MUI theme-aware hover color
                  },
                }}>
                <KeyboardIcon color="action" sx={({mr:1})}/>
                <Typography variant="subtitle1"  sx={({mr:3})}>
                  Assignment #{index + 1}
                  </Typography>
                <Typography variant="subtitle1" >
                  Assigned: {' '}
                    {assignment.assigned_at
                      ? new Date(assignment.assigned_at).toLocaleDateString('en-US')
                      : 'N/A'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {assignment.content}
                </Typography>
                <Box mt={1}>
                  <Typography variant="caption" color="text.secondary">
                    Date:{' '}
                    {new Date(assignment.created_at).toLocaleDateString('en-US')}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      }
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
