'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ExportDetailNewEditForm } from '../export-detail-new-edit.form';

// ----------------------------------------------------------------------

export function ExportDetailCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new export detail"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Export Detail', href: paths.dashboard.exportdetail.root },
          { name: 'New export detail' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExportDetailNewEditForm />
    </DashboardContent>
  );
}
