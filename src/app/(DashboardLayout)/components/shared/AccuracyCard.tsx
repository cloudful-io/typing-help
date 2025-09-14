"use client";

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Grid, Typography } from '@mui/material';
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AccuracyCardProps {
  accuracy: number | null;
  correct: number;
  total: number;
}

const AccuracyCard: React.FC<AccuracyCardProps> = ({ accuracy, correct, total }) => {
  const color = useMemo(() => {
    if (accuracy === null) return "#bdbdbd"; // gray fallback
    if (accuracy < 85) return "#f44336";     // red
    if (accuracy < 95) return "#ff9800";     // orange/yellow
    return "#4caf50";                        // green
  }, [accuracy]);

  const chartOptions : ApexOptions  = useMemo(() => ({
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "60%" },
        track: { background: "#eee" },
        dataLabels: {
          show: true,
          name: { show: false },
          value: {
            offsetY: 8,
            fontSize: "20px",
            fontWeight: 600,
            formatter: (val: number) => `${val}%`,
          },
        },
      },
    },
    colors: [color],
  }), [color]);

  const series = [accuracy ?? 0]; // fallback to 0 when null

  return (
    <DashboardCard title="Accuracy">
      <Grid container justifyContent="center">
        <Grid size={{xs:12}}>
          <ReactApexChart key={accuracy} options={chartOptions} series={series} type="radialBar" height={120} />
          <Typography variant="subtitle2" color="textSecondary" align='center'>{`${correct} out of ${total}`}</Typography>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default AccuracyCard;
