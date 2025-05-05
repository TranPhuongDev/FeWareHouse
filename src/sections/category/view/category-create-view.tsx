'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CategoryNewEditForm } from '../category-new-edit-form';
// ----------------------------------------------------------------------

export function CategoryCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new supplier"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Category', href: paths.dashboard.category.root },
          { name: 'New category' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CategoryNewEditForm />
    </DashboardContent>
  );
}
