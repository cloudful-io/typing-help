"use client";

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Box, Typography } from '@mui/material';
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import { getAccuracyColor, calculateAccuracy } from '@/utils/typing';
import {useTheme} from '@mui/material';

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AccuracyCardProps {
  title?: string;
  correct: number;
  total: number;
}

const AccuracyCard: React.FC<AccuracyCardProps> = ({ title = "Accuracy", correct, total }) => {
  const safeCorrect = Math.max(0, correct);
  const safeTotal = Math.max(0, total);
  const accuracy = calculateAccuracy(safeCorrect, safeTotal);
  const color = useMemo(() => getAccuracyColor(accuracy, safeTotal), [accuracy, safeTotal]);
  const theme = useTheme();

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
            color: theme.palette.text.secondary
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

  const series = [accuracy];

  return (
    <DashboardCard title={title}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <ReactApexChart 
          key={`${correct}-${total}`} 
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
