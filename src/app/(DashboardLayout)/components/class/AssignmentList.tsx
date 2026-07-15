'use client';

import { useEffect, useState } from 'react';
import { useUserRoles } from "@/contexts/UserRolesContext";
import PracticeTextService from "@/services/practice-text-service";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Chip, Button, Snackbar, Alert, Link as MuiLink, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentDialog from './AssignmentDialog';
import StudentAssignmentStat from './StudentAssignmentStat';
import TeacherAssignmentStat from './TeacherAssignmentStat';
import NextLink from 'next/link';
import Loading from '@/app/loading';

interface AssignmentListProps {
  classId: string;
}

const formatAssignmentDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'N/A';
  try {
    const datePart = dateStr.split(/[T ]/)[0]; // "YYYY-MM-DD"
    const parts = datePart.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year}`;
    }
  } catch (e) {
    console.error("Failed to parse date string", dateStr, e);
  }
  return 'N/A';
};

interface Assignment {
  id: number;
  owner_teacher_id: number | null;
  class_id: number | null;
  student_id: number | null;
  language: string;
  grade_level: number | null;
  duration_seconds: number;
  label: string | null;
  is_public: boolean | null;
  content: string;
  assigned_at: string | null;
  created_at: string;
}

function TeacherAssignmentDetail({ assignment, classId, onUpdated }: { assignment: any; classId: string; onUpdated: (success: boolean, message: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await PracticeTextService.deletePracticeText(assignment.id);
      setConfirmOpen(false);
      onUpdated(true, "Assignment deleted successfully!");
    } catch (err: any) {
      console.error(err);
      onUpdated(false, err.message || "Failed to delete assignment.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ mt: 1, position: "relative" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 1 }}>
        <AssignmentDialog classId={classId} assignment={assignment} onAdded={onUpdated} />
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => setConfirmOpen(true)}
          disabled={deleting}
        >
          Delete
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)}>
        <DialogTitle>Delete Assignment?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this assignment? 
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: "bold" }}>
            Warning: This will permanently delete all student practice session results associated with this assignment. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained" 
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {!expanded ? (
        <>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mt:2 }}>
            {assignment.content.slice(0, 120)}
          </Typography>
          {assignment.content.length > 120 &&
            <MuiLink
              component="button"
              underline="hover"
              onClick={() => setExpanded(true)}
            >
              View full text
            </MuiLink>
          }
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mt:2 }}>
            {assignment.content}
          </Typography>
          <MuiLink
            component="button"
            underline="hover"
            onClick={() => setExpanded(false)}
          >
            Hide text
          </MuiLink>
        </>
      )}
      <TeacherAssignmentStat textId={assignment.id.toString()} />
    </Box>
  );
}

export default function AssignmentList({ classId }: AssignmentListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { roles } = useUserRoles();
  const isTeacher = roles.includes('teacher');
  const isStudent = roles.includes('student');

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
      <Loading/>
    );
    
  return (
    <>
      {isTeacher && <AssignmentDialog classId={classId} onAdded={handleAssignmentAdded}/>}
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
                  Assignment #{assignments.length - index}
                </Typography>
                {assignment.label && (
                  <Chip
                    label={assignment.label}
                    color="info"
                    variant="filled"
                    size="small"
                    sx={{ mr: 2, fontWeight: 600 }}
                  />
                )}
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  Assigned: {' '}
                  {formatAssignmentDate(assignment.assigned_at)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {isStudent && 
                  <>
                    <Button variant='contained' startIcon={<ExitToAppIcon/>} component={NextLink} href={`/practice/${assignment.id}`}>Practice</Button>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mt:2 }}>
                      {assignment.content}
                    </Typography>
                    <Box mt={1}>
                      <StudentAssignmentStat textId={assignment.id.toString()}/>
                    </Box>
                  </>
                }
                {isTeacher && (
                  <>
                    <TeacherAssignmentDetail assignment={assignment} classId={classId} onUpdated={handleAssignmentAdded} />
                  </>
                )}
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
