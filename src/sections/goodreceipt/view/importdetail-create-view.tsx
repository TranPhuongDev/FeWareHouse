'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ImportDetailNewEditForm } from '../importdetail-new-edit-form';
// ----------------------------------------------------------------------

export function AccountantCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tạo phiếu nhập kho"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Phiếu nhập', href: paths.dashboard.goodreceipt.root },
          { name: 'Tạo phiếu nhập kho' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ImportDetailNewEditForm />
    </DashboardContent>
  );
}
