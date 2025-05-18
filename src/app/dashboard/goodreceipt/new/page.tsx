import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { AccountantCreateView } from 'src/sections/goodreceipt/view';


// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Tạo phiếu nhập kho | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AccountantCreateView />;
}
