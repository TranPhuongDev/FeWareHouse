'use client';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ImportNewEditForm } from '../import-new-edit-form';
import { ImportItem } from 'src/types/importware';
// ----------------------------------------------------------------------

type Props = {
  currentImport?: ImportItem;
};
export function ImportEditView({ currentImport: currentImport }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit a import"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Import', href: paths.dashboard.importware.root },
          { name: currentImport?.importID.toString() },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ImportNewEditForm currentImport={currentImport} />
    </DashboardContent>
  );
}
