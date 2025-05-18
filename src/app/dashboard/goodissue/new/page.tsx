import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { GoodIssueCreateView } from 'src/sections/goodissue/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Tạo phiếu nhập kho | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <GoodIssueCreateView />;
}
