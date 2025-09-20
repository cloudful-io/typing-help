"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef, GridCellParams, GridRenderCellParams } from "@mui/x-data-grid"; // Correct import
import { usePracticeSessions, PracticeSession } from "@/hooks/usePracticeSessions";

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
      return { avgWPM: 0, avgAccuracy: 0, bestWPM: 0, totalSessions: 0 };

    const totalWPM = sessions.reduce((sum, s) => sum + s.wpm, 0);
    const totalAccuracy = sessions.reduce(
      (sum, s) => sum + (s.totalChars > 0 ? (s.correctChars / s.totalChars) * 100 : 0),
      0
    );
    const bestWPM = Math.max(...sessions.map((s) => s.wpm));
    return {
      avgWPM: totalWPM / sessions.length,
      avgAccuracy: totalAccuracy / sessions.length,
      bestWPM,
      totalSessions: sessions.length,
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
    { field: "date", headerName: "Date", flex: 1 },
    { field: "language", headerName: "Language", flex: 1 },
    { field: "wpm", headerName: "WPM", type: "number", flex: 1 },
    { field: "totalChars", headerName: "Total Characters", flex: 1 },
    { field: "correctChars", headerName: "Correct Characters", flex: 1 },
    
    { field: "duration", headerName: "Duration (s)", type: "number", flex: 1 },
  ], []); // Memoize columns to prevent re-creation

  // Show a loading indicator until data is ready
  if (loading) {
    return <Box sx={{ p: 3 }}>Loading sessions...</Box>;
  }
  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={2}>
        <Grid sx={{xs: 6, md: 3}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Total Sessions</Typography>
            <Typography variant="h5">{summary.totalSessions}</Typography>
          </Paper>
        </Grid>
        <Grid sx={{xs: 6, md: 3}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Avg WPM</Typography>
            <Typography variant="h5">{summary.avgWPM.toFixed(1)}</Typography>
          </Paper>
        </Grid>
        <Grid sx={{xs: 6, md: 3}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Avg Accuracy</Typography>
            <Typography variant="h5">{summary.avgAccuracy.toFixed(1)}%</Typography>
          </Paper>
        </Grid>
        <Grid sx={{xs: 6, md: 3}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Best WPM</Typography>
            <Typography variant="h5">{summary.bestWPM}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Chart */}
      <Paper sx={{ p: 2, height: 300 }}>
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
        <DataGrid<PracticeSession>
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
