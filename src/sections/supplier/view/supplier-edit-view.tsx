'use client';


import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IAddSupplierItem } from 'src/types/supplier';
import { SupplierNewEditForm } from '../supplier-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  supplier?: IAddSupplierItem;
};

export function SupplierEditView({ supplier: currentSupplier }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.user.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Supplier', href: paths.dashboard.user.root },
          { name: currentSupplier?.supplierName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SupplierNewEditForm currentSupplier={currentSupplier} />
    </DashboardContent>
  );
}
