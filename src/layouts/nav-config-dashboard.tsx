import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  category: icon('ic-cate'),
  customer: icon('ic-customer'),
  supplier: icon('ic-supplier'),
  importware: icon('ic-import'),
  importdetail: icon('ic-importdetail'),
  exportWare: icon('ic-export'),
  exportdetail: icon('ic-exportdetail'),
  iconorder: icon('ic-order'),
};

// ----------------------------------------------------------------------

/**
 * Input nav data is an array of navigation section items used to define the structure and content of a navigation bar.
 * Each section contains a subheader and an array of items, which can include nested children items.
 *
 * Each item can have the following properties:
 * - `title`: The title of the navigation item.
 * - `path`: The URL path the item links to.
 * - `icon`: An optional icon component to display alongside the title.
 * - `info`: Optional additional information to display, such as a label.
 * - `allowedRoles`: An optional array of roles that are allowed to see the item.
 * - `caption`: An optional caption to display below the title.
 * - `children`: An optional array of nested navigation items.
 * - `disabled`: An optional boolean to disable the item.
 */
export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [{ title: 'App', path: paths.dashboard.root, icon: ICONS.dashboard }],
  },
  /**
   * Accountant
   */
  {
    subheader: 'Accountant',
    items: [
      { title: 'Phiếu Nhập Kho', path: paths.dashboard.goodreceipt.root, icon: ICONS.iconorder },
      { title: 'Phiếu Xuất Kho', path: paths.dashboard.goodissue.root, icon: ICONS.iconorder },
      { title: 'Analytics', path: paths.dashboard.general.analytics, icon: ICONS.analytics },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Category',
        path: paths.dashboard.category.root,
        icon: ICONS.category,
        children: [
          { title: 'List', path: paths.dashboard.category.root },
          { title: 'Create', path: paths.dashboard.category.new },
        ],
      },
      {
        title: 'Product',
        path: paths.dashboard.product.root,
        icon: ICONS.product,
        children: [
          { title: 'List', path: paths.dashboard.product.root },
          { title: 'Create', path: paths.dashboard.product.new },
        ],
      },
      {
        title: 'Import',
        path: paths.dashboard.importware.root,
        icon: ICONS.importware,
        children: [
          { title: 'List', path: paths.dashboard.importware.root },
          { title: 'Create', path: paths.dashboard.importware.new },
        ],
      },
      {
        title: 'Import Detail',
        path: paths.dashboard.importdetail.root,
        icon: ICONS.importdetail,
        children: [
          { title: 'List', path: paths.dashboard.importdetail.root },
          { title: 'Create', path: paths.dashboard.importdetail.new },
        ],
      },
      {
        title: 'Export',
        path: paths.dashboard.exportware.root,
        icon: ICONS.exportWare,
        children: [
          { title: 'List', path: paths.dashboard.exportware.root },
          { title: 'Create', path: paths.dashboard.exportware.new },
        ],
      },
      {
        title: 'Export Detail',
        path: paths.dashboard.exportdetail.root,
        icon: ICONS.exportdetail,
        children: [
          { title: 'List', path: paths.dashboard.exportdetail.root },
          { title: 'Create', path: paths.dashboard.exportdetail.new },
        ],
      },
      {
        title: 'User',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Profile', path: paths.dashboard.user.root },
          { title: 'Cards', path: paths.dashboard.user.cards },
          { title: 'List', path: paths.dashboard.user.list },
          { title: 'Create', path: paths.dashboard.user.new },
          { title: 'Edit', path: paths.dashboard.user.demo.edit },
          { title: 'Account', path: paths.dashboard.user.account },
        ],
      },
      {
        title: 'Customer',
        path: paths.dashboard.customer.list,
        icon: ICONS.customer,
        children: [
          { title: 'List', path: paths.dashboard.customer.list },
          { title: 'Create', path: paths.dashboard.customer.new },
        ],
      },
      {
        title: 'Supplier',
        path: paths.dashboard.supplier.root,
        icon: ICONS.supplier,
        children: [
          { title: 'List', path: paths.dashboard.supplier.root },
          { title: 'Create', path: paths.dashboard.supplier.new },
        ],
      },
      {
        title: 'Order',
        path: paths.dashboard.order.root,
        icon: ICONS.order,
        children: [
          { title: 'List', path: paths.dashboard.order.root },
          { title: 'Details', path: paths.dashboard.order.demo.details },
        ],
      },
      {
        title: 'Invoice',
        path: paths.dashboard.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'List', path: paths.dashboard.invoice.root },
          { title: 'Details', path: paths.dashboard.invoice.demo.details },
          { title: 'Create', path: paths.dashboard.invoice.new },
          { title: 'Edit', path: paths.dashboard.invoice.demo.edit },
        ],
      },
    ],
  },
];
