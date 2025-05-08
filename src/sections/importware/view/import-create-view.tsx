'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ImportNewEditForm } from '../import-new-edit-form';
// ----------------------------------------------------------------------

export function ImportCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new import"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Import', href: paths.dashboard.importware.root },
          { name: 'New import' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ImportNewEditForm />
    </DashboardContent>
  );
}
