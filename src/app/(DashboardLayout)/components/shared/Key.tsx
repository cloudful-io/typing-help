import React from "react";
import { Button } from "@mui/material";

interface KeyProps {
  label: string;
  onPress: (key: string) => void;
  width?: string | number;
  active?: boolean;
}

const Key: React.FC<KeyProps> = ({ label, onPress, width, active }) => {
  return (
    <Button
      variant={active ? "contained" : "outlined"}
      color={active ? "primary" : "inherit"}
      onClick={() => onPress(label)}
      sx={{
        minWidth: width || "4vw",
        minHeight: "8vh",
        fontSize: "1.2rem",
        flexGrow: 1,
      }}
    >
      {label}
    </Button>
  );
};

export default Key;
