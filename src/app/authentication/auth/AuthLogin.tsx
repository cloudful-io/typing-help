'use client';

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress
} from "@mui/material";
import { signIn, getProviders } from 'next-auth/react';

import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import AppleIcon from '@mui/icons-material/Apple';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import LockIcon from '@mui/icons-material/Lock';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import SecurityIcon from '@mui/icons-material/Security';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

interface loginType {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

const providerIcons: Record<string, React.ReactNode> = {
  google: <GoogleIcon />,
  github: <GitHubIcon />,
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />,
  linkedin: <LinkedInIcon />,
  email: <EmailIcon />,
  apple: <AppleIcon />,
  discord: <ChatBubbleIcon />,
  slack: <ChatBubbleIcon />,
  auth0: <LockIcon />,
  'azure-ad': <CloudQueueIcon />,
  cognito: <CloudQueueIcon />,
  okta: <SecurityIcon />,
  twitch: <VideogameAssetIcon />,
  notion: null,
  spotify: null,
  reddit: null,
  stripe: null,
};

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [providers, setProviders] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  if (!providers) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      {subtitle}

      {providers && (
        <Stack spacing={2} mt={2}>
          {Object.values(providers).map((provider: any) => (
            <Button
              key={provider.id}
              variant="outlined"
              startIcon={providerIcons[provider.id] || null}
              onClick={() => signIn(provider.id)}
            >
              Sign in with {provider.name}
            </Button>
          ))}
        </Stack>
      )}
    </>
  );
};

export default AuthLogin;
