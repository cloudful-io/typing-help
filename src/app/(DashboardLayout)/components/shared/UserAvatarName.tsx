'use client';

import { Avatar, Box, Typography } from "@mui/material";

interface UserAvatarNameProps {
  displayName?: string | null;
  avatarUrl?: string | null;
  size?: number; 
  direction?: "row" | "column"; 
  showName?: boolean; 
}

export default function UserAvatarName({
  displayName,
  avatarUrl,
  size = 36,
  direction = "row",
  showName = true,
}: UserAvatarNameProps) {
  const DEFAULT_AVATAR = "/images/icons/user.png";

  const name = displayName || "Unknown User";
  const src = avatarUrl || DEFAULT_AVATAR;

  return (
    <Box
      display="flex"
      flexDirection={direction}
      alignItems="center"
      gap={direction === "row" ? 1.5 : 0.5}
    >
      <Avatar
        sx={{ width: size, height: size }}
        src={src}
        alt={name}
      >
        {/* fallback text if image fails */}
        {name[0]?.toUpperCase() ?? "U"}
      </Avatar>
      {showName && (
        <Typography
          variant="body1"
          sx={{
            textAlign: direction === "column" ? "center" : "left",
            fontWeight: 500,
          }}
        >
          {name}
        </Typography>
      )}
    </Box>
  );
}
