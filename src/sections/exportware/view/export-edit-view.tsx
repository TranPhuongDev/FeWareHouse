'use client';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ExportNewEditForm } from '../export-new-edit-form';
import { ExportItem } from 'src/types/exportware';
// ----------------------------------------------------------------------

type Props = {
  currentExport?: ExportItem;
};
export function ExportEditView({ currentExport: currentExport }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit a export"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Export', href: paths.dashboard.exportware.root },
          { name: currentExport?.exportID.toString() },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExportNewEditForm currentExport={currentExport} />
    </DashboardContent>
  );
}
