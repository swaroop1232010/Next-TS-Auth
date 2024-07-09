'use client';

import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function DashboardView() {
  const { user } = useAuthContext();

  console.log(user?.firstName);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {`Welcome back 👋 \n ${user?.displayName ? user.displayName : user?.firstName}`} </Typography>
    </DashboardContent>
  );
}
