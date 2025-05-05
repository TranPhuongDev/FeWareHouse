import type { Metadata } from 'next';
import type { IProduct } from 'src/types/product';

import { CONFIG } from 'src/global-config';
import axios, { endpoints } from 'src/lib/axios';

import { ProductEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Product edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  let currentProduct: IProduct | undefined;

  try {
    const response = await axios.get<IProduct>(`http://localhost:8080/api/products/${id}`);
    currentProduct = response.data;
  } catch (e: any) {
    console.error('Error fetching supplier:', e);
  }

  if (!currentProduct) {
    return <div>Supplier not found.</div>; // Hoặc một component hiển thị thông báo không tìm thấy
  }

  return <ProductEditView product={currentProduct} />;
}

// ----------------------------------------------------------------------

/**
 * Static Exports in Next.js
 *
 * 1. Set `isStaticExport = true` in `next.config.{mjs|ts}`.
 * 2. This allows `generateStaticParams()` to pre-render dynamic routes at build time.
 *
 * For more details, see:
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 *
 * NOTE: Remove all "generateStaticParams()" functions if not using static exports.
 */
// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.product.list);
//   const data: IProductItem[] = CONFIG.isStaticExport
//     ? res.data.products
//     : res.data.products.slice(0, 1);

//   return data.map((product) => ({
//     id: product.id,
//   }));
// }
