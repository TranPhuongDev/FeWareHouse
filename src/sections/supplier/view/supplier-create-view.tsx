'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { SupplierNewEditForm } from '../supplier-new-edit-form';

// ----------------------------------------------------------------------

export function SupplierCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new supplier"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Supplier', href: paths.dashboard.supplier.root },
          { name: 'New supplier' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SupplierNewEditForm />
    </DashboardContent>
  );
}
