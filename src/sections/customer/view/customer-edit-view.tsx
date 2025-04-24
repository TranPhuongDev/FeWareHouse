'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CustomerNewEditForm } from '../customer-new-edit-form';
import { ICustomerItem } from 'src/types/customer';

// ----------------------------------------------------------------------

type Props = {
  customer?: ICustomerItem;
};

export function CustomerEditView({ customer: currentCustomer }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.user.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Customer', href: paths.dashboard.user.root },
          { name: currentCustomer?.customerName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CustomerNewEditForm currentCustomer={currentCustomer} />
    </DashboardContent>
  );
}
