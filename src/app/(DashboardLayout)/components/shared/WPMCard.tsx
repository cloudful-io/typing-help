"use client";

import React, { useMemo } from "react";
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface WPMCardProps {
  wpm: number | null;
  targetWPM?: number; // optional target, default 100
}

const WPMCard: React.FC<WPMCardProps> = ({ wpm, targetWPM = 100 }) => {
  // dynamic color based on performance
  const color = useMemo(() => {
    if (wpm === null) return "#bdbdbd"; // gray
    if (wpm < targetWPM * 0.6) return "#f44336"; // red if <60% of target
    if (wpm < targetWPM * 0.8) return "#ff9800"; // orange if 60-80%
    return "#4caf50"; // green if >80%
  }, [wpm, targetWPM]);

  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: "60%" },
        track: { background: "#eee" },
        dataLabels: {
          name: { show: true, text: "WPM", offsetY: -10 },
          value: {
            show: true,
            fontSize: "22px",
            fontWeight: 600,
            formatter: (val: number) => `${val}`,
          },
        },
      },
    },
    colors: [color],
    labels: ["WPM"],
  }), [color]);

  const series = [wpm ?? 0]; // fallback to 0

  return (
    <DashboardCard title="Words Per Minute">
      <ReactApexChart key={wpm} options={chartOptions} series={series} type="radialBar" height={120} />
    </DashboardCard>
  );
};

export default WPMCard;
