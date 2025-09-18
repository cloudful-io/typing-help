"use client";

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Box, Typography } from '@mui/material';
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import { getAccuracyColor } from '@/utils/typing';

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AccuracyCardProps {
  accuracy: number | null;
  correct: number;
  total: number;
}

const AccuracyCard: React.FC<AccuracyCardProps> = ({ accuracy, correct, total }) => {
  const safeAccuracy = total > 0 && accuracy !== null ? accuracy : 0;

  const color = useMemo(() => getAccuracyColor(accuracy, total), [accuracy, total]);

  const chartOptions: ApexOptions = useMemo(() => ({
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
            fontSize: "18px",
            fontWeight: 600,
            formatter: (val: number) => `${val}%`,
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: { radialBar: { dataLabels: { value: { fontSize: "14px" } } } },
        },
      },
    ],
    colors: [color],
  }), [color]);

  const series = [safeAccuracy];

  return (
    <DashboardCard title="Accuracy">
      <Box display="flex" flexDirection="column" alignItems="center">
        <ReactApexChart 
          key={accuracy}
          options={chartOptions} 
          series={series} 
          type="radialBar" 
          height={120} 
        />
        <Typography variant="body2" color="text.secondary" align="center" aria-label="accuracy details">
          {`${correct} out of ${total} characters correct`}
        </Typography>
      </Box>
    </DashboardCard>
  );
};

export default AccuracyCard;
