'use client';

import { Box, Typography } from '@mui/material';
import { varAlpha } from 'minimal-shared/utils';
import { DashboardContent } from 'src/layouts/dashboard';

export function OverviewCategoryView() {
  return (
    <DashboardContent
      maxWidth={false}
      disablePadding
      sx={[
        (theme) => ({
          borderTop: { lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}` },
        }),
      ]}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: { xs: 'column', lg: 'row' } }}>
        <Box
          sx={[
            (theme) => ({
              gap: 3,
              display: 'flex',
              minWidth: { lg: 0 },
              py: { lg: 3, xl: 5 },
              flexDirection: 'column',
              flex: { lg: '1 1 auto' },
              px: { xs: 2, sm: 3, xl: 5 },
              borderRight: {
                lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
              },
            }),
          ]}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Hi, Xĩn👋
            </Typography>
            <Typography
              sx={{ color: 'text.secondary' }}
            >{`Let's learn something new today!`}</Typography>
          </Box>
        </Box>
      </Box>
    </DashboardContent>
  );
}
