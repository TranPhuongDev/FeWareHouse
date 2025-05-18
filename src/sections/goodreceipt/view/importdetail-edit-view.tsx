'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ImportDetailItem } from 'src/types/importware';
import { ImportDetailNewEditForm } from '../importdetail-new-edit-form';
// ----------------------------------------------------------------------
type Props = {
  currentImport?: ImportDetailItem;
};

export function AccountantEditView({ currentImport: currentImport }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Chỉnh sữa phiếu nhập kho"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Phiếu nhập', href: paths.dashboard.goodreceipt.root },
          { name: 'Chỉnh sửa phiếu nhập kho' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ImportDetailNewEditForm currentImport={currentImport} />
    </DashboardContent>
  );
}
