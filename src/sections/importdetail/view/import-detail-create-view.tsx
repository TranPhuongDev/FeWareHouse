'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ImportDetailNewEditForm } from '../import-detail-new-edit-form';

// ----------------------------------------------------------------------

export function ImportDetailCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new import detail"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Import Detail', href: paths.dashboard.importdetail.root },
          { name: 'New import detail' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ImportDetailNewEditForm />
    </DashboardContent>
  );
}
