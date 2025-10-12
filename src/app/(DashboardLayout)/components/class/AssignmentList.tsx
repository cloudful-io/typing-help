'use client';

import { useEffect, useState } from 'react';
import PracticeTextService from "@/services/practice-text-service";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardIcon from '@mui/icons-material/Keyboard';

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

  useEffect(() => {
    async function fetchPracticeText() {
      const data = await PracticeTextService.getPracticeTextByClass(Number(classId));
      console.log(data);
      setAssignments(data);
      setLoading(false);
    }
    fetchPracticeText();
  }, [classId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress />
      </Box>
    );
    
  if (assignments.length === 0) return <Typography>No assignments in this class.</Typography>;

  return (
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
              Assigned at: {' '}
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
                {assignment.assigned_at
                  ? new Date(assignment.assigned_at).toLocaleDateString('en-US')
                  : 'N/A'}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
