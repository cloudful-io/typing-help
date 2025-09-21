"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef, GridCellParams, GridRenderCellParams } from "@mui/x-data-grid"; // Correct import
import SessionCard from './SessionCard';
import AccuracyCard from "./AccuracyCard";
import WPMCard from "./WPMCard";
import { usePracticeSessions, PracticeSession } from "@/hooks/usePracticeSessions";
import { getLanguageName } from "@/utils/language";

const HistoryPage: React.FC = () => {
  const { getSessions } = usePracticeSessions();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    // This runs only on the client
    const stored = localStorage.getItem("typingAppSessions");
    if (stored) {
      setSessions(JSON.parse(stored));
    }
    setLoading(false); // Set loading to false once data is checked
  }, []);

  // Summary stats
  const summary = useMemo(() => {
    if (sessions.length === 0)
      return { avgWPM: 0, avgWordsTyped: 0, avgAccuracy: 0, bestWPM: 0, bestWordsType: 0, totalSessions: 0, totalChars: 0, correctChars: 0 };

    const totalWPM = sessions.reduce((sum, s) => sum + s.wpm, 0);
    const totalAccuracy = sessions.reduce(
      (sum, s) => sum + (s.totalChars > 0 ? (s.correctChars / s.totalChars) * 100 : 0),
      0
    );

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
      avgWordsTyped,
      totalChars,
      correctChars,
      avgAccuracy: totalAccuracy / sessions.length,
      bestWPM: bestSession.wpm,
      bestWordsType: bestSession.wordsTyped,
      totalSessions: sessions.length,
      lastPractice
    };
  }, [sessions]);

  // Chart data
  const chartData = sessions
    .slice()
    .reverse() // oldest to newest
    .map((s) => ({
      date: new Date(s.date).toLocaleDateString(),
      wpm: s.wpm,
      accuracy: s.totalChars > 0 ? (s.correctChars / s.totalChars) * 100 : 0,
    }));

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
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
      <Typography variant="h3">Typing Practice History</Typography>
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
          <WPMCard title="Best WPM" wpm={summary.bestWPM} wordsTyped={summary.bestWordsType} language=""/>
        </Grid>
      </Grid>

      {/* Chart */}
      <Paper sx={{ p: 2, height: 300, display: 'none'}}>
        <Typography variant="subtitle1" gutterBottom>
          WPM & Accuracy Over Time
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              yAxisId="left"
              label={{ value: "WPM", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Accuracy %", angle: 90, position: "insideRight" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="wpm"
              stroke="#1976d2"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="accuracy"
              stroke="#2e7d32"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* DataGrid for sessions */}
      <Paper sx={{ p: 2, height: 400 }}>
        <Typography variant="subtitle1" gutterBottom>
          All Sessions
        </Typography>
        <DataGrid
          rows={sessions}
          columns={columns}
          getRowId={(row) => row.id}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};

export default HistoryPage;
