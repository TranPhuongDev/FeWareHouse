'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ExportDetail } from 'src/types/exportdetail';
import { ExportDetailNewEditForm } from '../export-detail-new-edit.form';

// ----------------------------------------------------------------------

type Props = {
  currentExportDetail?: ExportDetail;
};
export function ExportDetailEditView({ currentExportDetail: currentExportDetail }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit a new export detail"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Import Export', href: paths.dashboard.importdetail.root },
          { name: 'New export detail' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExportDetailNewEditForm currentExportDetail={currentExportDetail} />
    </DashboardContent>
  );
}
