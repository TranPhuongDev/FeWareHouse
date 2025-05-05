'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CategoryNewEditForm } from '../category-new-edit-form';
import { ICategoryItem } from 'src/types/category';
// ----------------------------------------------------------------------

type Props = {
  currentCategory?: ICategoryItem;
};
export function CategoryEditView({ currentCategory: currentCategory }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit a category"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Category', href: paths.dashboard.category.root },
          { name: currentCategory?.categoryName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CategoryNewEditForm currentCategory={currentCategory} />
    </DashboardContent>
  );
}
