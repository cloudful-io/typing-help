"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid"; 
import SessionCard from './SessionCard';
import AccuracyCard from "./AccuracyCard";
import WPMCard from "./WPMCard";
import { usePracticeSessions, PracticeSession } from "@/hooks/usePracticeSessions";
import { getLanguageName } from "@/utils/language";
import DeleteIcon from '@mui/icons-material/Delete';

const StatsPage: React.FC = () => {
  const { getPracticeSessions, clearPracticeSessions } = usePracticeSessions();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const stored = getPracticeSessions();   
    setSessions(stored);
    setLoading(false);
  }, []);

  // Summary stats
  const summary = useMemo(() => {
    if (sessions.length === 0)
      return { avgWPM: null, avgWordsTyped: 0, bestWPM: null, bestWordsTyped: 0, totalSessions: 0, totalChars: 0, correctChars: 0 };

    const totalWPM = sessions.reduce((sum, s) => sum + s.wpm, 0);

    // Find session with best WPM
    const bestSession = sessions.reduce((best, s) =>
      s.wpm > best.wpm ? s : best,
      sessions[0]
    );
    
    const lastPractice = new Date(
      Math.max(...sessions.map((s) => new Date(s.date).getTime()))
    );

    const avgWordsTyped = sessions.reduce((sum, s) => sum + s.wordsTyped, 0) / sessions.length;

    // Summing total and correct characters
    const totalChars = sessions.reduce((sum, s) => sum + s.totalChars, 0);
    const correctChars = sessions.reduce((sum, s) => sum + s.correctChars, 0);
    
    return {
      avgWPM: totalWPM / sessions.length,
      avgWordsTyped: avgWordsTyped ?? 0,
      totalChars,
      correctChars,
      bestWPM: bestSession.wpm,
      bestWordsTyped: bestSession.wordsTyped,
      totalSessions: sessions.length,
      lastPractice
    };
  }, [sessions]);


  // DataGrid columns
  const columns: GridColDef<PracticeSession>[] = useMemo(() => [
    {
      field: 'date',
      headerName: "Date",
      valueGetter: (value) => {
        if (!value) {
          return value;
        }
        // Convert the decimal value to a percentage
        return new Date(value).toLocaleDateString();
      },
    },
    {
      field: 'language',
      headerName: "Language",
      valueGetter: (value) => {
        if (!value) {
          return value;
        }
        // Convert the decimal value to a percentage
        return getLanguageName(value);
      },
    },
    { field: "wpm", headerName: "WPM", type: "number", flex: 1 },
    {
        field: 'totalChars', headerName: "Accuracy (%)", flex: 1,
        valueGetter: (value, row) => {
        if (!row.totalChars || !row.correctChars || row.totalChars === 0) {
            return 0;
        }
        return Math.round(row.correctChars / row.totalChars * 100);
        },
    },
    { field: "duration", headerName: "Duration (s)", type: "number", flex: 1 },
  ], []); // Memoize columns to prevent re-creation

  // Show a loading indicator until data is ready
  if (loading) {
    return <Box sx={{ p: 3 }}>Loading sessions...</Box>;
  }

  const handleClearSessions = () => {
    clearPracticeSessions();

    // Clear React state
    setSessions([]);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
      <Typography variant="h3">Typing Practice Stats</Typography>
      {/* Summary Cards */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{xs: 6, md: 3}} sx={{ display: "flex", flex: 1 }}>
          <SessionCard total={summary.totalSessions} lastPractice={summary.lastPractice} />
        </Grid>
        <Grid size={{xs: 6, md: 3}} sx={{ flex: 1 }} >
          <AccuracyCard title="Average Accuracy" correct={summary.correctChars} total={summary.totalChars} />
        </Grid>
        <Grid size={{xs: 6, md: 3}} sx={{ display: "flex", flex: 1 }}>
           <WPMCard title="Average WPM" wpm={summary.avgWPM} wordsTyped={summary.avgWordsTyped} language=""/>
        </Grid>
        <Grid size={{xs: 6, md: 3}} sx={{ display: "flex", flex: 1 }}>
          <WPMCard title="Best WPM" wpm={summary.bestWPM} wordsTyped={summary.bestWordsTyped} language=""/>
        </Grid>
      </Grid>
      {/* DataGrid for sessions */}
      <Paper sx={{ p: 2, height: 400 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color="text.primary">
          All Sessions
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleClearSessions}
          startIcon={<DeleteIcon/>}
        >
          Clear All
        </Button>
        </Box>
        <DataGrid
          rows={sessions}
          columns={columns}
          //getRowId={(row) => row.id}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};

export default StatsPage;
