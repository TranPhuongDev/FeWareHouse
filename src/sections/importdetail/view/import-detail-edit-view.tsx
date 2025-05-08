'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ImportDetailNewEditForm } from '../import-detail-new-edit-form';
import { ImportDetailAdd } from 'src/types/importdetail';

// ----------------------------------------------------------------------

type Props = {
  currentImportDetail?: ImportDetailAdd;
};
export function ImportDetailEditView({ currentImportDetail: currentImportDetail }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit a new import detail"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Import Detail', href: 'paths.dashboard.importware.root' },
          { name: 'New import detail' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ImportDetailNewEditForm currentImportDetail={currentImportDetail} />
    </DashboardContent>
  );
}
