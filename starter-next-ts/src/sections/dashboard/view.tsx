'use client';

import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function DashboardView() {
  const { user } = useAuthContext();

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {`Welcome back 👋 \n ${user?.displayName}`} </Typography>
    </DashboardContent>
  );
}
