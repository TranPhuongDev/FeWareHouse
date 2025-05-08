'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ExportNewEditForm } from '../export-new-edit-form';
// ----------------------------------------------------------------------

export function ExportCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new export"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Export', href: paths.dashboard.exportware.root },
          { name: 'New export' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExportNewEditForm />
    </DashboardContent>
  );
}
