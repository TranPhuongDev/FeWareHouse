'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ExportDetailNewEditForm } from '../exportdetail-new-edit-form';
// ----------------------------------------------------------------------

export function GoodIssueCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tạo phiếu xuất kho"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Phiếu xuất', href: paths.dashboard.goodissue.root },
          { name: 'Tạo phiếu xuất kho' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExportDetailNewEditForm />
    </DashboardContent>
  );
}
