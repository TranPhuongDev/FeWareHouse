import { Metadata } from "next";
import { CONFIG } from "src/global-config";
import { OverviewCategoryView } from "src/sections/overview/category/view";

export const metadata: Metadata = { title: `Category | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewCategoryView />;
}
