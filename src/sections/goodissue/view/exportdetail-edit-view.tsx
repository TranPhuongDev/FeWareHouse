'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ImportDetailItem } from 'src/types/importware';
import { ExportDetailItem } from 'src/types/exportware';
import { ExportDetailNewEditForm } from '../exportdetail-new-edit-form';
// ----------------------------------------------------------------------
type Props = {
  currentExport?: ExportDetailItem;
};

export function GoodIssueEditView({ currentExport: currentExport }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Chỉnh sữa phiếu xuất kho"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Phiếu xuất', href: paths.dashboard.goodissue.root },
          { name: 'Chỉnh sửa phiếu xuất kho' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExportDetailNewEditForm currentExport={currentExport} />
    </DashboardContent>
  );
}
