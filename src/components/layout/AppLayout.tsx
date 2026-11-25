import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface AppLayoutProps {
  children: ReactNode;
}

/** Full-bleed shell — map + panel own the viewport; no marketing chrome. */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      sx={{
        height: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        // Must stay visible so Place Autocomplete predictions are not clipped
        overflow: 'visible',
      }}
    >
      {children}
    </Box>
  );
}
