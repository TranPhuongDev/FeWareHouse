'use client';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ICategoryItem } from 'src/types/category';
import { ImportItemAdd } from 'src/types/importware';
import { ExportItemAdd } from 'src/types/exportware';
import { ExportNewEditForm } from '../export-new-edit-form';
// ----------------------------------------------------------------------

type Props = {
  currentExport?: ExportItemAdd;
};
export function ExportEditView({ currentExport: currentExport }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit a export"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Export', href: paths.dashboard.importware.root },
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExportNewEditForm currentExport={currentExport} />
    </DashboardContent>
  );
}
